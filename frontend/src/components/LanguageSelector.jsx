import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import '../LanguageSelector.css';

const LanguageSelector = () => {
    const { originLanguage, setOriginLanguage, targetLanguage, setTargetLanguage } = useContext(LanguageContext);

    const handleOriginChange = (event) => {
        const selectedLanguage = event.target.value;
        if (selectedLanguage === targetLanguage) {
            setTargetLanguage(originLanguage);
        }
        setOriginLanguage(selectedLanguage);
    };

    const handleTargetChange = (event) => {
        const selectedLanguage = event.target.value;
        if (selectedLanguage === originLanguage) {
            setOriginLanguage(targetLanguage);
        }
        setTargetLanguage(selectedLanguage);
    };

    return (
        <div>
            <label>
                From:
                <select value={originLanguage} onChange={handleOriginChange}>
                    <option value="">Seleccione un idioma</option>
                    <option value="es">Español</option>
                    <option value="en">Inglés</option>
                </select>
            </label>
            <label>
                To:
                <select value={targetLanguage} onChange={handleTargetChange}>
                    <option value="">Seleccione un idioma</option>
                    <option value="es">Español</option>
                    <option value="en">Inglés</option>
                </select>
            </label>
        </div>
    );
};

export default LanguageSelector;