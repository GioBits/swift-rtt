import * as React from 'react';

const pages = ['Traducir', 'Historial'];

function NavbarComponent() {

  return (
    <div className='h-[60px] bg-primary flex'>
        <div className='w-[30%] h-full border-r border-gray-500 flex'>
            <div className='w-auto h-[40px] m-auto flex'>
                <div className='flex' >
                    <img
                    src="/src/assets/logo.png"  // Asegúrate de que el archivo esté en la carpeta public
                    alt="Logo"
                    style={{ width: 70, height: 40 }}
                    />
                </div>
                <div className='flex'>
                    <div className='text-2xl m-auto font-semibold text-white'>
                        Real Time Translation
                    </div>
                </div>
            </div>
        </div>
        <div className='w-[70%] h-full flex'>
            <div className='w-auto h-[40px] m-auto flex ml-[20px]'> 
                <div className='mr-[10px] flex'>
                    <div className='m-auto text-2xl m-auto font-semibold text-white'>
                        Traducir
                    </div>
                </div>
                <div className='flex'>
                    <div className='m-auto text-2xl m-auto font-semibold text-white'>
                        Historial
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
export default NavbarComponent;
