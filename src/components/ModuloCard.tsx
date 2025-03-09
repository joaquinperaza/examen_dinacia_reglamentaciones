import { Link } from 'react-router-dom';
import { Modulo } from '../types/types';

interface ModuloCardProps {
  modulo: Modulo;
}

const ModuloCard = ({ modulo }: ModuloCardProps) => {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold mb-2">{modulo.nombre}</h2>
      <div className="mb-4">
        <p className="text-gray-600">
          {modulo.unidades.length} unidades
        </p>
      </div>
      <Link 
        to={`/modulo/${encodeURIComponent(modulo.nombre)}`}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Comenzar módulo
      </Link>
    </div>
  );
};

export default ModuloCard; 