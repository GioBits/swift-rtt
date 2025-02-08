import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

const LanguageSelector = () => {
    const { originLanguage, setOriginLanguage, targetLanguage, setTargetLanguage } = useContext(LanguageContext);

    const handleOriginChange = (event) => {
        setOriginLanguage(event.target.value);
    };

    const handleTargetChange = (event) => {
        setTargetLanguage(event.target.value);
    };

    return (
        <div>
            <label>
                From:
                <select value={originLanguage} onChange={handleOriginChange}>
                    <option value="">Seleccione un idioma</option>
                    <option value="es" disabled={targetLanguage === 'es'}>Español</option>
                    <option value="en" disabled={targetLanguage === 'en'}>Inglés</option>
                </select>
            </label>
            <label>
                To:
                <select value={targetLanguage} onChange={handleTargetChange}>
                    <option value="">Seleccione un idioma</option>
                    <option value="es" disabled={originLanguage === 'es'}>Español</option>
                    <option value="en" disabled={originLanguage === 'en'}>Inglés</option>
                </select>
            </label>
        </div>
    );
};

export default LanguageSelector;