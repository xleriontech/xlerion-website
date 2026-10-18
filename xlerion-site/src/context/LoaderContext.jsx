import React, { createContext, useContext, useState } from 'react';

const LoaderContext = createContext();

export function LoaderProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return (
        <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
            {children}
        </LoaderContext.Provider>
    );
}

export function useLoader() {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within LoaderProvider');
    }
    return context;
}
