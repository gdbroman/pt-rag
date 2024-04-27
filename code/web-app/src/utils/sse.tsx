import { useCallback, useEffect, useState } from 'react';

export const useManualServerSentEvents = (url: string, body: any, headers?: HeadersInit) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [controller, setController] = useState<AbortController | null>(null);

  const startFetching = useCallback(() => {
    const newController = new AbortController();
    setController(newController);
    const signal = newController.signal;

    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(body),
          signal,
        });

        if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            const str = decoder.decode(value);
            console.log("Message:", str);
            try {
              setMessages((prevMessages) => [...prevMessages, str]);
            } catch (error) {
              console.error("Error parsing message:", error);
            }
          }
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          // Fetch was aborted
          console.log('Fetch aborted');
        } else {
          console.error("Fetch error:", error);
        }
      }
    };

    fetchData();
  }, [url, body, headers]);

  const stopFetching = useCallback(() => {
    if (controller) {
      controller.abort();
      setController(null);
    }
  }, [controller]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (controller) {
        controller.abort();
      }
    };
  }, [controller]);

  return { messages, startFetching, stopFetching };
};