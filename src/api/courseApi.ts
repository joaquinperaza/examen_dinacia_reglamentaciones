import { Modulo } from '../types/types';

export const fetchModulos = async (): Promise<Modulo[]> => {
  try {
    // Primero obtenemos la lista de módulos disponibles
    const modulos = [];
    
    // Intentamos cargar módulos del 1 al 10 (puedes ajustar este número)
    for (let i = 1; i <= 10; i++) {
      try {
        const response = await fetch(`/examen_dinacia_reglamentaciones/modulos/modulo_${i}.json`);
        if (response.ok) {
          const data = await response.json();
          for (let j = 0; j < data.unidades.length; j++) {
            data.unidades[j].moduloId = i;
          }
          modulos.push(data);
        }
      } catch (error) {
        // Si no existe el módulo, continuamos con el siguiente
        continue;
      }
    }
    
    return modulos;
  } catch (error) {
    console.error('Error cargando módulos:', error);
    return [];
  }
};

export const fetchPruebas = async (moduloId: string): Promise<any> => {
  try {
    const response = await fetch(`/examen_dinacia_reglamentaciones/pruebas/modulo_${moduloId}.json`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error cargando prueba:', error);
    return null;
  }
}; 