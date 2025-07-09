import { CheckCircle, Loader2, Plus } from 'lucide-react';
import { Message, MessageType } from '../types';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import { MessageItem } from './MessageItem';
import { fetchMessages } from '../slices/messageSlice';
import styled from 'styled-components';
import { throttle } from '../utils/throttle';
import { useScrollPagination } from '../hooks/useScrollPagination';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MessageCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NewMessageButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}40;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LoadMoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const LoadMoreButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.status.error};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const RetryButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.muted};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin: 0;
`;

interface MessageListProps {
  currentView: MessageType;
  onMessageClick: (message: Message) => void;
}

const MESSAGES_PER_PAGE = 20;

export const MessageList: React.FC<MessageListProps> = ({
  currentView,
  onMessageClick
}) => {
  const dispatch = useAppDispatch();
  const { messages, loading, error, filter, searchTerm } = useAppSelector(
    (state) => state.messages
  );

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Throttled refresh function
  const throttledRefresh = useCallback(
    throttle(() => {
      dispatch(
        fetchMessages({
          filter: currentView === 'sent' ? undefined : filter,
          search: searchTerm,
          type: currentView
        })
      );
    }, 1000),
    [dispatch, currentView, filter, searchTerm]
  );

  // Reset pagination when view or filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    dispatch(
      fetchMessages({
        filter: currentView === 'sent' ? undefined : filter,
        search: searchTerm,
        type: currentView
      })
    );
  }, [dispatch, filter, searchTerm, currentView]);

  // Load more messages function
  const loadMoreMessages = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      // In a real app, this would be a paginated API call
      // For now, we'll simulate it since your backend doesn't have pagination

      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // For demo purposes, we'll just say no more messages after first load
      setHasMore(false);
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore]);

  // Scroll pagination hook
  const { setContainerRef } = useScrollPagination({
    hasMore,
    loading: loadingMore,
    onLoadMore: loadMoreMessages,
    threshold: 100
  });

  const handleRetry = useCallback(() => {
    throttledRefresh();
  }, [throttledRefresh]);

  const getDisplayTitle = () => {
    if (currentView === 'sent') return 'Sent Messages';
    switch (filter) {
      case 'unread':
        return 'Unread Messages';
      case 'read':
        return 'Read Messages';
      default:
        return 'Inbox';
    }
  };

  const getMessageCount = () => {
    const count = messages.length;
    if (searchTerm) {
      return `${count} result${count !== 1 ? 's' : ''} found`;
    }
    return `${count} message${count !== 1 ? 's' : ''}`;
  };

  const renderContent = () => {
    if (loading && page === 1) {
      return (
        <LoadingContainer>
          <LoadingSpinner>
            <Loader2 size={24} className='animate-spin' />
            <span>Loading messages...</span>
          </LoadingSpinner>
        </LoadingContainer>
      );
    }

    if (error) {
      return (
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={handleRetry}>Try Again</RetryButton>
        </ErrorContainer>
      );
    }

    if (messages.length === 0) {
      return (
        <EmptyContainer>
          <EmptyIcon>
            <CheckCircle size={64} />
          </EmptyIcon>
          <EmptyMessage>
            {currentView === 'sent'
              ? 'No sent messages'
              : searchTerm
              ? `No messages found for "${searchTerm}"`
              : filter === 'unread'
              ? 'No unread messages'
              : filter === 'read'
              ? 'No read messages'
              : 'No messages found'}
          </EmptyMessage>
        </EmptyContainer>
      );
    }

    return (
      <>
        <MessagesContainer ref={(ref) => setContainerRef(ref)}>
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              onClick={() => onMessageClick(message)}
              currentView={currentView}
            />
          ))}
        </MessagesContainer>

        {/* Load more section */}
        {hasMore && (
          <LoadMoreContainer>
            <LoadMoreButton onClick={loadMoreMessages} disabled={loadingMore}>
              {loadingMore ? (
                <>
                  <Loader2 size={16} className='animate-spin' />
                  Loading more...
                </>
              ) : (
                'Load more messages'
              )}
            </LoadMoreButton>
          </LoadMoreContainer>
        )}
      </>
    );
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>{getDisplayTitle()}</Title>
          <MessageCount>{getMessageCount()}</MessageCount>
        </HeaderLeft>
        <NewMessageButton>
          <Plus size={16} />
          New Message
        </NewMessageButton>
      </Header>
      {renderContent()}
    </Container>
  );
};
