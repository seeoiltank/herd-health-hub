import React, { useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';

const THRESHOLD = 72;

export default function PullToRefresh({ onRefresh, children }) {
  const startY = useRef(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    const scrollTop = containerRef.current?.scrollTop ?? 0;
    if (scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (startY.current === null || refreshing) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      setPullDistance(Math.min(delta * 0.5, THRESHOLD + 20));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullDistance(THRESHOLD);
      await onRefresh();
      setRefreshing(false);
    }
    startY.current = null;
    setPullDistance(0);
  };

  const progress = Math.min(pullDistance / THRESHOLD, 1);
  const showIndicator = pullDistance > 8;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative' }}
    >
      {/* Pull indicator */}
      {showIndicator && (
        <div
          className="flex items-center justify-center pointer-events-none"
          style={{
            height: `${pullDistance}px`,
            overflow: 'hidden',
            transition: refreshing ? 'height 0.2s ease' : 'none',
          }}
        >
          <div
            className={`w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center border border-amber-200 transition-opacity`}
            style={{ opacity: progress }}
          >
            <RefreshCw
              className={`w-4 h-4 text-amber-600 ${refreshing ? 'animate-spin' : ''}`}
              style={{ transform: `rotate(${progress * 360}deg)` }}
            />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}