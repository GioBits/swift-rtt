import "./App.css";
import PingComponent from "./components/PingComponent";
import RecordAudio from "./components/RecordAudio";
import UploadAudio from "./components/UploadAudio";

function App() {

  return (
    <>
      <h1>BugBuster Project</h1>
      <div className="UploadAudio">
        {/* Se agrega el campo para subir archivos de audio */}
        <UploadAudio /> {/* Mostramos el componente para cargar archivos */}
      </div>
      <PingComponent />
      <RecordAudio />
    </>
  );
}

export default App;
