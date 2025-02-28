import { useEffect } from 'react'
import { LoginForm } from '../components/forms/LoginForm'
import ParticleBg from '../components/ParticleBg'
import stt from '../assets/speech_to_text_pana.svg'
import logoColibri from '../assets/logo_colibri.png'

const Login = () => {
  useEffect(() => {
    document.title = 'Iniciar sesión en Prisma | Prisma'
  }, [])

  return (
    <>
      <div className='flex flex-col items-center justify-center h-screen w-full bg-gradient-to-b from-indigo-500 to-indigo-900'>
        {/* Logo del Colibrí arriba */}
        <img src={logoColibri} alt='Colibri Logo' className='h-40 w-70 mb-4 z-10' />  
        
        {/* Título y subtítulo */}
        <div className='relative mb-12 text-center z-10'>
          <h1 className='text-white text-6xl mb-1 uppercase font-serif font-bold'>Colibri App</h1>
          <h2 className='text-white text-xl uppercase font-serif font-semibold'>
            TRANSCRIBE Y TRADUCE CONTENIDO MULTIMEDIA DE VOZ A VOZ
          </h2>
        </div>

        {/* Formulario de Login */}
        <div className='flex flex-row shadow-xl z-10'>
          <LoginForm/>
          <div className='hidden sm:block bg-slate-400'>
            <img src={stt} alt='Colibri App' className='h-80 sm:rounded-r-sm' />
          </div>
        </div>

        {/* Footer */}
        <footer className='absolute bottom-0 w-full text-white text-center py-4'>
          <div className='flex flex-row items-center justify-center mb-2 relative z-10'>
            <p className='text-base'>Desarrollado por <strong>Bug Buster</strong></p>
          </div>
          <span className='text-sm'>&copy; Enero - Marzo 2025 <strong>BugBuster&trade;</strong></span>
        </footer>
      </div>
      
      <ParticleBg className='z-0' />
    </>
  )
}

export default Login
