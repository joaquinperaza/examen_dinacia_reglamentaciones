interface Subunidad {
  nombre: string;
  contenido?: string;
  referencias?: {
    [key: string]: string; // Para vincular preguntas con contenido
  };
}

interface Unidad {
  nombre: string;
  moduloId: number;
  subunidades: Subunidad[];
  evaluacion?: {
    preguntas: {
      texto: string;
      opciones: string[];
      respuestaCorrecta: number;
      referencia: string;
    }[];
  };
}

interface Modulo {
  nombre: string;
  id?: number;
  unidades: Unidad[];
}

export type { Modulo, Unidad, Subunidad }; 