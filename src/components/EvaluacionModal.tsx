import { useState, useEffect } from 'react';
import { Unidad } from '../types/types';
import { fetchPruebas } from '../api/courseApi';

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

function calcularSimilitudTexto(str1: string, str2: string): number {
  // Normalizar textos: convertir a minúsculas, eliminar puntuación y espacios extra
  const normalizar = (texto: string): string => {
    return texto
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const s1 = normalizar(str1);
  const s2 = normalizar(str2);

  // Si los textos normalizados son iguales, retorna similitud perfecta
  if (s1 === s2) return 1;

  // Calcular la distancia de Levenshtein
  const matriz = Array(s2.length + 1).fill(null).map(() => 
    Array(s1.length + 1).fill(null)
  );

  for (let i = 0; i <= s1.length; i++) matriz[0][i] = i;
  for (let j = 0; j <= s2.length; j++) matriz[j][0] = j;

  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const sustitución = matriz[j - 1][i - 1] + (s2[j - 1] === s1[i - 1] ? 0 : 1);
      matriz[j][i] = Math.min(
        matriz[j][i - 1] + 1, // inserción
        matriz[j - 1][i] + 1, // eliminación
        sustitución // sustitución
      );
    }
  }

  // Convertir la distancia en una medida de similitud entre 0 y 1
  const maxLength = Math.max(s1.length, s2.length);
  const similitud = 1 - (matriz[s2.length][s1.length] / maxLength);

  return similitud;
}

const EvaluacionModal = ({ unidad, onComplete, onClose }: EvaluacionModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [respuestas, setRespuestas] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [referencias, setReferencias] = useState<string[]>([]);
  const [preguntasUnidad, setPreguntasUnidad] = useState<Pregunta[]>([]);
  const [preguntasIncorrectas, setPreguntasIncorrectas] = useState<Pregunta[]>([]);

  useEffect(() => {
    const cargarPreguntas = async () => {
      const data = await fetchPruebas(unidad.moduloId.toString());
      if (!data) {
        setPreguntasUnidad([]);
        return;
      }

      // Usar la función de similitud para filtrar preguntas
      const preguntasSeleccionadas = data.preguntas.filter(
        (pregunta: Pregunta) => calcularSimilitudTexto(pregunta.unidad, unidad.nombre) > 0.8
      );

      setPreguntasUnidad(preguntasSeleccionadas);
    };

    cargarPreguntas();
  }, [unidad]);

  const handleRespuesta = (respuestaIndex: number) => {
    const newRespuestas = [...respuestas, respuestaIndex];
    setRespuestas(newRespuestas);

    const preguntaActual = preguntasUnidad[currentQuestion];
    if (respuestaIndex !== preguntaActual.opcion_correcta) {
      setReferencias([...referencias, preguntaActual.subunidad]);
      setPreguntasIncorrectas([...preguntasIncorrectas, preguntaActual]);
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
            
            {preguntasIncorrectas.length > 0 && (
              <div className="mt-4">
                <p className="font-bold">Preguntas incorrectas:</p>
                <ul className="list-disc pl-5 mb-4">
                  {preguntasIncorrectas.map((pregunta, index) => (
                    <li key={index} className="mb-2">
                      <p>{pregunta.pregunta}</p>
                      <p className="text-red-500">Tu respuesta: {pregunta.opciones[respuestas[preguntasUnidad.findIndex(p => p === pregunta)]]}</p>
                      <p className="text-green-500">Respuesta correcta: {pregunta.opciones[pregunta.opcion_correcta]}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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