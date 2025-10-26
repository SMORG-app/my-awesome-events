import { useState, useEffect } from 'react';

const STORAGE_KEY = 'smorg_dismissedEvents';

export const useDismissedEvents = () => {
  const [dismissedEvents, setDismissedEvents] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissedEvents));
  }, [dismissedEvents]);

  const dismissEvent = (eventId: string) => {
    setDismissedEvents(prev => [...prev, eventId]);
  };

  const undoDismiss = (eventId: string) => {
    setDismissedEvents(prev => prev.filter(id => id !== eventId));
  };

  const clearAllDismissed = () => {
    setDismissedEvents([]);
  };

  const isDismissed = (eventId: string) => {
    return dismissedEvents.includes(eventId);
  };

  return {
    dismissedEvents,
    dismissEvent,
    undoDismiss,
    clearAllDismissed,
    isDismissed
  };
};
