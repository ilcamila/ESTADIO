import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-white to-green-900 flex flex-col items-center justify-center p-6">
      
      {/* Encabezado con el título central */}
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-6xl font-extrabold text-green-600 mb-4">Estadio Universidad de Cundinamarca</h1>
        <p className="text-lg text-gray-800 leading-relaxed italic">
          &quot;Donde el fútbol cobra vida y los sueños se hacen realidad&quot;
        </p>
      </div>

      {/* Sección principal con el logo, contenido y enlace */}
      <div className="flex flex-col md:flex-row items-center justify-around w-full max-w-6xl bg-white bg-opacity-90 rounded-3xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
        
        {/* Logo izquierdo */}
        <div className="flex-shrink-0 mb-8 md:mb-0 md:mr-8">
          <Image
            src="/Logo_Universidad_de_Cundinamarca.png"
            alt="Logo Universidad de Cundinamarca"
            width={150}
            height={150}
            className="rounded-full shadow-lg border-4 border-green-600 transform hover:rotate-6 transition-transform duration-300"
          />
        </div>

        {/* Contenido principal en el centro */}
        <div className="text-center md:text-left md:w-2/3">
          <p className="text-xl text-green-700 mb-6 leading-relaxed italic">
            &quot;Donde cada partido es una batalla y cada gol, una victoria&quot;
          </p>
          {/* Enlace a la página de sensores */}
          <div className="flex justify-center md:justify-start">
            <a
              href="/sensors"
              className="bg-green-600 text-white text-lg font-semibold px-10 py-3 rounded-full hover:bg-green-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Humedad del Terreno
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
            className="rounded-2xl shadow-xl border-4 border-green-600 transform hover:scale-105 transition-transform duration-300"
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
            className="rounded-full shadow-lg border-2 border-green-600 transform hover:rotate-6 transition-transform duration-300"
          />
        </div>
        <div className="text-center sm:text-left text-gray-600">
          <p className="text-sm">Universidad de Cundinamarca</p>
          <p className="text-xs italic">Apoyando el desarrollo deportivo y el espíritu competitivo.</p>
        </div>
      </div>
    </div>
  );
}
