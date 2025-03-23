import MediaUploadHistory from '../components/MediaUploadHistory';
import { useHistoryData } from '../hooks/useHistoryData';
import Modal from "../components/mediaResponse/ModalResponse";
import MediaContent from "../components/mediaResponse/MediaContent";
import NavBarSearch from '../components/NavbarSearch';

const History = () => {
  const { historyData, state, onRowClick, closeModal, searchQuery, onSearchChange } = useHistoryData();

  const columns = [
    { label: 'ID', field: 'id', width: '5%' },
    { label: 'Nombre', field: 'name', width: '30%' },
    { label: 'Tamaño', field: 'size', width: '15%' },
    { label: 'Idioma', field: 'language', width: '15%' },
    { label: 'Fecha', field: 'date', width: '15%' },
    { label: 'Hora', field: 'time', width: '10%' },
  ];

  return (
    <div className="">
      <div className="w-[90vw] md:w-[70vw] lg:w-[60vw] h-[80vh] gap-6 flex flex-col mt-10 m-auto">
        <NavBarSearch 
          className="w-full md:w-[40%] lg:w-[30%]" 
          searchQuery={searchQuery} 
          onSearchChange={onSearchChange} 
        />
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
