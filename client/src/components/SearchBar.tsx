import { Loader2, Search, X } from 'lucide-react';
import React, { useEffect } from 'react';

import { MessageType } from '../types';
import styled from 'styled-components';
import { useAppSelector } from '../store/hooks';
import { useDebouncedSearch } from '../hooks/useDebouncedSearch';

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.md} 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background-color: ${({ theme }) => theme.colors.background};
  transition: border-color ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.muted};
  pointer-events: none;
`;

const ActionButton = styled.button<{ $isVisible: boolean }>`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: all ${({ theme }) => theme.transitions.default};
  display: flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

interface SearchBarProps {
  currentView: MessageType;
}

export const SearchBar: React.FC<SearchBarProps> = ({ currentView }) => {
  const { filter } = useAppSelector((state) => state.messages);
  const { searchValue, setSearchValue, isSearching, clearSearch } =
    useDebouncedSearch({
      currentView,
      filter,
      delay: 300
    });

  return (
    <SearchContainer>
      <SearchIcon>
        <Search size={16} />
      </SearchIcon>
      <SearchInput
        type='text'
        placeholder={`Search ${
          currentView === 'sent' ? 'sent' : ''
        } messages...`}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        aria-label='Search messages'
      />

      {/* Show loading spinner while searching */}
      <ActionButton $isVisible={isSearching}>
        <Loader2 size={14} className='animate-spin' />
      </ActionButton>

      {/* Show clear button when there's text and not searching */}
      <ActionButton
        $isVisible={searchValue.length > 0 && !isSearching}
        onClick={clearSearch}
        aria-label='Clear search'
        tabIndex={searchValue.length > 0 ? 0 : -1}
      >
        <X size={14} />
      </ActionButton>
    </SearchContainer>
  );
};
