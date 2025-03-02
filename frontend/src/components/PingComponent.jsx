import { useEffect, useState } from "react";
import { apiService } from '../service/api';

const PingComponent = () => {
  const [online, setOnline] = useState(null);

  const pingServer = async () => {
    try {
      const response = await apiService.ping();
      response.message === 'pong' ? setOnline(true) : setOnline(false)
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    pingServer();

    const pingInterval = setInterval(() => {
      pingServer();
    }, 120000);

    return () => clearInterval(pingInterval);
  }, []);

  return (
    <>
      <div style={{
        top: '20px',
        right: '20px',
        backgroundColor: online ? 'green' : 'red',
        padding: '10px',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
      }}>
        {online ? "En línea" : "Desconectado"}
      </div>
    </>
  );
};

export default PingComponent;
