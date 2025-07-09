import { Inbox, Send } from 'lucide-react';

import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../store/hooks';

const SidebarContainer = styled.aside`
  width: ${({ theme }) => theme.layout.sidebarWidth};
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.sidebar};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
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

  &:hover {
    background-color: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primaryHover : theme.colors.unreadBg};
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange
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

  return (
    <SidebarContainer>
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
              onClick={() => onViewChange(item.id)}
              role='button'
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onViewChange(item.id);
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
