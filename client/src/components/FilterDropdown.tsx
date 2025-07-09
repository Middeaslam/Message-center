import React, { useEffect, useRef, useState } from 'react';
import { fetchMessages, setFilter } from '../slices/messageSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import { ChevronDown } from 'lucide-react';
import styled from 'styled-components';

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-width: 120px;
  z-index: 10;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transform: ${({ $isOpen }) =>
    $isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all ${({ theme }) => theme.transitions.default};
`;

const DropdownItem = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.unreadBg : 'transparent'};
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: left;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.unreadBg};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.layout.borderRadiusSm};
    border-top-right-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  }

  &:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.layout.borderRadiusSm};
    border-bottom-right-radius: ${({ theme }) => theme.layout.borderRadiusSm};
  }
`;

const ChevronIcon = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform ${({ theme }) => theme.transitions.default};
`;

interface FilterOption {
  value: 'all' | 'read' | 'unread';
  label: string;
}

const filterOptions: FilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' }
];

export const FilterDropdown: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filter, searchTerm } = useAppSelector((state) => state.messages);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentFilterLabel =
    filterOptions.find((option) => option.value === filter)?.label || 'All';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (newFilter: 'all' | 'read' | 'unread') => {
    dispatch(setFilter(newFilter));
    dispatch(fetchMessages({ filter: newFilter, search: searchTerm }));
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-label={`Filter messages by ${currentFilterLabel}`}
      >
        {currentFilterLabel}
        <ChevronIcon $isOpen={isOpen}>
          <ChevronDown size={16} />
        </ChevronIcon>
      </DropdownButton>
      <DropdownMenu $isOpen={isOpen} role='listbox'>
        {filterOptions.map((option) => (
          <DropdownItem
            key={option.value}
            $isSelected={filter === option.value}
            onClick={() => handleFilterChange(option.value)}
            role='option'
            aria-selected={filter === option.value}
          >
            {option.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
};
