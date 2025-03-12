import { useEffect } from 'react';
import { LoginForm } from '../components/forms/LoginForm';
import { RegisterForm } from '../components/forms/RegisterForm'
import { useLocation } from 'react-router-dom';
import logoColibri from '../assets/logo_colibri.png';

const Login = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = location.pathname === '/register' ? 'Registrarse en SwiftVoice' : 'Iniciar sesión en SwiftVoice';
  }, [location]);

  return (
    <>
      <div className='flex flex-col items-center justify-center h-screen w-full bg-[#1c6e8c] z-10'>
        <div className='flex flex-col items-center justify-center h-screen w-full -mt-30'>
          <img src={logoColibri} alt='Colibri Logo' className='h-[15%] w-[15%] mb-4' />
          <div className='relative mb-12 text-center'>
            <h1 className='text-white text-6xl mb-1 font-serif font-bold'>SwiftVoice</h1>
            <h2 className='text-white text-xl uppercase font-sans font-semibold'>
              TRANSCRIPCIÓN - TRADUCCIÓN - TEXTO A VOZ
            </h2>
          </div>

          {location.pathname === '/register' ? < RegisterForm /> : < LoginForm />}

          <footer className='absolute bottom-0 w-full text-white text-center py-4'>
            <div className='flex flex-row items-center justify-center mb-2 relative'>
              <p className='text-base'>Desarrollado por <strong>Bug Buster</strong></p>
            </div>
            <span className='text-sm'>&copy; Enero - Marzo 2025 <strong>BugBuster&trade;</strong></span>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Login;