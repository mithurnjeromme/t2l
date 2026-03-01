import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// ──────────────────────────────────────────────
//  OpenRouter AI — plain fetch (no extra package)
//  OpenAI-compatible API via OpenRouter
// ──────────────────────────────────────────────
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL    = 'google/gemini-2.0-flash-001';

async function callOpenRouterAI(systemPrompt: string, userPrompt: string): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.warn('[Legal Navigator] OPENROUTER_API_KEY not set — skipping AI enrichment');
    return null;
  }

  try {
    const res = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://turn2law.tech',
        'X-Title': 'Turn2Law Legal Navigator',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        temperature: 0.3,
        max_tokens: 600,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt   },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Legal Navigator] OpenRouter error:', res.status, err);
      return null;
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content?.trim() ?? null;
  } catch (err) {
    console.error('[Legal Navigator] OpenRouter fetch error:', err);
    return null;
  }
}

// ──────────────────────────────────────────────
//  Interfaces
// ──────────────────────────────────────────────
interface LegalNavigatorRequest {
  problem_description: string;
  location: string;
}

interface RecommendedAuthority {
  name: string;
  type: string;
  description: string;
}

interface OfficeDetails {
  address: string;
  contact: string;
  working_hours: string;
}

interface OnlinePortal {
  available: boolean;
  link: string;
}

interface LegalNavigatorResponse {
  problem_summary: string;
  category: string;
  recommended_authority: RecommendedAuthority;
  action_steps: string[];
  documents_required: string[];
  office_details: OfficeDetails;
  online_portal: OnlinePortal;
  map_link: string;
  legal_note: string;
  turn2law_cta: string;
}

// ──────────────────────────────────────────────
//  Keyword Classification Logic
// ──────────────────────────────────────────────

type Category =
  | 'Consumer'
  | 'Civil'
  | 'Labour'
  | 'Corporate'
  | 'Criminal'
  | 'Public Grievance';

interface ClassificationResult {
  category: Category;
  subtype: string;
}

function classifyProblem(text: string): ClassificationResult {
  const lower = text.toLowerCase();

  // Criminal / Fraud / Arrest
  if (/(fraud|scam|cheating|cyber|hack|phishing|extortion|blackmail|theft|robbery|assault|harassment|abuse|rape|murder|kidnap|stalking|bribe|forgery|fake|drug|drugs|narcotic|arrested|arrest|bail|fir|police|accused|case filed|criminal|ndps|pocso|ipc|section 302|section 376)/i.test(lower)) {
    if (/(cyber|online|internet|digital|phishing|hack)/i.test(lower)) {
      return { category: 'Criminal', subtype: 'cyber' };
    }
    if (/(drug|narcotic|ndps|possession)/i.test(lower)) {
      return { category: 'Criminal', subtype: 'ndps' };
    }
    if (/(arrest|bail|fir|police|accused|charged|custody|remand)/i.test(lower)) {
      return { category: 'Criminal', subtype: 'arrest' };
    }
    return { category: 'Criminal', subtype: 'general' };
  }

  // Labour
  if (/(salary|wage|pay|payroll|unpaid|employee|employer|workplace|termination|fired|retrench|pf|esic|provident fund|labour|overtime|leave|resign|dismissal|gratuity|bonus)/i.test(lower)) {
    return { category: 'Labour', subtype: 'salary' };
  }

  // Corporate / Company
  if (/(company|mca|roc|director|incorporation|shareholder|compliance|gst|tax|income tax|itr|pan|startup|llp|partnership|pvt ltd|trademark|patent|copyright|intellectual property)/i.test(lower)) {
    return { category: 'Corporate', subtype: 'company' };
  }

  // Consumer
  if (/(product|service|defective|warranty|refund|consumer|e-commerce|amazon|flipkart|insurance|hospital|doctor|medical|bank|loan|credit card|telecom|mobile|broadband|electricity bill|gas|water bill|ration card)/i.test(lower)) {
    if (/(electricity|power|light bill|transformer|outage|blackout|connection)/i.test(lower)) {
      return { category: 'Public Grievance', subtype: 'electricity' };
    }
    if (/(bank|loan|credit|emi|npa|nbfc|upi|payment|transaction)/i.test(lower)) {
      return { category: 'Consumer', subtype: 'banking' };
    }
    return { category: 'Consumer', subtype: 'general' };
  }

  // Public Grievance
  if (/(municipality|municipal|water|road|drainage|sewage|garbage|waste|noise|pollution|ration|aadhaar|passport|driving license|traffic|police|government|pension|bpl|certificate|land|property tax|electricity|power)/i.test(lower)) {
    return { category: 'Public Grievance', subtype: 'municipal' };
  }

  // Civil (Rent / Property / Family default)
  if (/(rent|deposit|landlord|tenant|eviction|lease|property|ownership|boundary|trespass|family|divorce|custody|maintenance|alimony|will|inheritance|succession|partition)/i.test(lower)) {
    if (/(rent|deposit|landlord|tenant|eviction|lease)/i.test(lower)) {
      return { category: 'Civil', subtype: 'rent' };
    }
    if (/(family|divorce|custody|maintenance|alimony|will|inheritance|succession)/i.test(lower)) {
      return { category: 'Civil', subtype: 'family' };
    }
    return { category: 'Civil', subtype: 'property' };
  }

  // Default
  return { category: 'Civil', subtype: 'general' };
}

