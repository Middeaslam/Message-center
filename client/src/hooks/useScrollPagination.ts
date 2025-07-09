import { useCallback, useEffect, useRef, useState } from 'react';

import { throttle } from '../utils/throttle';

interface UseScrollPaginationProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useScrollPagination = ({
  hasMore,
  loading,
  onLoadMore,
  threshold = 100
}: UseScrollPaginationProps) => {
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const loadMoreRef = useRef(onLoadMore);

  // Update ref when onLoadMore changes
  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  // Throttled scroll handler
  const handleScroll = useCallback(
    throttle((event: Event) => {
      const target = event.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;

      // Check if we're near the bottom
      if (scrollHeight - scrollTop <= clientHeight + threshold) {
        if (hasMore && !loading) {
          loadMoreRef.current();
        }
      }
    }, 200), // Throttle to 200ms
    [hasMore, loading, threshold]
  );

  // Attach/detach scroll listener
  useEffect(() => {
    if (!containerRef) return;

    containerRef.addEventListener('scroll', handleScroll);
    return () => {
      containerRef.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, handleScroll]);

  return { setContainerRef };
};
