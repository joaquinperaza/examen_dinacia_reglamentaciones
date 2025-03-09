import { useState, useEffect } from 'react';
import { Unidad } from '../types/types';
import preguntas from '../pruebas/modulo_1.json';

interface Pregunta {
  pregunta: string;
  opciones: string[];
  opcion_correcta: number;
  unidad: string;
  subunidad: string;
  modulo: string;
}

interface EvaluacionModalProps {
  unidad: Unidad;
  onComplete: (passed: boolean) => void;
  onClose: () => void;
}

const EvaluacionModal = ({ unidad, onComplete, onClose }: EvaluacionModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [respuestas, setRespuestas] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [referencias, setReferencias] = useState<string[]>([]);
  const [preguntasUnidad, setPreguntasUnidad] = useState<Pregunta[]>([]);

  useEffect(() => {
    // Filtrar preguntas por unidad
    const preguntasDisponibles = preguntas.preguntas.filter(
      (pregunta) => pregunta.unidad === unidad.nombre
    );

    // Mezclar y seleccionar 5 preguntas aleatorias
    const preguntasSeleccionadas = preguntasDisponibles
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    setPreguntasUnidad(preguntasSeleccionadas);
  }, [unidad]);

  const handleRespuesta = (respuestaIndex: number) => {
    const newRespuestas = [...respuestas, respuestaIndex];
    setRespuestas(newRespuestas);

    const preguntaActual = preguntasUnidad[currentQuestion];
    if (respuestaIndex !== preguntaActual.opcion_correcta) {
      setReferencias([...referencias, preguntaActual.subunidad]);
    }

    if (currentQuestion < preguntasUnidad.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const correctas = newRespuestas.filter(
        (resp, index) => resp === preguntasUnidad[index].opcion_correcta
      ).length;
      const porcentaje = (correctas / preguntasUnidad.length) * 100;
      setShowResults(true);
      onComplete(porcentaje >= 90);
    }
  };

  if (preguntasUnidad.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <p>No hay preguntas disponibles para esta unidad</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        {!showResults ? (
          <>
            <h3 className="text-xl font-bold mb-4">
              Evaluación: {unidad.nombre}
            </h3>
            <div className="mb-4">
              <p className="font-bold mb-2">
                Pregunta {currentQuestion + 1} de {preguntasUnidad.length}
              </p>
              <p>{preguntasUnidad[currentQuestion].pregunta}</p>
            </div>
            <div className="space-y-2">
              {preguntasUnidad[currentQuestion].opciones.map((opcion, index) => (
                <button
                  key={index}
                  className="w-full p-2 text-left border rounded hover:bg-blue-50"
                  onClick={() => handleRespuesta(index)}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div>
            <h3 className="text-xl font-bold mb-4">Resultados</h3>
            <p>
              Respuestas correctas: {
                respuestas.filter(
                  (resp, index) => resp === preguntasUnidad[index].opcion_correcta
                ).length
              } de {preguntasUnidad.length}
            </p>
            {referencias.length > 0 && (
              <div className="mt-4">
                <p className="font-bold">Material de referencia para repasar:</p>
                <ul className="list-disc pl-5">
                  {[...new Set(referencias)].map((ref, index) => (
                    <li key={index}>
                      <button 
                        className="text-blue-500 hover:underline"
                        onClick={() => {
                          onClose();
                          const elemento = document.querySelector(`[data-subunidad="${ref}"]`);
                          if (elemento) {
                            elemento.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        {ref}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluacionModal; 