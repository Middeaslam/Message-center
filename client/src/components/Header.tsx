import { ArrowLeft, Menu } from 'lucide-react';
import { Message, MessageType, ViewState } from '../types';

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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  flex: 1;
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.sm};

    span {
      display: none; /* Hide text on mobile */
    }
  }
`;

const DetailTitle = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
`;

const DetailSubject = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

const DetailSender = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

interface HeaderProps {
  currentView: MessageType;
  viewState: ViewState;
  onBackToList: () => void;
  selectedMessage: Message | null;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  viewState,
  onBackToList,
  selectedMessage,
  onToggleSidebar
}) => {
  if (viewState === 'detail' && selectedMessage) {
    return (
      <HeaderContainer>
        <LeftSection>
          <MobileMenuButton onClick={onToggleSidebar} aria-label='Open menu'>
            <Menu size={20} />
          </MobileMenuButton>

          <BackButton onClick={onBackToList}>
            <ArrowLeft size={16} />
            <span>Back to {currentView === 'inbox' ? 'Inbox' : 'Sent'}</span>
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
        <MobileMenuButton onClick={onToggleSidebar} aria-label='Open menu'>
          <Menu size={20} />
        </MobileMenuButton>

        <SearchBar currentView={currentView} />
      </LeftSection>
      <RightSection>
        {/* Only show filter dropdown for inbox */}
        {currentView === 'inbox' && <FilterDropdown />}
      </RightSection>
    </HeaderContainer>
  );
};
