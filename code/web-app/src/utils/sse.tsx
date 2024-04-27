import { useState, useEffect } from 'react';
import config from '../config';

export const useSSE = () => {
  const [event, setEvent] = useState();

  useEffect(() => {
    const eventSource = new EventSource(config.apiBaseUrl + "/chat_stream");

    eventSource.onmessage = function (event: any) {
      setEvent(event);
    };

    eventSource.onerror = function (err) {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { event }
}
