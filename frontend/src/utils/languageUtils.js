export const setLanguage = (setSelectedLanguages, fieldName, languageCode) => {
  setSelectedLanguages((prevState) => ({
    ...prevState,
    [fieldName]: languageCode,
  }));
};
