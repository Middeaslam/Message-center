import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  Paperclip,
  Reply,
  Star
} from 'lucide-react';
import { Message, MessageType } from '../types';

import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div<{ $isRead: boolean }>`
  display: flex;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme, $isRead }) =>
    $isRead ? theme.colors.background : theme.colors.unreadBg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const UnreadIndicator = styled.div<{ $isVisible: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.unread};
  margin-right: ${({ theme }) => theme.spacing.md};
  margin-top: 6px;
  flex-shrink: 0;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
`;

const MessageContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SenderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
  flex: 1;
`;

const Sender = styled.span<{ $isRead: boolean }>`
  font-weight: ${({ theme, $isRead }) =>
    $isRead
      ? theme.typography.fontWeight.normal
      : theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const PriorityIcon = styled.div<{ $priority: 'high' | 'medium' | 'low' }>`
  display: flex;
  align-items: center;
  color: ${({ theme, $priority }) => {
    switch ($priority) {
      case 'high':
        return theme.colors.priority.high;
      case 'medium':
        return theme.colors.priority.medium;
      case 'low':
        return theme.colors.priority.low;
      default:
        return theme.colors.priority.medium;
    }
  }};
`;

const MessageIcons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text.muted};
  display: flex;
  align-items: center;
`;

const MessageMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Timestamp = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  white-space: nowrap;
`;

const Subject = styled.h3<{ $isRead: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme, $isRead }) =>
    $isRead
      ? theme.typography.fontWeight.normal
      : theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Preview = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

interface MessageItemProps {
  message: Message;
  onClick: () => void;
  currentView: MessageType;
}

const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
};

const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return <AlertCircle size={14} />;
    case 'medium':
      return <Clock size={14} />;
    case 'low':
      return <Mail size={14} />;
    default:
      return <Mail size={14} />;
  }
};

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onClick,
  currentView
}) => {
  const handleClick = () => {
    onClick();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <MessageContainer
      $isRead={message.isRead}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role='button'
      aria-label={`Message from ${message.sender}: ${message.subject}`}
    >
      <UnreadIndicator $isVisible={!message.isRead} />
      <MessageContent>
        <MessageHeader>
          <SenderInfo>
            <Sender $isRead={message.isRead}>
              {currentView === 'sent' && message.recipient
                ? `To: ${message.recipient}`
                : message.sender}
            </Sender>
            <PriorityIcon $priority={message.priority}>
              {getPriorityIcon(message.priority)}
            </PriorityIcon>
          </SenderInfo>
          <MessageMeta>
            <MessageIcons>
              {message.hasAttachment && (
                <IconWrapper>
                  <Paperclip size={14} />
                </IconWrapper>
              )}
              {message.isRead && (
                <IconWrapper>
                  <CheckCircle2 size={14} />
                </IconWrapper>
              )}
              {currentView === 'sent' && (
                <IconWrapper>
                  <Reply size={14} />
                </IconWrapper>
              )}
            </MessageIcons>
            <Timestamp>{formatTimestamp(message.timestamp)}</Timestamp>
          </MessageMeta>
        </MessageHeader>
        <Subject $isRead={message.isRead}>{message.subject}</Subject>
        <Preview>{message.preview}</Preview>
      </MessageContent>
    </MessageContainer>
  );
};
