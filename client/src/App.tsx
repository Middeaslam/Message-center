import { Message, MessageType, ViewState } from './types';
import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { GlobalStyles } from './styles/GlobalStyles';
import { Header } from './components/Header';
import { MessageDetailView } from './components/MessageDetailView';
import { MessageList } from './components/MessageList';
import { Provider } from 'react-redux';
import { Sidebar } from './components/Sidebar';
import { store } from './store';
import { theme } from './styles/theme';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  position: relative;
`;

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ theme }) => theme.mobile.sidebarWidth};
  z-index: 1000;
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  transition: transform ${({ theme }) => theme.transitions.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    position: static;
    width: ${({ theme }) => theme.layout.sidebarWidth};
    transform: translateX(0);
    transition: none;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const Overlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transition: opacity ${({ theme }) => theme.transitions.default},
    visibility ${({ theme }) => theme.transitions.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md};
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

function App() {
  const [currentView, setCurrentView] = useState<MessageType>('inbox');
  const [viewState, setViewState] = useState<ViewState>('list');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    setViewState('detail');
  };

  const handleBackToList = () => {
    setViewState('list');
    setSelectedMessage(null);
  };

  const handleViewChange = (view: MessageType) => {
    setCurrentView(view);
    setViewState('list');
    setSelectedMessage(null);
    setSidebarOpen(false); // Close sidebar on mobile when changing views
    // Reset filter to 'all' when changing views
    // This will be handled by the components when they detect view change
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AppContainer>
          <Overlay $isVisible={sidebarOpen} onClick={closeSidebar} />

          <SidebarContainer $isOpen={sidebarOpen}>
            <Sidebar
              currentView={currentView}
              onViewChange={handleViewChange}
              onClose={closeSidebar}
            />
          </SidebarContainer>

          <MainContent>
            <Header
              currentView={currentView}
              viewState={viewState}
              onBackToList={handleBackToList}
              selectedMessage={selectedMessage}
              onToggleSidebar={toggleSidebar}
            />
            <ContentArea>
              {viewState === 'list' ? (
                <MessageList
                  currentView={currentView}
                  onMessageClick={handleMessageClick}
                />
              ) : (
                <MessageDetailView
                  message={selectedMessage}
                  onBack={handleBackToList}
                />
              )}
            </ContentArea>
          </MainContent>
        </AppContainer>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
