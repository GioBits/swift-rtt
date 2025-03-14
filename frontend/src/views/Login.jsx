import { useEffect } from 'react';
import { LoginForm } from '../components/forms/LoginForm';
import { RegisterForm } from '../components/forms/RegisterForm'
import { useLocation } from 'react-router-dom';

const Login = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = location.pathname === '/register' ? 'Registrarse en SwiftVoice' : 'Iniciar sesión en SwiftVoice';
  }, [location]);

  return (
    <>
      <div className='flex flex-col items-center justify-center h-screen w-screen bg-[#1c6e8c]'>
        <div className='flex flex-col h-full w-full p-6 m-auto z-10 gap-6'>
          {/* Title */}
          <div className='flex flex-col text-center'>
            <h1 className='text-white text-5xl md:text-6xl mb-1 font-serif font-bold'>SwiftVoice</h1>
            <h2 className='text-white text-lg md:text-xl uppercase font-sans font-semibold'>
              TRANSCRIPCIÓN - TRADUCCIÓN - TEXTO A VOZ
            </h2>
          </div>
          {/* Forms and path */}
          <div className='flex mx-auto z-10'>
            <div className='flex flex-row w-100 md:w-200 h-100 rounded-lg bg-white'>
            {location.pathname === '/register' ? < RegisterForm /> : < LoginForm />}
            </div>
          </div>
        </div>
          <footer className='flex flex-col w-screen text-white text-center py-2 bg-brownie z-1'>
            <div className='flex flex-row items-center justify-center mb-1'>
              <p className='text-base'>Desarrollado por <strong>BugBuster</strong></p>
            </div>
            <span className='text-sm'>&copy; Enero - Marzo 2025 <strong>BugBuster&trade;</strong></span>
          </footer>
      </div>
    </>
  );
};

export default Login;