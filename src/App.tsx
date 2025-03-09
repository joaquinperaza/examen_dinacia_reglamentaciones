import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModulosList from './components/ModulosList';
import ModuloContent from './components/ModuloContent';
import Footer from './components/Footer';

const App = () => {
  const basePath = import.meta.env.BASE_URL || '/';
  return (
    <Router basename={basePath}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-white shadow-md p-4">
          <h1 className="text-2xl font-bold">Curso Examen Libre: Reglamentaciones Aeronáuticas Uruguayas</h1>
        </nav>
        
        <main className="container mx-auto py-8 flex-grow">
          <Routes>
            <Route path="/" element={<ModulosList />} />
            <Route path="/modulo/:moduloNombre" element={<ModuloContent />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App; 