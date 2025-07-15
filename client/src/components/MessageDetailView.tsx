import {
  AlertCircle,
  Archive,
  Calendar,
  CheckCircle,
  Clock,
  Forward,
  Mail,
  MoreVertical,
  Paperclip,
  Reply,
  ReplyAll,
  Star,
  Trash2,
  User,
  X
} from 'lucide-react';
import React, { useEffect } from 'react';

import { Message } from '../types';
import { markAsAcknowledged, markAsRead, markAsUnacknowledged } from '../slices/messageSlice';
import styled from 'styled-components';
import { useAppDispatch } from '../store/hooks';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  overflow: hidden;
`;

const MessageHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SubjectLine = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const MessageMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const PriorityBadge = styled.div<{ $priority: 'high' | 'medium' | 'low' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background-color: ${({ theme, $priority }) => {
    switch ($priority) {
      case 'high':
        return theme.colors.priority.high + '15';
      case 'medium':
        return theme.colors.priority.medium + '15';
      case 'low':
        return theme.colors.priority.low + '15';
      default:
        return theme.colors.priority.medium + '15';
    }
  }};
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

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
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
`;

const MessageContent = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
`;

const ContentText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: pre-wrap;
`;

const AttachmentSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const AttachmentTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;

interface MessageDetailViewProps {
  message: Message | null;
  onBack: () => void;
}

const formatDetailTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return <AlertCircle size={16} />;
    case 'medium':
      return <Clock size={16} />;
    case 'low':
      return <Mail size={16} />;
    default:
      return <Mail size={16} />;
  }
};

export const MessageDetailView: React.FC<MessageDetailViewProps> = ({
  message,
  onBack
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (message && !message.isRead) {
      dispatch(markAsRead(message.id));
    }
  }, [message, dispatch]);

  const handleToggleAcknowledgment = () => {
    if (!message) return;
    
    if (message.isAcknowledged) {
      dispatch(markAsUnacknowledged(message.id));
    } else {
      dispatch(markAsAcknowledged(message.id));
    }
  };

  if (!message) {
    return (
      <Container>
        <MessageContent>
          <ContentText>No message selected</ContentText>
        </MessageContent>
      </Container>
    );
  }

  return (
    <Container>
      <MessageHeader>
        <SubjectLine>{message.subject}</SubjectLine>

        <MessageMeta>
          <MetaItem>
            <User size={16} />
            <span>
              <strong>From:</strong> {message.sender}
            </span>
          </MetaItem>

          {message.recipient && (
            <MetaItem>
              <Mail size={16} />
              <span>
                <strong>To:</strong> {message.recipient}
              </span>
            </MetaItem>
          )}

          <MetaItem>
            <Calendar size={16} />
            <span>{formatDetailTimestamp(message.timestamp)}</span>
          </MetaItem>

          <PriorityBadge $priority={message.priority}>
            {getPriorityIcon(message.priority)}
            <span>{message.priority.toUpperCase()} PRIORITY</span>
          </PriorityBadge>
        </MessageMeta>

        <ActionBar>
          <ActionButton>
            <Reply size={16} />
            Reply
          </ActionButton>
          <ActionButton>
            <ReplyAll size={16} />
            Reply All
          </ActionButton>
          <ActionButton>
            <Forward size={16} />
            Forward
          </ActionButton>
          <ActionButton>
            <Star size={16} />
            Star
          </ActionButton>
          {message.type === 'sent' && (
            <ActionButton onClick={handleToggleAcknowledgment}>
              {message.isAcknowledged ? (
                <>
                  <X size={16} />
                  Mark Unacknowledged
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Mark Acknowledged
                </>
              )}
            </ActionButton>
          )}
          <ActionButton>
            <Archive size={16} />
            Archive
          </ActionButton>
          <ActionButton>
            <Trash2 size={16} />
            Delete
          </ActionButton>
          <ActionButton>
            <MoreVertical size={16} />
          </ActionButton>
        </ActionBar>
      </MessageHeader>

      <MessageContent>
        <ContentText>{message.content}</ContentText>

        {message.hasAttachment && (
          <AttachmentSection>
            <AttachmentTitle>
              <Paperclip
                size={16}
                style={{ display: 'inline', marginRight: '8px' }}
              />
              Attachments
            </AttachmentTitle>
            <AttachmentItem>
              <Paperclip size={16} />
              <span>document.pdf</span>
              <span
                style={{ marginLeft: 'auto', fontSize: '12px', color: '#666' }}
              >
                2.5 MB
              </span>
            </AttachmentItem>
          </AttachmentSection>
        )}
      </MessageContent>
    </Container>
  );
};
