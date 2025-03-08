import PropTypes from "prop-types";

const Confirm = ({ handleConfirmation }) => {
  return (
    <div className="border border-dashed border-gray-500 text-center rounded-lg cursor-pointer w-full flex justify-center items-center box-border h-full p-4 sm:p-6 md:p-8">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-brownie">Confirmar subida</h2>
        <p>¿Estás seguro de que deseas subir este archivo de audio?</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleConfirmation(false)}
            className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleConfirmation(true)}
            className="px-4 py-2 bg-cerulean text-white rounded hover:bg-cerulean/60"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Confirm

Confirm.PropTypes = {
  handleConfirmation: PropTypes.any.isRequired
}