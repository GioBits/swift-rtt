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
        backgroundColor: online ? 'green' : 'red',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        display: 'flex',
        height: '36px',
        width: (online ? '80px' : '100px'),
      }}>
        <div className="m-auto text-sm">
          {online ? "En línea" : "Desconectado"}
        </div>
      </div>
    </>
  );
};

export default PingComponent;
