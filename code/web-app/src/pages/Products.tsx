import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS, ADD_PRODUCT, REMOVE_PRODUCT, PRODUCT_ADDED_SUBSCRIPTION } from '../graphql/operations';
import EventComponent from '../utils/sse';

interface Product {
  id: string;
  name: string;
}

const Products: React.FC = () => {
  const [newProductText, setNewProductText] = useState('');
  const [pushToKafka, setPushToKafka] = useState(false);
  const [addProduct] = useMutation(ADD_PRODUCT);
  const [removeProduct] = useMutation(REMOVE_PRODUCT);

  const handleCall = async () => {
    if (!newProductText.trim()) return;
    if (pushToKafka) {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newProductText }),
      });
      if (response.ok) {
        setNewProductText('');
      } else {
        const errorText = await response.text();
        console.error('Failed to add product:', errorText);
      }
    } else {
      await addProduct({ variables: { name: newProductText } });
      setNewProductText('');
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
          <EventComponent />
        </div>
      </div>
    </div>
  );
};

export default Products;
