import messages from '../locales/messages.json';

/**
 * Obtiene un mensaje desde el archivo de locales y reemplaza los placeholders si es necesario.
 * 
 * @param {string} component - El nombre del componente donde se usa el mensaje.
 * @param {string} key - La clave del mensaje dentro del componente.
 * @param {Object} [replacements={}] - Un objeto con valores a reemplazar en el mensaje. 
 *                                     Los placeholders deben estar en formato `{clave}`.
 * @returns {string} - El mensaje localizado con los valores reemplazados.
*/

export const getMessage = (component, key, replacements = {}) => {
  let message = messages[component]?.[key] || "";

  // Reemplaza los placeholders con valores reales
  Object.entries(replacements).forEach(([placeholder, value]) => {
    message = message.replace(`{${placeholder}}`, value);
  });

  return message;
};
