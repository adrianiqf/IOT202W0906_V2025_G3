// src/components/dashboard/tabs/DispositivosTab.jsx

import React from 'react';
import AccesosPorDispositivoChart from '../AccesosPorDispositivoChart';

const DispositivosTabContent = ({ stats }) => {
  return (
    <>
      
      <div className="dashboard-row dashboard-cols-1 lg-grid-cols-2">
        <div className="card">
          <h2 className="card-title">Actividad por Dispositivo</h2>
          <div className="chart-container">
            <AccesosPorDispositivoChart data={stats.accesosPorDispositivo} />
          </div>
        </div>
        
      </div>
    </>
  );
};

export default DispositivosTabContent;