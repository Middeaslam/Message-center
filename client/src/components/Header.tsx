import { Message, MessageType, ViewState } from '../types';

import { ArrowLeft } from 'lucide-react';
import { FilterDropdown } from './FilterDropdown';
import React from 'react';
import { SearchBar } from './SearchBar';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: ${({ theme }) => theme.spacing.lg};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  flex: 1;
`;

const BackButton = styled.button`
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

const DetailTitle = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailSubject = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const DetailSender = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

interface HeaderProps {
  currentView: MessageType;
  viewState: ViewState;
  onBackToList: () => void;
  selectedMessage: Message | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  viewState,
  onBackToList,
  selectedMessage
}) => {
  if (viewState === 'detail' && selectedMessage) {
    return (
      <HeaderContainer>
        <LeftSection>
          <BackButton onClick={onBackToList}>
            <ArrowLeft size={16} />
            Back to {currentView === 'inbox' ? 'Inbox' : 'Sent'}
          </BackButton>
          <DetailTitle>
            <DetailSubject>{selectedMessage.subject}</DetailSubject>
            <DetailSender>
              {currentView === 'sent'
                ? `To: ${selectedMessage.recipient || 'Unknown'}`
                : `From: ${selectedMessage.sender}`}
            </DetailSender>
          </DetailTitle>
        </LeftSection>
      </HeaderContainer>
    );
  }

  return (
    <HeaderContainer>
      <LeftSection>
        <SearchBar currentView={currentView} />
      </LeftSection>
      <RightSection>
        {/* Only show filter dropdown for inbox */}
        {currentView === 'inbox' && <FilterDropdown />}
      </RightSection>
    </HeaderContainer>
  );
};
