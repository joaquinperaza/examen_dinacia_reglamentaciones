import { useState, useEffect } from 'react';
import { fetchModulos } from '../api/courseApi';
import { Modulo } from '../types/types';
import ModuloCard from './ModuloCard';

const ModulosList = () => {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModulos = async () => {
      const data = await fetchModulos();
      setModulos(data);
      setLoading(false);
    };
    loadModulos();
  }, []);

  if (loading) return <div>Cargando módulos...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modulos.map((modulo, index) => (
        <ModuloCard key={index} modulo={modulo} />
      ))}
    </div>
  );
};

export default ModulosList; 