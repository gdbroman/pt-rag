import { useEffect, useState } from 'react';
import { useEventSource } from '../utils/sse';

const Products = () => {

  const [url, setUrl] = useState("https://molmet.ki.se/");
  const [query, setQuery] = useState("is dima a father?");
  const [eventData, setEventData] = useState('');

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  let eventSource: EventSource | null = null;

  const handleCall = async () => {
    eventSource = new EventSource(`/api/chat_stream?url=${url}&query=${query}`);

    eventSource.onmessage = (event) => {
      console.log('New event:', event.data);
      setEventData(eventData => eventData + '\n' + event.data);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource?.close();
    };
  };


  return (
    <div className="min-h-screen flex flex-col">
      <div className="navbar bg-base-300 text-neutral-content">
        <div className="flex-1">
          RAG search
        </div>
      </div>

      <div className="flex flex-grow justify-center items-center bg-neutral">
        <div className="card card-compact w-full max-w-lg bg-base-100 shadow-xl">
          <div className="card-body items-stretch text-center">
            <div className="form-control w-full">
              <input
                type="url"
                placeholder="URL"
                className="join-item flex-grow input input-bordered input-md input-primary"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <input
                type="text"
                placeholder="Query"
                className="join-item flex-grow input input-bordered input-md input-primary"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="join-item btn btn-square btn-md btn-primary" onClick={handleCall}>
                Go
              </button>
            </div>
          </div>
          <pre>
            {/* data: {data} */}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Products;
