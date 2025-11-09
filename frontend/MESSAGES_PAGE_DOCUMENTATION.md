# Messages Page Documentation

## Overview
The `/messages` page is a premium, WhatsApp-inspired full-page chat interface for Turn2Law's lawyer-client messaging feature. It provides a seamless, real-time communication experience between clients and lawyers.

## Route
- **Path**: `/messages`
- **Access**: Logged-in clients only (protected route - to be implemented with auth middleware)

## Features

### 1. Chat List Sidebar (Left Panel)
- **Width**: 384px (w-96)
- **Search Functionality**: Real-time filtering of chats by lawyer name or specialization
- **Chat Preview Cards** display:
  - Lawyer avatar (emoji-based with gradient border)
  - Online status indicator (green dot)
  - Verification badge (checkmark for verified lawyers)
  - Lawyer name and specialization
  - Last message preview
  - Timestamp
  - Unread message count badge (green with white text)
- **Active Chat Highlight**: Selected chat has yellow accent border and background
- **Empty State**: Shows search icon with helpful message when no chats found

### 2. Chat Window (Right Panel)
- **Chat Header** includes:
  - Lawyer avatar with online status
  - Lawyer name with verification badge
  - Online/specialization status text
  - Action buttons: Phone, Video, More options
- **Messages Area**:
  - Auto-scrolls to latest message
  - Date separator ("Today")
  - Message bubbles with different styles:
    - **Client messages**: Right-aligned, yellow gradient background
    - **Lawyer messages**: Left-aligned, gray gradient with border
  - Message status indicators (sent, delivered, read) for client messages
  - Timestamps for all messages
  - Max width 70% for readability
- **Input Area**:
  - Attachment and image buttons
  - Auto-expanding textarea (max 32px height)
  - Emoji button
  - Send button (gradient yellow, disabled when empty)
  - Enter key sends message, Shift+Enter for new line

### 3. Empty State
- Displays when no chat is selected
- Shows chat emoji, title, and helpful description
- Centered in the chat window area

## Design System

### Color Palette
```css
/* Backgrounds */
- Page: gradient-to-br from-gray-900 via-black to-gray-900
- Container: gradient-to-b from-gray-900/95 via-black/95 to-gray-900/95
- Headers: gradient-to-r from-gray-900/95 via-gray-950/95 to-gray-900/95
- Messages area: bg-black/20
- Input fields: bg-black/40

/* Borders */
- Primary: border-yellow-400/20
- Secondary: border-white/10
- Active chat: border-yellow-400

/* Text */
- Primary: text-white
- Secondary: text-white/60
- Muted: text-white/40
- Timestamps: text-white/50

/* Badges & Status */
- Unread count: bg-green-500 text-white
- Online indicator: bg-green-500
- Verification: text-green-400

/* Client Messages */
- Background: gradient-to-br from-yellow-400/90 to-yellow-600/90
- Text: text-gray-900

/* Lawyer Messages */
- Background: gradient-to-br from-gray-800/90 to-gray-900/90
- Text: text-white
- Border: border-white/10
```

### Spacing & Layout
- Container padding: px-4 py-6
- Chat height: calc(100vh-140px)
- Sidebar width: 384px (w-96)
- Message padding: px-4 py-2.5
- Message gap: space-y-4
- Input area padding: p-4

### Typography
- Chat header: text-lg font-bold
- Lawyer name: text-sm font-semibold
- Specialization: text-xs
- Messages: text-sm leading-relaxed
- Timestamps: text-xs
- Placeholders: text-sm

## Mock Data Structure
```typescript
interface Chat {
  id: number;
  lawyerId: number;
  lawyerName: string;
  lawyerSpecialization: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  verified: boolean;
  avatar: string;
  messages: Message[];
}

interface Message {
  id: number;
  sender: 'client' | 'lawyer';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}
```

## State Management
- `selectedChat`: Currently active chat ID
- `searchQuery`: Chat search filter
- `messageInput`: Current message being typed
- `chats`: Array of all chat conversations

## Key Interactions

### 1. Chat Selection
- Click on chat in sidebar → Opens chat window
- Auto-marks unread messages as read
- Highlights selected chat with yellow accent

### 2. Sending Messages
- Type in textarea → Enables send button
- Click send button → Adds message to chat
- Press Enter → Sends message
- Shift+Enter → New line in message
- Auto-scrolls to new message
- Updates last message and timestamp in sidebar

### 3. Search
- Type in search input → Filters chats in real-time
- Searches by lawyer name and specialization
- Shows "No chats found" when no matches

### 4. Navigation
- Back arrow → Returns to home page
- Chat icon in header → Opens this page

## Future Enhancements (API Integration)

### Replace Mock Data With:
1. **WebSocket Connection**: Real-time message delivery
2. **API Endpoints**:
   - GET `/api/chats` - Fetch user's chat list
   - GET `/api/chats/:id/messages` - Fetch messages for a chat
   - POST `/api/chats/:id/messages` - Send a message
   - PATCH `/api/chats/:id/read` - Mark messages as read
   - GET `/api/chats/unread-count` - Get total unread count

3. **Real-time Features**:
   - Online/offline status updates
   - Typing indicators
   - Message delivery/read receipts
   - Push notifications for new messages
   - Message reactions/emojis

4. **Additional Features**:
   - File/image attachments
   - Voice messages
   - Video/voice calls
   - Message search within chat
   - Message deletion
   - Chat archiving
   - Starred/important messages

## Accessibility
- Keyboard navigation support (Enter to send)
- Focus states on all interactive elements
- Screen reader friendly labels
- Contrast ratios meet WCAG standards

## Responsive Design
- Desktop-first approach (current implementation)
- Mobile responsive layout to be added:
  - Single column view
  - Toggle between chat list and chat window
  - Bottom navigation
  - Optimized touch targets

## Performance Optimizations
- Auto-scroll with smooth behavior
- Message virtualization for long chat histories (to be implemented)
- Lazy loading of older messages
- Debounced search input
- Optimistic UI updates

## Custom Scrollbar Styling
```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(250, 204, 21, 0.3);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(250, 204, 21, 0.5);
}
```

## Integration with Header
The messages page is accessed through:
1. **Chat Icon** in header (top-right, next to notifications)
2. Shows red badge with unread count
3. Click routes to `/messages` page
4. Only visible for logged-in clients

## Security Considerations
- Client authentication required
- Lawyer verification badges for trust
- End-to-end encryption (to be implemented)
- Message history privacy
- Secure file transfers

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: To be tested

## Testing Checklist
- [ ] Chat selection works correctly
- [ ] Messages send and display properly
- [ ] Search filters chats accurately
- [ ] Unread badges update correctly
- [ ] Auto-scroll works on new messages
- [ ] Enter key sends messages
- [ ] Shift+Enter adds new lines
- [ ] Empty states display properly
- [ ] Back navigation works
- [ ] Responsive on all screen sizes
- [ ] Keyboard navigation functional
- [ ] Screen reader accessible
