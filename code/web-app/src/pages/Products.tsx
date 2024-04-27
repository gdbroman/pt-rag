import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS, ADD_PRODUCT, REMOVE_PRODUCT, PRODUCT_ADDED_SUBSCRIPTION } from '../graphql/operations';

interface Product {
  id: string;
  name: string;
}

interface GetProductsQuery {
  products: Product[];
}

const Products: React.FC = () => {
  const [newProductText, setNewProductText] = useState('');
  const [pushToKafka, setPushToKafka] = useState(false);
  const { data, loading, error, subscribeToMore } = useQuery(GET_PRODUCTS);
  const [addProduct] = useMutation(ADD_PRODUCT);
  const [removeProduct] = useMutation(REMOVE_PRODUCT);

  useEffect(() => {
    subscribeToMore({
      document: PRODUCT_ADDED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newProduct = subscriptionData.data.productAdded;

        if (prev.products.some((product: Product) => product.id === newProduct.id)) {
          return prev;
        }
        return Object.assign({}, prev, {
          products: [...prev.products, newProduct]
        });
      },
    });
  }, [subscribeToMore]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-base-300">
      <button className="btn">
        <span className="loading loading-spinner"></span>
        Loading...
      </button>
    </div>
  );

  if (error) return <p>{'Error: ' + error}</p>;

  return (
    <div className="min-h-screen flex flex-col">
      Put in your URL
    </div>
  );
};

export default Products;
