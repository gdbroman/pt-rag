import React from 'react';
import Products from './Products';

interface AuthenticatedProps {
    userInfo: Record<string, any>;
    logout: () => void;
}

const Authenticated: React.FC<AuthenticatedProps> = ({ userInfo, logout }) => {
    return (
        <Products />
    )
}

export default Authenticated;