// ──────────────────────────────────────────────
//  Authority + Steps + Documents Mapping
// ──────────────────────────────────────────────

interface AuthorityInfo {
  authority: RecommendedAuthority;
  action_steps: string[];
  documents_required: string[];
  office_details: OfficeDetails;
  online_portal: OnlinePortal;
}

function getAuthorityInfo(
  classification: ClassificationResult,
  location: string,
  description: string
): AuthorityInfo {
  const city = location.split(/[,\/]/)[0].trim();
  const lower = description.toLowerCase();

  switch (classification.category) {

    // ── CONSUMER ──────────────────────────────
    case 'Consumer': {
      if (classification.subtype === 'banking') {
        return {
          authority: {
            name: 'Banking Ombudsman / RBI Grievance Cell',
            type: 'Regulatory Authority',
            description:
              'The RBI Banking Ombudsman handles complaints related to banking services, loan disputes, unauthorized transactions, and credit card issues free of charge.',
          },
          action_steps: [
            'First raise a formal written complaint with your bank\'s customer care/branch and get a reference number.',
            'If unresolved within 30 days, file a complaint on the RBI Integrated Ombudsman Scheme portal at https://cms.rbi.org.in.',
            'Alternatively, file a Consumer Complaint at the District Consumer Forum for compensation.',
            'Preserve all bank statements, transaction records, and written communication as evidence.',
            'If fraud is involved, also lodge an FIR at the local police station and report on cybercrime.gov.in.',
          ],
          documents_required: [
            'Government-issued ID proof (Aadhaar / PAN / Passport)',
            'Bank account statements (last 6 months)',
            'Screenshot or printout of disputed transaction(s)',
            'Copy of complaint lodged with the bank and their response',
            'Loan agreement / credit card statement (if applicable)',
          ],
          office_details: {
            address: `RBI Regional Office, ${city}`,
            contact: '14448 (RBI Helpline) | cms.rbi.org.in',
            working_hours: 'Mon–Fri: 10:00 AM – 5:00 PM',
          },
          online_portal: {
            available: true,
            link: 'https://cms.rbi.org.in',
          },
        };
      }
      return {
        authority: {
          name: 'District Consumer Disputes Redressal Commission (DCDRC)',
          type: 'Consumer Forum',
          description:
            'The District Consumer Forum handles complaints about defective products, poor services, unfair trade practices, and demands for refunds or compensation up to ₹1 Crore.',
        },
        action_steps: [
          'Send a formal legal notice to the seller/service provider via registered post giving them 15 days to respond.',
          'If unresolved, file a consumer complaint online at https://consumerhelpline.gov.in or visit the nearest DCDRC.',
          'Attach all supporting evidence: bills, receipts, screenshots, and prior correspondence.',
          'Pay the nominal court fee (varies by claim amount) and submit the complaint.',
          'Attend hearings as scheduled; the forum typically resolves cases within 90–150 days.',
        ],
        documents_required: [
          'Government-issued ID proof (Aadhaar / Voter ID / Passport)',
          'Original purchase invoice or contract',
          'Warranty / guarantee card (if applicable)',
          'Screenshots or printouts of all communication with the seller',
          'Bank transaction proof or payment receipt',
          'Copy of legal notice sent and any response received',
        ],
        office_details: {
          address: `District Consumer Disputes Redressal Commission, ${city}`,
          contact: '1915 (National Consumer Helpline) | consumerhelpline.gov.in',
          working_hours: 'Mon–Fri: 10:00 AM – 5:00 PM (Sat: 10:00 AM – 1:00 PM)',
        },
        online_portal: {
          available: true,
          link: 'https://consumerhelpline.gov.in',
        },
      };
    }

    // ── CIVIL – RENT ──────────────────────────
    case 'Civil': {
      if (classification.subtype === 'rent') {
        return {
          authority: {
            name: 'Rent Authority / Civil Court',
            type: 'Civil Court',
            description:
              'Disputes between landlords and tenants — including deposit recovery, unlawful eviction, or rent hikes — are handled by the Rent Control Authority or Civil Court in your jurisdiction.',
          },
          action_steps: [
            'Send a formal written notice to your landlord via registered post demanding return of the security deposit within 15 days.',
            'If no response, approach the Rent Control Authority (or Civil Court for unlawful eviction) with your rental agreement.',
            'File a civil suit for recovery of money if the dispute exceeds the Rent Authority\'s jurisdiction.',
            'Alternatively, file a consumer complaint if the landlord is a commercial entity.',
            'Preserve all rent receipts, bank transfer records, and all written/WhatsApp communication as evidence.',
          ],
          documents_required: [
            'Original rental/lease agreement',
            'All rent payment receipts',
            'Bank transfer records showing rent / deposit payments',
            'Government-issued ID proof (Aadhaar / Passport)',
            'Screenshots of WhatsApp/email communications with landlord',
            'Police complaint copy (if landlord is threatening or refusing entry)',
          ],
          office_details: {
            address: `Rent Control Authority / Civil Court, ${city}`,
            contact: 'Contact your local District Court for exact details',
            working_hours: 'Mon–Sat: 10:30 AM – 4:30 PM (Court days)',
          },
          online_portal: {
            available: true,
            link: 'https://services.ecourts.gov.in',
          },
        };
      }
      if (classification.subtype === 'family') {
        return {
          authority: {
            name: 'Family Court',
            type: 'Civil Court — Family Division',
            description:
              'Family Courts handle matters of divorce, judicial separation, child custody, maintenance, alimony, and inheritance disputes in a structured and confidential environment.',
          },
          action_steps: [
            'Consult a family law advocate to understand your rights and the applicable personal law (Hindu, Muslim, Christian, etc.).',
            'Attempt mediation or counselling as courts often recommend it before proceedings.',
            'File your petition at the Family Court in the city where either party resides or where the marriage took place.',
            'Attend all scheduled hearings; Family Court cases typically take 6 months to 3 years.',
            'Apply for interim relief (maintenance, injunction) if urgently needed.',
          ],
          documents_required: [
            'Marriage certificate',
            'Government-issued ID proof for both parties (Aadhaar / Passport)',
            'Birth certificates of children (if custody involved)',
            'Income proof / salary slips (for maintenance claims)',
            'Property documents (if partition or matrimonial property is involved)',
            'Any prior legal notices or court orders',
          ],
          office_details: {
            address: `Family Court, ${city}`,
            contact: 'Contact your local District Legal Services Authority (DLSA)',
            working_hours: 'Mon–Sat: 10:30 AM – 4:30 PM (Court days)',
          },
          online_portal: {
            available: true,
            link: 'https://services.ecourts.gov.in',
          },
        };
      }
      return {
        authority: {
          name: 'Civil Court / District Court',
          type: 'Civil Court',
          description:
            'Civil Courts resolve property disputes, monetary claims, contract breaches, and injunctions through the formal legal process.',
        },
        action_steps: [
          'Consult a civil lawyer to assess your case and prepare legal notices.',
          'Send a formal legal notice to the opposing party via registered post.',
          'File a civil suit in the appropriate court based on the value and nature of the dispute.',
          'Attend hearings as scheduled; bring all original documents.',
          'Consider Lok Adalat or mediation for a faster, cost-effective resolution.',
        ],
        documents_required: [
          'Government-issued ID proof',
          'All relevant agreements, contracts, or deeds',
          'Payment receipts and transaction records',
          'Previous legal notices and responses',
          'Witness statements (if available)',
        ],
        office_details: {
          address: `District Civil Court, ${city}`,
          contact: 'Contact your local Bar Association for lawyer referrals',
          working_hours: 'Mon–Sat: 10:30 AM – 4:30 PM (Court days)',
        },
        online_portal: {
          available: true,
          link: 'https://services.ecourts.gov.in',
        },
      };
    }

    // ── LABOUR ────────────────────────────────
    case 'Labour': {
      return {
        authority: {
          name: 'Labour Commissioner / Labour Court',
          type: 'Government Labour Authority',
          description:
            'The Labour Commissioner handles complaints related to unpaid wages, wrongful termination, PF/ESIC violations, and workplace harassment. Cases escalate to the Labour Court if unresolved.',
        },
        action_steps: [
          'Send a written demand notice to your employer citing specific dues (salary, PF, gratuity) with exact amounts and dates.',
          'File a complaint with the Labour Commissioner\'s office in your district with supporting documents.',
          'For PF-related disputes, separately file a grievance on https://epfigms.gov.in.',
          'If the employer ignores the Labour Commissioner\'s intervention, the case is referred to the Labour Court.',
          'Engage a labour law advocate for cases involving wrongful termination or large arrears.',
        ],
        documents_required: [
          'Employment appointment letter',
          'Salary slips (all available months)',
          'Bank account statements showing salary credits / stoppage',
          'Offer letter / employment contract',
          'PF account details (UAN number)',
          'Government-issued ID proof (Aadhaar / PAN)',
          'Any written communication with HR or management',
        ],
        office_details: {
          address: `Office of the Labour Commissioner, ${city}`,
          contact: '1800-11-9090 (Labour Helpline) | shramlabour.gov.in',
          working_hours: 'Mon–Fri: 10:00 AM – 5:00 PM',
        },
        online_portal: {
          available: true,
          link: 'https://epfigms.gov.in',
        },
      };
    }

    // ── CORPORATE ─────────────────────────────
    case 'Corporate': {
      return {
        authority: {
          name: 'Ministry of Corporate Affairs (MCA) / Registrar of Companies (ROC)',
          type: 'Regulatory Authority',
          description:
            'The MCA and ROC handle company incorporation, compliance filings, director disputes, shareholder grievances, and corporate fraud under the Companies Act, 2013.',
        },
        action_steps: [
          'Identify the specific non-compliance or dispute (e.g., unpaid dividend, director fraud, GST default).',
          'File a complaint on the MCA21 portal at https://mca.gov.in for corporate grievances.',
          'For GST/tax disputes, file a grievance with your jurisdictional GST officer or on https://selfservice.gstsystem.in.',
          'For trademark/IP issues, approach the Intellectual Property India office or file online at https://ipindia.gov.in.',
          'Consult a corporate lawyer for shareholder disputes or winding-up petitions.',
        ],
        documents_required: [
          'Company CIN / Registration Number',
          'Director Identification Number (DIN) if applicable',
          'MOA / AOA of the company',
          'Shareholder agreement (if applicable)',
          'GST / PAN / TAN details',
          'Financial statements and audit reports',
          'Any written dispute correspondence',
        ],
        office_details: {
          address: `Registrar of Companies (ROC), ${city}`,
          contact: 'MCA Helpline: 0124-4832500 | mca.gov.in',
          working_hours: 'Mon–Fri: 9:30 AM – 6:00 PM',
        },
        online_portal: {
          available: true,
          link: 'https://mca.gov.in',
        },
      };
    }

    // ── CRIMINAL ──────────────────────────────
    case 'Criminal': {
      if (classification.subtype === 'cyber') {
        return {
          authority: {
            name: 'Cyber Crime Cell / National Cyber Crime Reporting Portal',
            type: 'Law Enforcement',
            description:
              'Cybercrime cells handle complaints of online fraud, phishing, social media harassment, identity theft, ransomware, and UPI-related financial fraud.',
          },
          action_steps: [
            'Immediately report the crime at https://cybercrime.gov.in or call the helpline number 1930.',
            'Lodge an FIR at the nearest police station with cybercrime jurisdiction.',
            'Collect and preserve all digital evidence: screenshots, email headers, transaction IDs, URLs, and device logs.',
            'Notify your bank immediately if any financial fraud occurred and request a chargeback/freeze.',
            'Contact the platform (Google, Facebook, etc.) to report and block the perpetrator.',
          ],
          documents_required: [
            'Government-issued ID proof (Aadhaar / PAN / Passport)',
            'Screenshots of fraudulent messages, emails, or transactions',
            'Transaction reference numbers and bank statements',
            'URLs, email addresses, or phone numbers used by the fraudster',
            'Device information (phone model, app name, timestamp)',
          ],
          office_details: {
            address: `Cyber Crime Cell, ${city} Police Headquarters`,
            contact: '1930 (Cyber Crime Helpline) | cybercrime.gov.in',
            working_hours: '24×7 Helpline | Office: Mon–Sat 10:00 AM – 5:00 PM',
          },
          online_portal: {
            available: true,
            link: 'https://cybercrime.gov.in',
          },
        };
      }

      if (classification.subtype === 'ndps') {
        return {
          authority: {
            name: 'Sessions Court / High Court — Criminal Side',
            type: 'Judicial Authority',
            description:
              'NDPS Act (Narcotic Drugs and Psychotropic Substances) cases are tried before Sessions Courts. Bail applications under NDPS require satisfying strict conditions under Section 37 of the NDPS Act.',
          },
          action_steps: [
            'Immediately engage a criminal lawyer experienced in NDPS cases — do this before any police statement is made.',
            'Apply for regular bail before the Sessions Court under Section 439 CrPC (bail conditions under NDPS are stringent).',
            'Ensure the accused does NOT make any self-incriminating statement without legal counsel present.',
            'Verify the drug quantity: commercial quantity triggers harsher bail restrictions; small quantity has lighter provisions.',
            'Collect evidence of false implication: witness statements, CCTV, call records, alibi proof.',
            'If bail is denied at Sessions Court, file a bail application before the High Court.',
            'File a complaint against police misconduct with the State Human Rights Commission or Superintendent of Police.',
          ],
          documents_required: [
            'Copy of FIR (First Information Report)',
            'Remand order / custody documents',
            'ID proof of accused (Aadhaar / PAN / Passport)',
            'Evidence of false implication (CCTV, witnesses, alibi)',
            'Medical fitness certificate of accused',
            'Surety documents for bail (property papers, guarantor ID)',
          ],
          office_details: {
            address: `${city} Sessions Court, District & Sessions Judge`,
            contact: 'District Court Helpline: ecourts.gov.in | National Legal Aid: 15100',
            working_hours: 'Mon–Sat: 10:30 AM – 4:30 PM (except holidays)',
          },
          online_portal: {
            available: true,
            link: 'https://ecourts.gov.in',
          },
        };
      }

      if (classification.subtype === 'arrest') {
        return {
          authority: {
            name: 'Sessions Court / Magistrate Court — Bail & Criminal Defence',
            type: 'Judicial Authority',
            description:
              'For wrongful arrests and bail matters, the Sessions Court or Magistrate Court grants bail under CrPC Section 437/439. The High Court can also be approached via habeas corpus if detention is illegal.',
          },
          action_steps: [
            'Immediately hire a criminal lawyer to represent the arrested person.',
            'The arrested person has a RIGHT to know grounds of arrest (Article 22 of Constitution) and must be produced before a Magistrate within 24 hours.',
            'Apply for bail before the Magistrate (Section 437 CrPC) or Sessions Court (Section 439 CrPC).',
            'If arrest is illegal or custody is prolonged without cause, file a Habeas Corpus writ petition before the High Court.',
            'File a complaint against police misconduct to the State Human Rights Commission (SHRC) or DGP office.',
            'Obtain a copy of the FIR and all arrest memos — this is your legal right.',
          ],
          documents_required: [
            'Copy of FIR and arrest memo',
            'ID proof of the accused',
            'Surety documents for bail (guarantor ID, property papers)',
            'Evidence supporting innocence (alibi, CCTV, witnesses)',
            'Medical certificate if physical abuse occurred',
          ],
          office_details: {
            address: `${city} District & Sessions Court`,
            contact: 'National Legal Aid Helpline: 15100 | ecourts.gov.in',
            working_hours: 'Mon–Sat: 10:30 AM – 4:30 PM',
          },
          online_portal: {
            available: true,
            link: 'https://ecourts.gov.in',
          },
        };
      }
      return {
        authority: {
          name: 'Local Police Station',
          type: 'Law Enforcement',
          description:
            'For criminal offences including assault, fraud, harassment, theft, or intimidation, an FIR must be lodged at the local police station having jurisdiction over where the incident occurred.',
        },
        action_steps: [
          'Approach the police station with territorial jurisdiction over the crime location.',
          'Request to file an FIR (First Information Report) — this is your legal right under Section 154 CrPC.',
          'If police refuse to register FIR, approach the Superintendent of Police (SP) or file a complaint before the Magistrate.',
          'Preserve all evidence: physical objects, photographs, CCTV footage, witness contacts.',
          'If personal safety is at risk, also apply for protection order from the Magistrate.',
        ],
        documents_required: [
          'Government-issued ID proof',
          'Written complaint / incident description',
          'Medical reports (if physical injury)',
          'Photographs or video evidence',
          'Witness names and contact details',
          'Any prior complaints or threats received (WhatsApp, email)',
        ],
        office_details: {
          address: `${city} Police Station (jurisdictional)`,
          contact: '100 (Police Emergency) | 112 (Unified Emergency)',
          working_hours: '24×7',
        },
        online_portal: {
          available: true,
          link: 'https://citizen.mahapolice.gov.in', // generic state example; real users will be directed to their state
        },
      };
    }

    // ── PUBLIC GRIEVANCE ─────────────────────
    case 'Public Grievance': {
      if (classification.subtype === 'electricity') {
        return {
          authority: {
            name: 'State Electricity Board / DISCOM',
            type: 'Public Utility Authority',
            description:
              'Electricity-related complaints (billing errors, outages, faulty meters, new connections) are handled by your State Distribution Company (DISCOM) and the Electricity Ombudsman.',
          },
          action_steps: [
            'Call your DISCOM\'s toll-free customer care number or visit the nearest electricity sub-office.',
            'Register a formal written complaint and note the complaint reference number.',
            'If unresolved within 15 days, escalate to the Electricity Ombudsman / State Electricity Regulatory Commission (SERC).',
            'File on the National Grievance Portal at https://pgportal.gov.in for escalation.',
            'For billing fraud, keep all old bills and request a meter audit in writing.',
          ],
          documents_required: [
            'Consumer number / account number',
            'Recent electricity bills (last 3–6 months)',
            'Photographs of the meter / damaged equipment',
            'ID proof linked to the connection',
            'Previous complaint reference numbers',
          ],
          office_details: {
            address: `State Electricity Board / DISCOM Office, ${city}`,
            contact: '1912 (National Electricity Helpline) | DISCOM customer care',
            working_hours: 'Mon–Sat: 9:00 AM – 5:00 PM',
          },
          online_portal: {
            available: true,
            link: 'https://pgportal.gov.in',
          },
        };
      }
      return {
        authority: {
          name: 'Municipal Corporation / Public Grievance Redressal Authority',
          type: 'Government Authority',
          description:
            'Civic issues such as road damage, water supply, drainage, garbage disposal, and other municipal services are managed by the Municipal Corporation / Gram Panchayat.',
        },
        action_steps: [
          'File a complaint on the centralized Public Grievance Portal at https://pgportal.gov.in.',
          'Alternatively, register your grievance with the local municipal ward office in person.',
          'Use your state\'s dedicated civic app (e.g., Seva Sindhu, MyCMC, Mumbai311) if available.',
          'Get a complaint acknowledgement number and track status online.',
          'If unresolved within 30 days, escalate to the District Magistrate or file on https://pgportal.gov.in.',
        ],
        documents_required: [
          'Government-issued ID proof',
          'Address proof (utility bill / Aadhaar)',
          'Photographs or videos of the issue (road damage, water leakage, etc.)',
          'Previous complaint acknowledgement numbers (if any)',
        ],
        office_details: {
          address: `Municipal Corporation Ward Office, ${city}`,
          contact: '1533 (Civic Helpline) | pgportal.gov.in',
          working_hours: 'Mon–Sat: 10:00 AM – 5:00 PM',
        },
        online_portal: {
          available: true,
          link: 'https://pgportal.gov.in',
        },
      };
    }

    default:
      return {
        authority: {
          name: 'District Legal Services Authority (DLSA)',
          type: 'Legal Aid Authority',
          description:
            'The DLSA provides free legal services, guidance, and referrals to the appropriate court or authority for any legal issue.',
        },
        action_steps: [
          'Visit the District Legal Services Authority (DLSA) for a free consultation.',
          'Explain your issue and get guidance on the appropriate authority and legal remedy.',
          'Collect all relevant documents before approaching any authority.',
          'Consider mediation or Lok Adalat for a faster, cost-effective resolution.',
          'Consult a qualified lawyer for complex legal matters.',
        ],
        documents_required: [
          'Government-issued ID proof',
          'All relevant documents related to your issue',
          'Written description of the problem with timeline',
        ],
        office_details: {
          address: `District Legal Services Authority (DLSA), ${city}`,
          contact: '15100 (NALSA Legal Aid Helpline)',
          working_hours: 'Mon–Sat: 10:00 AM – 5:00 PM',
        },
        online_portal: {
          available: true,
          link: 'https://nalsa.gov.in',
        },
      };
  }
}

