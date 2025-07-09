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
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
`;

function App() {
  const [currentView, setCurrentView] = useState<MessageType>('inbox');
  const [viewState, setViewState] = useState<ViewState>('list');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

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
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AppContainer>
          <Sidebar currentView={currentView} onViewChange={handleViewChange} />
          <MainContent>
            <Header
              currentView={currentView}
              viewState={viewState}
              onBackToList={handleBackToList}
              selectedMessage={selectedMessage}
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
