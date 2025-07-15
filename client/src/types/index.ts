export interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  isRead: boolean;
  hasAttachment: boolean;
  recipient?: string;
  recipientEmail?: string;
}

export interface ApiResponse {
  messages: Message[];
  totalCount: number;
  unreadCount: number;
}

export interface NewMessageData {
  recipient?: string;
  vendorId?: string;
  subject: string;
  content: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  category: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

export interface MessagesState {
  messages: Message[];
  selectedMessage: Message | null;
  loading: boolean;
  error: string | null;
  filter: 'all' | 'unread' | 'read';
  searchTerm: string;
  totalCount: number;
  unreadCount: number;
}

// New view state types
export type ViewState = 'list' | 'detail';
export type MessageType = 'inbox' | 'sent';
