import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing an EventSource connection.
 * @param url URL to connect to.
 * @param isEnabled Boolean to enable or disable the event source.
 * @returns An object containing the event data and a function to clear the event data.
 */
export const useEventSource = (url: string, isEnabled: boolean) => {
  const [data, setData] = useState('');
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const clearData = useCallback(() => {
    setData('');
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      if (eventSource) {
        eventSource.close();
        setEventSource(null);
      }
      return;
    }

    const es = new EventSource(url);

    es.onmessage = (event) => {
      setData(currentData => currentData + '\n' + event.data);
    };

    es.onerror = (error) => {
      console.error('EventSource error:', error);
      es.close();
    };

    setEventSource(es);

    return () => {
      if (es) {
        es.close();
      }
    };
  }, [url, isEnabled, eventSource]);

  return { data, clearData };
};

