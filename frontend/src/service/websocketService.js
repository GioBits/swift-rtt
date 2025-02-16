export default class WebSocketService {
    constructor() {
      this.base = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';
      this.url = `${this.base}/ws`;
      this.ws = null;
      this.messageCallbacks = [];
      this.connect();
    }
  
    connect() {
      this.ws = new WebSocket(this.url);
  
      this.ws.onopen = () => {
        console.log("WebSocket conectado");
      };
  
      this.ws.onmessage = (event) => {
        this.messageCallbacks.forEach((callback) => callback(event.data));
      };
  
      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
  
      this.ws.onclose = () => {
        console.log("WebSocket desconectado");
        // Opcional: reintentar la conexión
        // setTimeout(() => this.connect(), 3000);
      };
    }
  
    onMessage(callback) {
      this.messageCallbacks.push(callback);
    }

    offMessage(callback) {
      this.messageCallbacks = this.messageCallbacks.filter(listener => listener !== callback);
    }
  
    send(data) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(data);
      } else {
        console.warn("WebSocket no está listo para enviar datos");
      }
    }
  }