import { useState } from 'react';
import { useSSE } from '../utils/sse';

const Products = () => {
  // const { event } = useSSE()

  const [newProductText, setNewProductText] = useState('');

  const handleCall = async () => {
    const response = await fetch('/api/chat_stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: "https://molmet.ki.se/",
        query: "is dima a father?"
      }),
    });
    if (response.ok) {
      setNewProductText('');
    } else {
      const errorText = await response.text();
      console.error('Failed to add product:', errorText);
    }
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
                value={newProductText}
                onChange={(e) => setNewProductText(e.target.value)}
              />
              <button className="join-item btn btn-square btn-md btn-primary" onClick={handleCall}>
                Go
              </button>
            </div>
          </div>
          <div>
            event: {event}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
