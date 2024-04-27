import { useCallback, useEffect, useState } from 'react';

const Products = () => {
  const [url, setUrl] = useState("https://molmet.ki.se/");
  const [query, setQuery] = useState("what's the topic of the research?");
  const [eventData, setEventData] = useState('');
  const [eventSource, setEventSource] = useState<EventSource | null>(null);


  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);


  const handleCall = useCallback(async () => {
    const newEventSource = new EventSource(`/api/chat_stream?url=${url}&query=${query}`);
    setEventSource(newEventSource);

    newEventSource.onmessage = (event) => {
      console.log('New event:', event.data);
      console.log("eventData", eventData);
      setEventData(eventData => eventData + '\n' + event.data);
    };

    newEventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      newEventSource.close();
    };
  }, [eventData, query, url])


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
            data: {eventData}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Products;
