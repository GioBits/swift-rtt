import onProcess from '../assets/on_process.svg'

const History = () => {
  return (
    <div className='w-[90vw] md:w-[70vw] lg:w-[60vw] h-[80vh] gap-6 lg:flex mt-10 m-auto block'>
      <div className='lg:w-1/2 w-full h-full flex flex-col m-auto bg-white rounded-lg shadow-lg shadow-blueMetal/50'>
        <div className='flex flex-col h-full w-full'>
          <div className='flex flex-col m-auto'>
            <h2 className='text-3xl font-sans font-bold text-blueMetal text-center'>En Construcción</h2>
            <img src={onProcess} alt="" className='w-full m-auto'/>

          </div>
        </div>
        
      </div>
      </div>
  )
}

export default History