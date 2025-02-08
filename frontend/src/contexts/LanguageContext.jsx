import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [originLanguage, setOriginLanguage] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('');

    return (
        <LanguageContext.Provider value={{ originLanguage, setOriginLanguage, targetLanguage, setTargetLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};