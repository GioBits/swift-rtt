import onProcess from '../assets/on_process.svg'
import NavbarComponent from '../components/NavbarComponent'

const History = () => {
  return (
    <div className="w-screen h-screen">
      <div className='flex flex-col w-full h-full'>
        <NavbarComponent />
        <div className='flex flex-col m-auto'>
          <h2 className='text-3xl font-sans font-bold text-blueMetal text-center'>En Construcción</h2>
          <img src={onProcess} alt="" className='w-full m-auto' />

        </div>
      </div>
    </div>
  )
}

export default History