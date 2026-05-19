import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import RegistrarDocente from '../pages/RegisterDocente';
import RegistrarEstudiante from '../pages/Docente/RegisterEstudiante';
import Dashboard from '../pages/Dashboard';
import Contenidos from '../pages/Docente/Contenidos';
import ContenidoDetalle from '../pages/Docente/ContenidoDetalle';
import CrearContenido from '../pages/Docente/CrearContenido';
import Evaluaciones from '../pages/Docente/Evaluaciones';
import CrearEvaluacion from '../pages/Docente/CrearEvaluacion';
import ProtectedRoute from './ProtectedRoute';
import EvaluacionesDetalles from '../pages/Docente/EvaluacionesDetalles';
import Juegos from '../pages/Docente/Juegos';
import CrearJuegos from '../pages/Docente/CrearJuegos';

import StudentDashboard from '../pages/Estudiantes/StudentDashboard';
import StudentContenidos from '../pages/Estudiantes/StudentContenidos';
import StudentContenidoDetalle from '../pages/Estudiantes/StudentContenidoDetalle';
import StudentJuegos from '../pages/Estudiantes/StudentJuegos';
import StudentJuegoResolver from '../pages/Estudiantes/StudentJuegoResolver';
import StudentEvaluaciones from '../pages/Estudiantes/StudentEvaluaciones';
import StudentEvaluacionResolver from '../pages/Estudiantes/StudentEvaluacionResolver';
import StudentProgreso from '../pages/Estudiantes/StudentProgreso';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registroDocente" element={<RegistrarDocente />} />

      {/* Ruta protegida solo para profesores */}
      <Route 
        path="/registroEstudiante" 
        element={
          <ProtectedRoute>
            <RegistrarEstudiante />
          </ProtectedRoute>
        } 
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Rutas de Contenidos */}
      <Route
        path="/contenidos"
        element={
          <ProtectedRoute>
            <Contenidos />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/contenidos/:id"
        element={
          <ProtectedRoute>
            <ContenidoDetalle />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/contenidos/:id/editar"
        element={
          <ProtectedRoute requiredRole="teacher">
            <ContenidoDetalle />
          </ProtectedRoute>
        }
      />

      <Route
        path="/crear-contenido"
        element={
          <ProtectedRoute requiredRole="teacher">
            <CrearContenido />
          </ProtectedRoute>
        }
      />

      {/* Rutas de Evaluaciones */}
      <Route
        path="/evaluaciones"
        element={
          <ProtectedRoute>
            <Evaluaciones />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/evaluaciones/:id"
        element={
          <ProtectedRoute>
            <EvaluacionesDetalles />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/evaluaciones/:id/editar"
        element={
          <ProtectedRoute requiredRole="teacher">
            <EvaluacionesDetalles />
          </ProtectedRoute>
        }
      />

      <Route
        path="/crear-evaluacion"
        element={
          <ProtectedRoute requiredRole="teacher">
            <CrearEvaluacion />
          </ProtectedRoute>
        }
      />

      {/* Rutas de Juegos */}
      <Route 
        path="/juegos"
        element={
          <ProtectedRoute>
            <Juegos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/crear-juegos"
        element={
          <ProtectedRoute requiredRole="teacher">
            <CrearJuegos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/editar-juego/:id"
        element={
          <ProtectedRoute requiredRole="teacher">
            <CrearJuegos />
          </ProtectedRoute>
        }
      />

      {/* Rutas de Estudiante */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/contenidos"
        element={
          <ProtectedRoute>
            <StudentContenidos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/contenidos/:id"
        element={
          <ProtectedRoute>
            <StudentContenidoDetalle />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/juegos"
        element={
          <ProtectedRoute>
            <StudentJuegos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/juegos/:id"
        element={
          <ProtectedRoute>
            <StudentJuegoResolver />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/evaluaciones"
        element={
          <ProtectedRoute>
            <StudentEvaluaciones />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/evaluaciones/:id"
        element={
          <ProtectedRoute>
            <StudentEvaluacionResolver />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/progreso"
        element={
          <ProtectedRoute>
            <StudentProgreso />
          </ProtectedRoute>
        }
      />

      {/* Ruta 404 - No encontrada */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;