// src/components/dashboard/tabs/PrincipalTab.jsx

import React from 'react';
import KPICards from '../KPICards';
import AccesosRecientes from '../AccesosRecientes';
import AccesosEstadoChart from '../AccesosEstadoChart';
import AccesosPorHoraChart from '../AccesosPorHoraChart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PrincipalTabContent = ({ stats, ingresosFiltrados, accesoHistorico }) => {
  return (
    <>
      {/* Sección de Métricas Clave (KPIs) */}
      <KPICards stats={stats} />
      
      {/* Primera Fila de Gráficos */}
      <div className="dashboard-row dashboard-cols-1 lg-grid-cols-3">
        <AccesosRecientes ingresos={ingresosFiltrados} />
        <AccesosEstadoChart data={stats.accesosPorEstado} />
        <AccesosPorHoraChart data={stats.accesosPorHora} />
      </div>

      {/* Segunda Fila de Gráficos */}
      <div className="dashboard-row dashboard-cols-1 lg-grid-cols-2">
        
        
        {/* Histórico de Accesos */}
        <div className="card">
          <h2 className="card-title">Histórico de Accesos</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={accesoHistorico}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="concedidos" stackId="1" stroke="#4CAF50" fill="#4CAF50" />
                <Area type="monotone" dataKey="denegados" stackId="1" stroke="#F44336" fill="#F44336" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrincipalTabContent;