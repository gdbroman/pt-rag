import { useCallback, useEffect, useState } from 'react';
import { useManualServerSentEvents } from '../utils/sse';

const Products = () => {
  const [url, setUrl] = useState("https://molmet.ki.se/");
  const [query, setQuery] = useState("what's the topic of the research?");

  const {
    messages,
    startFetching,
    stopFetching
  } = useManualServerSentEvents(`/api/chat_stream?url=${url}&query=${query}`, { url, query }, {
    'Accept': 'text/event-stream',
  });


  const handleCall = useCallback(async () => {
    startFetching();
  }, [startFetching])


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
            <div className="card-body items-stretch text-center">
              <div className="join-item flex flex-col items-start"
                style={{
                  textAlign: 'left',
                  fontSize: '20px',
                  color: 'white',
                }}
              >
                {messages.map((message) => message)}
              </div>
            </div>
            <div className="form-control w-full" style={{
              gap: 4
            }}>
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
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                <button className="join-item btn btn-square btn-md btn-primary" onClick={handleCall}>
                  Go
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Products;
