import MediaUploadHistory from '../components/MediaUploadHistory';
import NavbarComponent from '../components/NavbarComponent';
import { useHistoryData } from '../hooks/useHistoryData';
import Modal from "../components/mediaResponse/ModalResponse";
import MediaContent from "../components/mediaResponse/MediaContent";
import NavBarSearch from '../components/NavbarSearch';
import FilterMenu from '../components/FilterMenu';

const History = () => {
  const { historyData, state, onRowClick, closeModal, searchQuery, onSearchChange, initialFilters, onFiltersChange, maxSize } = useHistoryData();

  const columns = [
    { label: 'ID', field: 'id', width: '5%' },
    { label: 'Nombre', field: 'name', width: '30%' },
    { label: 'Tamaño', field: 'size', width: '15%' },
    { label: 'Idioma', field: 'language', width: '15%' },
    { label: 'Fecha', field: 'date', width: '15%' },
    { label: 'Hora', field: 'time', width: '10%' },
  ];

  return (
    <div className="w-screen h-screen">
      <NavbarComponent />
      <div className="w-[90vw] md:w-[70vw] lg:w-[60vw] h-[80vh] gap-6 flex mt-10 m-auto">
        <div className="">
          <NavBarSearch
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
          <FilterMenu 
            initialFilters={initialFilters}
            onFiltersChange={onFiltersChange}
            maxSize={maxSize}
          />
        </div>
        <div className='w-[90vw] md:w-[70vw] lg:w-[60vw] h-[80vh] gap-6 flex m-auto'>
          <MediaUploadHistory rows={historyData} onRowClick={onRowClick} columns={columns} />
        </div>
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
