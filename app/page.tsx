import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-6">
      
      {/* Encabezado con el título central */}
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-6xl font-extrabold text-teal-400 mb-4">Estadio UDEC</h1>
        <p className="text-lg text-gray-300 leading-relaxed">
          Monitoreo de temperatura y humedad en tiempo real para mantener el ambiente óptimo en el estadio.
        </p>
      </div>

      {/* Sección principal con el logo, contenido y enlace */}
      <div className="flex flex-col md:flex-row items-center justify-around w-full max-w-6xl bg-gray-800 bg-opacity-80 rounded-3xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
        
        {/* Logo izquierdo */}
        <div className="flex-shrink-0 mb-8 md:mb-0 md:mr-8">
          <Image
            src="/Logo_Universidad_de_Cundinamarca.png"
            alt="Logo Universidad de Cundinamarca"
            width={150}
            height={150}
            className="rounded-full shadow-lg border-4 border-teal-500 transform hover:rotate-6 transition-transform duration-300"
          />
        </div>

        {/* Contenido principal en el centro */}
        <div className="text-center md:text-left md:w-2/3">
          <p className="text-xl text-gray-200 mb-6 leading-relaxed">
            Explora el monitoreo detallado de las condiciones del estadio con nuestros sensores de última tecnología.
          </p>
          <p className="text-sm text-gray-400 italic mb-6">
            "Asegurando la mejor experiencia para cada visitante en el Estadio UDEC"
          </p>
          {/* Enlace a la página de sensores */}
          <div className="flex justify-center md:justify-start">
            <a
              href="/sensors"
              className="bg-teal-500 text-gray-900 text-lg font-semibold px-10 py-3 rounded-full hover:bg-teal-400 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Explorar Sensores
            </a>
          </div>
        </div>

        {/* Imagen del Estadio */}
        <div className="flex-shrink-0 mt-8 md:mt-0 md:ml-8">
          <Image
            src="/images.png" // Asegúrate de que esta imagen esté en la carpeta 'public/'
            alt="Estadio"
            width={250}
            height={250}
            className="rounded-2xl shadow-xl border-4 border-teal-600 transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Pie de página con logos adicionales */}
      <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-6xl mt-16">
        <div className="flex items-center justify-center mb-8 sm:mb-0 sm:mr-8">
          <Image
            src="/Logo_Universidad_de_Cundinamarca.png"
            alt="Logo Universidad de Cundinamarca"
            width={100}
            height={100}
            className="rounded-full shadow-lg border-2 border-teal-500 transform hover:rotate-6 transition-transform duration-300"
          />
        </div>
        <div className="text-center sm:text-left text-gray-400">
          <p className="text-sm">Universidad de Cundinamarca</p>
          <p className="text-xs italic">Liderando el futuro del monitoreo ambiental en instalaciones deportivas.</p>
        </div>
      </div>
    </div>
  );
}
