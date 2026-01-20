import OpenAI from 'openai';

// Prefer env-provided base URL so we don't leak service endpoints in code
const NEBIUS_API_BASE_URL =
  process.env.NEXT_PUBLIC_NEBIUS_API_BASE_URL || "https://api.studio.nebius.com/v1/";

// Initialize Nebius AI client with OpenAI SDK
export const nebiusClient = new OpenAI({
  baseURL: NEBIUS_API_BASE_URL,
  apiKey: process.env.NEXT_PUBLIC_NEBIUS_AI_API_KEY,
  dangerouslyAllowBrowser: true // Allow client-side usage
});

// Model configuration
export const NEBIUS_CONFIG = {
  model: "Qwen/Qwen3-30B-A3B-Thinking-2507",
  temperature: 0.4,
  top_p: 0.4,
  max_tokens: 800,
  top_k: 50,
};
// Type for chat messages
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Legal-focused system prompt
export const LEGAL_SYSTEM_PROMPT: ChatMessage = {
  role: 'system',
  content: `You are LawGPT, the formal legal information assistant for the Turn2Law platform.

Style and tone:
- Formal, precise, and neutral; use domain-appropriate vocabulary.
- Keep responses concise; default to 3–6 sentences.
- Scale length only with query complexity; avoid verbosity.
- Begin with a one‑sentence executive summary that directly answers the question.
- Plain text only. Do not use Markdown, asterisks, italics, emojis, or headings.

Substance:
- Provide general legal information and procedural guidance.
- Explain concepts and options clearly; note jurisdictional variance when relevant.
- Indicate when consulting a licensed attorney is advisable.

Structure:
- Executive summary (one sentence).
- Key points or steps (up to three hyphen bullets).
- Optional next steps only if explicitly requested.

Compliance:
- You are not a replacement for a lawyer and must not provide specific legal advice.
- End with: This is general information, not legal advice.`,
};

// Function to get AI response
export async function getLegalAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const messages: ChatMessage[] = [
      LEGAL_SYSTEM_PROMPT,
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await nebiusClient.chat.completions.create({
      model: NEBIUS_CONFIG.model,
      temperature: NEBIUS_CONFIG.temperature,
      top_p: NEBIUS_CONFIG.top_p,
      max_tokens: NEBIUS_CONFIG.max_tokens,
      // @ts-expect-error Nebius OpenAI-compatible API supports top_k
      top_k: NEBIUS_CONFIG.top_k,
      messages,
    });

    return response.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
  } catch (error) {
    console.error('Nebius AI Error:', error);
    throw new Error('Failed to get AI response. Please try again.');
  }
}

// Function for lawyer matching
export async function getAILawyerRecommendations(
  legalIssue: string
): Promise<string> {
  try {
    const prompt = `Based on this legal issue: "${legalIssue}"
Provide recommendations for:
- Type of lawyer needed (specialization)
- Key qualifications to look for
- Questions to ask during consultation
- Preparation tips for the meeting
Keep it concise and actionable.`;

    const response = await nebiusClient.chat.completions.create({
      model: NEBIUS_CONFIG.model,
      temperature: 0.4,
      top_p: 0.4,
      max_tokens: NEBIUS_CONFIG.max_tokens,
      // @ts-expect-error Nebius OpenAI-compatible API supports top_k
      top_k: NEBIUS_CONFIG.top_k,
      messages: [
        { role: 'system', content: 'You are a legal advisor helping match clients with appropriate lawyers. Plain text only; no Markdown or asterisks. Be concise and professional.' },
        { role: 'user', content: prompt }
      ],
    });

    return response.choices[0]?.message?.content || 'Unable to generate recommendations.';
  } catch (error) {
    console.error('Nebius AI Error:', error);
    throw new Error('Failed to get lawyer recommendations.');
  }
}

// Check if API key is configured
if (!process.env.NEXT_PUBLIC_NEBIUS_AI_API_KEY) {
  console.warn('⚠️ NEXT_PUBLIC_NEBIUS_AI_API_KEY is not configured. AI features will not work.');
}