import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Modulo } from '../types/types';
import { fetchModulos } from '../api/courseApi';
import EvaluacionModal from './EvaluacionModal';

const ModuloContent = () => {
  const { moduloNombre } = useParams();
  const [modulo, setModulo] = useState<Modulo | null>(null);
  const [currentUnidad, setCurrentUnidad] = useState(0);
  const [currentSubunidad, setCurrentSubunidad] = useState(0);
  const [showEvaluacion, setShowEvaluacion] = useState(false);

  useEffect(() => {
    const loadModulo = async () => {
      const modulos = await fetchModulos();
      const found = modulos.find(m => m.nombre === decodeURIComponent(moduloNombre!));
      setModulo(found || null);
    };
    loadModulo();
  }, [moduloNombre]);

  if (!modulo) return <div>Cargando contenido...</div>;

  const currentUnidadContent = modulo.unidades[currentUnidad];
  const currentSubunidadContent = currentUnidadContent.subunidades[currentSubunidad];

  const handleNext = () => {
    if (currentSubunidad < currentUnidadContent.subunidades.length - 1) {
      setCurrentSubunidad(currentSubunidad + 1);
    } else if (currentUnidad < modulo.unidades.length - 1) {
      setShowEvaluacion(true); // Mostrar evaluación antes de pasar a la siguiente unidad
    }
  };

  const handlePrev = () => {
    if (currentSubunidad > 0) {
      setCurrentSubunidad(currentSubunidad - 1);
    } else if (currentUnidad > 0) {
      setCurrentUnidad(currentUnidad - 1);
      setCurrentSubunidad(modulo.unidades[currentUnidad - 1].subunidades.length - 1);
    }
  };

  const handleEvaluacionComplete = (passed: boolean) => {
    if (passed) {
      setShowEvaluacion(false);
      setCurrentUnidad(currentUnidad + 1);
      setCurrentSubunidad(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{modulo.nombre}</h1>
      
      <div className="flex gap-4">
        {/* Sidebar con navegación */}
        <div className="w-1/4">
          {modulo.unidades.map((unidad, uIndex) => (
            <div key={uIndex} className="mb-2">
              <button
                className={`w-full text-left p-2 rounded ${
                  currentUnidad === uIndex ? 'bg-blue-100' : ''
                }`}
                onClick={() => {
                  setCurrentUnidad(uIndex);
                  setCurrentSubunidad(0);
                }}
              >
                {unidad.nombre}
              </button>
            </div>
          ))}
        </div>

        {/* Contenido principal */}
        <div className="w-3/4">
          <h2 className="text-xl font-bold mb-2">{currentUnidadContent.nombre}</h2>
          
          {/* Navegación de subunidades */}
          <div className="mb-4">
            {currentUnidadContent.subunidades.map((sub, sIndex) => (
              <button
                key={sIndex}
                className={`mr-2 mb-2 p-2 rounded ${
                  currentSubunidad === sIndex ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setCurrentSubunidad(sIndex)}
              >
                {sub.nombre}
              </button>
            ))}
          </div>
          
          {/* Contenido */}
          <div className="prose max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ 
              __html: currentSubunidadContent.contenido || '' 
            }} />
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrev}
              disabled={currentUnidad === 0 && currentSubunidad === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modal de evaluación */}
      {showEvaluacion && (
        <EvaluacionModal
          unidad={currentUnidadContent}
          onComplete={handleEvaluacionComplete}
          onClose={() => setShowEvaluacion(false)}
        />
      )}
    </div>
  );
};

export default ModuloContent; 