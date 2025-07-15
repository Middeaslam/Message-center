import { ApiResponse, Message, NewMessageData } from '../types';

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

// Response interceptor to handle errors consistently
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      // If the server returned an error response, throw the server's error message
      throw error.response.data;
    }
    // Otherwise, throw the original error
    throw error;
  }
);

export const getMessages = async (
  filter?: string,
  search?: string,
  type: 'inbox' | 'sent' = 'inbox'
): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  if (filter) params.append('filter', filter);
  if (search) params.append('search', search);
  params.append('type', type);

  const response = await api.get(`/messages?${params.toString()}`);
  return response.data;
};

export const getMessageById = async (id: string): Promise<Message> => {
  const response = await api.get(`/messages/${id}`);
  return response.data;
};

export const markAsRead = async (id: string): Promise<Message> => {
  const response = await api.patch(`/messages/${id}/read`);
  return response.data;
};

export const markAsUnread = async (id: string): Promise<Message> => {
  const response = await api.patch(`/messages/${id}/unread`);
  return response.data;
};

export const sendMessage = async (
  messageData: NewMessageData
): Promise<Message> => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

export const deleteMessage = async (id: string): Promise<void> => {
  await api.delete(`/messages/${id}`);
};
