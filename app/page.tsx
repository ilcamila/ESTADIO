import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="bg-gray-800 shadow-2xl rounded-3xl p-10 w-full max-w-3xl text-left">
        <h1 className="text-5xl font-light mb-6 text-teal-400 text-left">Dashboard del Estadio</h1>
        <p className="text-lg mb-4 text-gray-300">
          Accede al monitoreo detallado de temperatura y humedad en distintas áreas del estadio.
        </p>

        {/* Imagen del Estadio */}
        <div className="my-10">
          <Image
            src="/images.png" // Asegúrate de que esta imagen esté en la carpeta 'public/'
            alt="Estadio"
            width={700}
            height={400}
            className="rounded-3xl shadow-md border-4 border-teal-600"
          />
        </div>

        {/* Enlace a la página de sensores */}
        <div className="flex justify-center">
          <a
            href="/sensors"
            className="bg-teal-500 text-gray-900 text-lg font-semibold px-10 py-3 rounded-xl hover:bg-teal-400 transition-transform transform hover:scale-105"
          >
            Explorar Sensores
          </a>
        </div>
      </div>
    </div>
  );
}
