import MediaUploadHistory from '../components/MediaUploadHistory';
import NavbarComponent from '../components/NavbarComponent';
import { useHistoryData } from '../hooks/useHistoryData';
import Modal from "../components/mediaResponse/ModalResponse";
import MediaContent from "../components/mediaResponse/MediaContent";

const History = () => {
  const { historyData, state, onRowClick, closeModal } = useHistoryData();

  const columns = [
    { label: 'ID', field: 'id', width: '100px' },
    { label: 'Nombre', field: 'name', width: '200px' },
    { label: 'Tamaño', field: 'size', width: '150px' },
    { label: 'Idioma', field: 'language', width: '120px' },
    { label: 'Fecha', field: 'date', width: '150px', render: (value) => new Date(value).toLocaleDateString() },
    { label: 'Hora', field: 'time', width: '100px' },
  ];

  return (
    <div className="w-screen h-screen">
      <NavbarComponent />
      <div className="w-[90vw] md:w-[70vw] lg:w-[60vw] h-[80vh] gap-6 lg:flex mt-10 m-auto block">
        <MediaUploadHistory rows={historyData} onRowClick={onRowClick} columns={columns} />
      </div>
      {state.isModalOpen && state.selectedAudio && (
        <Modal isOpen={state.isModalOpen} onClose={closeModal}>
          <div className="flex flex-col md:flex-row w-full gap-x-10 justify-between">
            <MediaContent
              title="Transcripción"
              contentText={state.transcription || ""}
              audio={state.selectedAudio || ""}
              tooltipTitle="Reproducir/Detener audio original"
              tooltipDownload="Descargar audio original"
            />
            <MediaContent
              title="Traducción"
              contentText={state.translation || ""}
              audio={state.mediaTranslation || ""}
              tooltipDownload="Descargar audio traducido"
              speed="1.25"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default History;