// ──────────────────────────────────────────────
//  Generate Problem Summary
// ──────────────────────────────────────────────
function generateSummary(description: string, location: string, category: Category): string {
  const trimmed = description.trim();
  const city = location.split(/[,\/]/)[0].trim();
  return `You have raised a ${category} issue in ${city} regarding the following matter: "${trimmed.length > 200 ? trimmed.substring(0, 200) + '...' : trimmed}". The system has identified the relevant authority and outlined actionable steps to help you resolve this efficiently.`;
}

// ──────────────────────────────────────────────
//  Build Google Maps Link
// ──────────────────────────────────────────────
function buildMapLink(authorityName: string, location: string): string {
  const city = location.split(/[,\/]/)[0].trim();
  const query = encodeURIComponent(`${authorityName} ${city}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

// ──────────────────────────────────────────────
//  POST /api/legal-navigator
// ──────────────────────────────────────────────
router.post('/legal-navigator', async (req: Request, res: Response): Promise<any> => {
  try {
    const { problem_description, location, user_id, user_email }: LegalNavigatorRequest & { user_id?: string; user_email?: string } = req.body;

    // ── Validation ──────────────────────────
    if (!problem_description || !problem_description.trim()) {
      return res.status(400).json({ success: false, error: 'problem_description is required.' });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ success: false, error: 'location is required.' });
    }
    if (problem_description.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Please describe your problem in more detail (at least 10 characters).' });
    }

    const desc     = problem_description.trim();
    const loc      = location.trim();
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
                   || req.socket?.remoteAddress
                   || null;

    console.log('[Legal Navigator] Processing request:', { location: loc, descriptionLength: desc.length });

    // ── Step 1: Classify ────────────────────
    const classification = classifyProblem(desc);

    // ── Step 2: Authority / Steps / Docs ────
    const info = getAuthorityInfo(classification, loc, desc);

    // ── Step 3: OpenRouter AI — enrich summary & legal note (parallel) ──
    const SYSTEM = `You are a concise Indian legal assistant. Plain text only. No markdown, asterisks, or headings. Be direct and professional. 2–4 sentences max.`;

    const [aiSummary, aiLegalNote] = await Promise.all([
      callOpenRouterAI(
        SYSTEM,
        `Summarise this legal issue in 2–3 plain sentences for a layperson. 
Issue: "${desc}"
Location: ${loc}
Category: ${classification.category}
Recommended authority: ${info.authority.name}`
      ),
      callOpenRouterAI(
        SYSTEM,
        `Write a 2-sentence legal disclaimer note for this ${classification.category} issue in ${loc}. 
Mention that laws can vary by state and that professional legal advice may be needed.`
      ),
    ]);

    // ── Step 4: Build full response ─────────
    const response: LegalNavigatorResponse = {
      problem_summary:
        aiSummary ||
        generateSummary(desc, loc, classification.category),
      category: classification.category,
      recommended_authority: info.authority,
      action_steps: info.action_steps,
      documents_required: info.documents_required,
      office_details: info.office_details,
      online_portal: info.online_portal,
      map_link: buildMapLink(info.authority.name, loc),
      legal_note:
        aiLegalNote ||
        'This guidance is based on general legal knowledge and is for informational purposes only. It does not constitute formal legal advice. Laws and procedures may vary by state. Please consult a qualified legal professional for case-specific guidance.',
      turn2law_cta:
        'Turn2Law can handle this end-to-end for you — from drafting legal notices and filing complaints to connecting you with the right advocate. Get expert help today and resolve your issue faster.',
    };

    console.log('[Legal Navigator] Response ready:', {
      category: response.category,
      authority: response.recommended_authority.name,
      aiEnriched: !!aiSummary,
    });

    // ── Step 5: Save to Supabase (non-blocking) ──
    supabaseAdmin
      .from('legal_navigator_queries')
      .insert([{
        problem_description: desc,
        location: loc,
        category: classification.category,
        recommended_authority: info.authority.name,
        result: response,
        user_id:    user_id    || null,
        user_email: user_email || null,
        ip_address: clientIp,
      }])
      .then(({ error: dbErr }) => {
        if (dbErr) console.error('[Legal Navigator] Supabase save error:', dbErr.message);
        else console.log('[Legal Navigator] Query saved to Supabase ✅');
      });

    return res.status(200).json({ success: true, data: response });

  } catch (error: any) {
    console.error('[Legal Navigator] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process your request. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;
