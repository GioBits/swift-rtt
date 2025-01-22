import "./App.css";
import PingComponent from "./components/PingComponent";

function App() {

  return (
    <>
      <h1>BugBuster Project</h1>
      <div className="UploadAudio">
        {/* Se agrega el campo para subir archivos de audio */}
        <UploadAudio /> {/* Mostramos el componente para cargar archivos */}
      </div>
      <PingComponent />
    </>
  );
}

export default App;
