import { fetchMessages, setSearchTerm } from '../slices/messageSlice';
import { useCallback, useEffect, useRef, useState } from 'react';

import { MessageType } from '../types';
import { debounce } from '../utils/debounce';
import { useAppDispatch } from '../store/hooks';

interface UseDebouncedSearchProps {
  currentView: MessageType;
  filter: string;
  initialValue?: string;
  delay?: number;
}

export const useDebouncedSearch = ({
  currentView,
  filter,
  initialValue = '',
  delay = 300
}: UseDebouncedSearchProps) => {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  // Create debounced search function
  const debouncedSearch = useRef(
    debounce(
      async (
        query: string,
        messageType: MessageType,
        currentFilter: string
      ) => {
        setIsSearching(true);
        try {
          dispatch(setSearchTerm(query));
          await dispatch(
            fetchMessages({
              filter: messageType === 'sent' ? undefined : currentFilter,
              search: query,
              type: messageType
            })
          );
        } finally {
          setIsSearching(false);
        }
      },
      delay
    )
  ).current;

  // Effect to handle search when value changes
  useEffect(() => {
    debouncedSearch(searchValue, currentView, filter);
  }, [searchValue, currentView, filter, debouncedSearch]);

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchValue('');
    dispatch(setSearchTerm(''));
    dispatch(
      fetchMessages({
        filter: currentView === 'sent' ? undefined : filter,
        type: currentView
      })
    );
  }, [dispatch, currentView, filter]);

  return {
    searchValue,
    setSearchValue,
    isSearching,
    clearSearch
  };
};
