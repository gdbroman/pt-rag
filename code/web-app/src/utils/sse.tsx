import React, { useState, useEffect } from 'react';
import config from '../config';

function EventComponent() {
  const [serverTime, setServerTime] = useState("");

  useEffect(() => {
    const eventSource = new EventSource(config.apiBaseUrl + "/chat_stream");

    eventSource.onmessage = function (event) {
      setServerTime(event.data);
    };

    eventSource.onerror = function (err) {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>Server event: {serverTime}</h1>
    </div>
  );
}

export default EventComponent;
