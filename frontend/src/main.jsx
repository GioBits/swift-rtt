import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Importar el Provider de Redux
import { store } from './store/index'; // Importar el store de Redux
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/* Envolver la aplicación con el Provider */}
      <App />
    </Provider>
  </StrictMode>
);
