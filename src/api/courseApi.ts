import { Modulo } from '../types/types';

export const fetchModulos = async (): Promise<Modulo[]> => {
  try {
    const response = await fetch('/examen_dinacia/modulos/modulo_1.json');
    const data = await response.json();
    return [data];
  } catch (error) {
    console.error('Error cargando módulos:', error);
    return [];
  }
};

export const fetchPruebas = async (moduloId: string): Promise<any> => {
  try {
    const response = await fetch(`/examen_dinacia/pruebas/prueba_${moduloId}.json`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error cargando prueba:', error);
    return null;
  }
}; 