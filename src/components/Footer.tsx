const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-yellow-400 font-semibold mb-2">⚠️ Aviso Importante</p>
          <p className="text-sm mb-4">
            Este material es una ayuda de estudio generada por Curse AI y no constituye una fuente oficial.
            Se recomienda consultar siempre la legislación vigente y fuentes oficiales.
          </p>
          <div className="text-xs text-gray-400">
            <p>El autor y los colaboradores no se hacen responsables por errores u omisiones.</p>
            <p>Generado por Curse AI - 2024</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 