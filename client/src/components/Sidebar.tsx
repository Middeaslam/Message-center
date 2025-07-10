import { Inbox, Send, X } from 'lucide-react';

import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../store/hooks';

const SidebarContainer = styled.aside`
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.sidebar};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: calc(
      ${({ theme }) => theme.spacing.lg} + 48px
    ); /* Account for close button */
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const Navigation = styled.nav`
  padding: ${({ theme }) => theme.spacing.lg};
  flex: 1;
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NavItem = styled.li<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.background : theme.colors.text.primary};
  min-height: 48px; /* Better touch targets on mobile */

  &:hover {
    background-color: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primaryHover : theme.colors.unreadBg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
    min-height: 52px;
  }
`;

const NavIcon = styled.div`
  width: 20px;
  height: 20px;
  margin-right: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavText = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.base};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

const Badge = styled.span`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
`;

interface SidebarProps {
  currentView: 'inbox' | 'sent';
  onViewChange: (view: 'inbox' | 'sent') => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  onClose
}) => {
  const { unreadCount } = useAppSelector((state) => state.messages);

  const navigationItems = [
    {
      id: 'inbox' as const,
      label: 'Inbox',
      icon: <Inbox size={20} />,
      badge: unreadCount
    },
    {
      id: 'sent' as const,
      label: 'Sent',
      icon: <Send size={20} />
    }
  ];

  const handleNavClick = (view: 'inbox' | 'sent') => {
    onViewChange(view);
  };

  return (
    <SidebarContainer>
      <CloseButton onClick={onClose} aria-label='Close menu'>
        <X size={16} />
      </CloseButton>

      <Header>
        <Title>Message Center</Title>
        <Subtitle>Communicate with Impact team and vendors</Subtitle>
      </Header>

      <Navigation>
        <NavList>
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              $isActive={currentView === item.id}
              onClick={() => handleNavClick(item.id)}
              role='button'
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNavClick(item.id);
                }
              }}
            >
              <NavIcon>{item.icon}</NavIcon>
              <NavText>{item.label}</NavText>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge>{item.badge}</Badge>
              )}
            </NavItem>
          ))}
        </NavList>
      </Navigation>
    </SidebarContainer>
  );
};
