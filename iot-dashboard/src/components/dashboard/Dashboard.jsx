// src/components/dashboard/Dashboard.jsx

import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { useDataCompleta } from '../../hooks/useDataCompleta';
import { filtrarIngresosPorPeriodo } from '../../utils/dataProcessing';
import '../../styles/dashboard.css';

// Import the tab content components
import PrincipalTabContent from './tabs/PrincipalTab';
import UsuariosTabContent from './tabs/UsuariosTab';
import DispositivosTabContent from './tabs/DispositivosTab';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('principal');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('hoy');
  const { ingresos, usuarios, tarjetas, stats, loading, error, refreshData } = useDataCompleta();

  const ingresosFiltrados = React.useMemo(() => {
    return filtrarIngresosPorPeriodo(ingresos, periodoSeleccionado);
  }, [ingresos, periodoSeleccionado]);

  // Calcular datos para distribución por carrera
  const distribucionCarreras = React.useMemo(() => {
    const carrerasMap = new Map();
    usuarios.forEach(usuario => {
      if (!carrerasMap.has(usuario.carrera)) {
        carrerasMap.set(usuario.carrera, 0);
      }
      carrerasMap.set(usuario.carrera, carrerasMap.get(usuario.carrera) + 1);
    });
    
    return Array.from(carrerasMap.entries()).map(([carrera, cantidad]) => ({
      carrera,
      cantidad
    }));
  }, [usuarios]);
  
  // Calcular usuarios frecuentes
  const usuariosFrecuentes = React.useMemo(() => {
    const usrFreq = new Map();
    
    ingresos.forEach(ingreso => {
      if (ingreso.usuario === 'Desconocido') return;
      
      if (!usrFreq.has(ingreso.usuario)) {
        usrFreq.set(ingreso.usuario, {
          nombre: ingreso.usuario,
          accesos: 0,
          exitosos: 0
        });
      }
      
      const usr = usrFreq.get(ingreso.usuario);
      usr.accesos++;
      if (ingreso.acceso) {
        usr.exitosos++;
      }
    });
    
    return Array.from(usrFreq.values())
      .map(usr => ({
        ...usr,
        porcentajeExito: usr.accesos > 0 ? Math.round((usr.exitosos / usr.accesos) * 100) : 0,
        carrera: usuarios.find(u => `${u.nombres} ${u.apellidos}` === usr.nombre)?.carrera || 'Desconocido'
      }))
      .sort((a, b) => b.accesos - a.accesos)
      .slice(0, 5); // Top 5 usuarios
  }, [ingresos, usuarios]);
  
  // Simulación de datos históricos
  const accesoHistorico = [
    { fecha: '27/02', concedidos: 4, denegados: 1 },
    { fecha: '28/02', concedidos: 5, denegados: 2 },
    { fecha: '01/03', concedidos: 3, denegados: 1 },
    { fecha: '02/03', concedidos: 6, denegados: 0 },
    { fecha: '03/03', concedidos: 4, denegados: 2 },
    { fecha: '04/03', concedidos: stats.accesosPorEstado.find(a => a.name === 'Concedidos')?.value || 0, 
                      denegados: stats.accesosPorEstado.find(a => a.name === 'Denegados')?.value || 0 }
  ];
  
  if (loading) {
    return <div className="loading-container">Cargando datos de DynamoDB...</div>;
  }
  
  if (error) {
    return <div className="error-container">Error al cargar datos: {error}</div>;
  }
  
  return (
    <div className="dashboard">
      <header className="dashboard-header-enhanced">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title-enhanced">Dashboard de Control de Acceso IoT</h1>
          <div className="dashboard-badge">
            <Clock className="dashboard-badge-icon" />
            Actualizado: {new Date().toLocaleString()}
          </div>
          <div className="dashboard-controls">
            <select 
              className="dashboard-select" 
              value={periodoSeleccionado}
              onChange={(e) => setPeriodoSeleccionado(e.target.value)}
            >
              <option value="hoy">Hoy</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mes</option>
            </select>
            <button className="dashboard-button" onClick={refreshData} disabled={loading}>
              {loading ? 'Cargando...' : 'Actualizar datos'}
            </button>
          </div>
        </div>
      </header>

      {/* Sistema de pestañas */}
      <div className="tabs-container">
        <div className="tabs-list">
          <button 
            className={`tab-trigger ${activeTab === 'principal' ? 'active' : ''}`}
            onClick={() => setActiveTab('principal')}
          >
            Principal
          </button>
          <button 
            className={`tab-trigger ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('usuarios')}
          >
            Usuarios
          </button>
          <button 
            className={`tab-trigger ${activeTab === 'dispositivos' ? 'active' : ''}`}
            onClick={() => setActiveTab('dispositivos')}
          >
            Dispositivos
          </button>
        </div>
      </div>

      {/* Contenido de las pestañas */}
      {activeTab === 'principal' && (
        <PrincipalTabContent 
          stats={stats} 
          ingresosFiltrados={ingresosFiltrados} 
          accesoHistorico={accesoHistorico} 
        />
      )}

      {activeTab === 'usuarios' && (
        <UsuariosTabContent 
          distribucionCarreras={distribucionCarreras}
          tarjetas={tarjetas}
          usuariosFrecuentes={usuariosFrecuentes}
        />
      )}

      {activeTab === 'dispositivos' && (
        <DispositivosTabContent 
          stats={stats} 
        />
      )}
    </div>
  );
};

export default Dashboard;