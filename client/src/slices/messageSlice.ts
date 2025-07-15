import * as messageAPI from '../services/messageAPI';

import { ApiResponse, Message, MessagesState, NewMessageData } from '../types';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState: MessagesState = {
  messages: [],
  selectedMessage: null,
  loading: false,
  error: null,
  filter: 'all',
  searchTerm: '',
  totalCount: 0,
  unreadCount: 0
};

// Throttled async thunk for fetch messages to prevent rapid API calls
let lastFetchTime = 0;
const FETCH_THROTTLE_MS = 100;

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (
    {
      filter,
      search,
      type = 'inbox'
    }: { filter?: string; search?: string; type?: 'inbox' | 'sent' },
    { rejectWithValue }
  ) => {
    const now = Date.now();
    if (now - lastFetchTime < FETCH_THROTTLE_MS) {
      // If called too quickly, reject to prevent spam
      return rejectWithValue('Request throttled');
    }
    lastFetchTime = now;

    try {
      return await messageAPI.getMessages(filter, search, type);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch messages');
    }
  }
);

export const fetchMessageById = createAsyncThunk(
  'messages/fetchMessageById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await messageAPI.getMessageById(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch message');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'messages/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      return await messageAPI.markAsRead(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark as read');
    }
  }
);

export const markAsUnread = createAsyncThunk(
  'messages/markAsUnread',
  async (id: string, { rejectWithValue }) => {
    try {
      return await messageAPI.markAsUnread(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark as unread');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData: NewMessageData, { rejectWithValue }) => {
    try {
      return await messageAPI.sendMessage(messageData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'messages/deleteMessage',
  async (id: string, { rejectWithValue }) => {
    try {
      await messageAPI.deleteMessage(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete message');
    }
  }
);

export const markAsAcknowledged = createAsyncThunk(
  'messages/markAsAcknowledged',
  async (id: string, { rejectWithValue }) => {
    try {
      return await messageAPI.markAsAcknowledged(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark as acknowledged');
    }
  }
);

export const markAsUnacknowledged = createAsyncThunk(
  'messages/markAsUnacknowledged',
  async (id: string, { rejectWithValue }) => {
    try {
      return await messageAPI.markAsUnacknowledged(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark as unacknowledged');
    }
  }
);

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<'all' | 'unread' | 'read' | 'acknowledged'>) => {
      state.filter = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSelectedMessage: (state) => {
      state.selectedMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMessages.fulfilled,
        (state, action: PayloadAction<ApiResponse>) => {
          state.loading = false;
          state.messages = action.payload.messages;
          state.totalCount = action.payload.totalCount;
          state.unreadCount = action.payload.unreadCount;
        }
      )
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        // Don't show error for throttled requests
        if (action.payload !== 'Request throttled') {
          state.error =
            (action.payload as string) ||
            action.error.message ||
            'Failed to fetch messages';
        }
      })

      // Other cases remain the same...
      .addCase(fetchMessageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMessageById.fulfilled,
        (state, action: PayloadAction<Message>) => {
          state.loading = false;
          state.selectedMessage = action.payload;
        }
      )
      .addCase(fetchMessageById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to fetch message';
      })

      .addCase(
        markAsRead.fulfilled,
        (state, action: PayloadAction<Message>) => {
          const index = state.messages.findIndex(
            (msg) => msg.id === action.payload.id
          );
          if (index !== -1) {
            state.messages[index] = action.payload;
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          if (state.selectedMessage?.id === action.payload.id) {
            state.selectedMessage = action.payload;
          }
        }
      )

      .addCase(
        markAsUnread.fulfilled,
        (state, action: PayloadAction<Message>) => {
          const index = state.messages.findIndex(
            (msg) => msg.id === action.payload.id
          );
          if (index !== -1) {
            state.messages[index] = action.payload;
            state.unreadCount += 1;
          }
          if (state.selectedMessage?.id === action.payload.id) {
            state.selectedMessage = action.payload;
          }
        }
      )

      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        sendMessage.fulfilled,
        (state, action: PayloadAction<Message>) => {
          state.loading = false;
          state.messages.unshift(action.payload);
          state.totalCount += 1;
        }
      )
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to send message';
      })

              .addCase(
          deleteMessage.fulfilled,
          (state, action: PayloadAction<string>) => {
            const messageIndex = state.messages.findIndex(
              (msg) => msg.id === action.payload
            );
            if (messageIndex !== -1) {
              const deletedMessage = state.messages[messageIndex];
              state.messages.splice(messageIndex, 1);
              state.totalCount -= 1;
              if (!deletedMessage.isRead) {
                state.unreadCount -= 1;
              }
            }
            if (state.selectedMessage?.id === action.payload) {
              state.selectedMessage = null;
            }
          }
        )

        .addCase(
          markAsAcknowledged.fulfilled,
          (state, action: PayloadAction<Message>) => {
            const index = state.messages.findIndex(
              (msg) => msg.id === action.payload.id
            );
            if (index !== -1) {
              state.messages[index] = action.payload;
            }
            if (state.selectedMessage?.id === action.payload.id) {
              state.selectedMessage = action.payload;
            }
          }
        )

        .addCase(
          markAsUnacknowledged.fulfilled,
          (state, action: PayloadAction<Message>) => {
            const index = state.messages.findIndex(
              (msg) => msg.id === action.payload.id
            );
            if (index !== -1) {
              state.messages[index] = action.payload;
            }
            if (state.selectedMessage?.id === action.payload.id) {
              state.selectedMessage = action.payload;
            }
          }
        );
  }
});

export const { setFilter, setSearchTerm, clearSelectedMessage, clearError } =
  messageSlice.actions;
export default messageSlice.reducer;
