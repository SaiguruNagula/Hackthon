import React, { createContext, useContext, useState, useEffect } from 'react';

export type AIProvider = 'openai' | 'grok';

interface AIConfigContextType {
    apiKey: string;
    provider: AIProvider;
    setApiKey: (key: string) => void;
    setProvider: (provider: AIProvider) => void;
}

const AIConfigContext = createContext<AIConfigContextType | undefined>(undefined);

export const AIConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('cs_ai_api_key') || '');
    const [provider, setProvider] = useState<AIProvider>(() => (localStorage.getItem('cs_ai_provider') as AIProvider) || 'openai');

    useEffect(() => {
        localStorage.setItem('cs_ai_api_key', apiKey);
    }, [apiKey]);

    useEffect(() => {
        localStorage.setItem('cs_ai_provider', provider);
    }, [provider]);

    return (
        <AIConfigContext.Provider value={{ apiKey, provider, setApiKey, setProvider }}>
            {children}
        </AIConfigContext.Provider>
    );
};

export const useAIConfig = () => {
    const context = useContext(AIConfigContext);
    if (!context) throw new Error('useAIConfig must be used within an AIConfigProvider');
    return context;
};
