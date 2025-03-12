// src/components/dashboard/KPICards.jsx

import React from 'react';
import { Activity, Shield, Server, ArrowUpRight, ArrowDownRight, Users } from 'lucide-react';

const KPICards = ({ stats }) => {
  const { totalAccesos, tasaExito, totalUsuarios, totalDispositivos } = stats;
  
  return (
    <div className="dashboard-kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon-container blue">
          <Activity className="kpi-icon blue" />
        </div>
        <div className="kpi-content">
          <p className="kpi-title">Total de Accesos</p>
          <div className="kpi-value-container">
            <p className="kpi-value">{totalAccesos || 0}</p>
            <span className="kpi-change up">
              <ArrowUpRight className="kpi-change-icon" />
              25%
            </span>
          </div>
        </div>
      </div>
      
      <div className="kpi-card">
        <div className="kpi-icon-container green">
          <Shield className="kpi-icon green" />
        </div>
        <div className="kpi-content">
          <p className="kpi-title">Tasa de Éxito</p>
          <div className="kpi-value-container">
            <p className="kpi-value">{tasaExito || 0}%</p>
            <span className="kpi-change down">
              <ArrowDownRight className="kpi-change-icon" />
              5%
            </span>
          </div>
        </div>
      </div>
      
      <div className="kpi-card">
        <div className="kpi-icon-container yellow">
          <Users className="kpi-icon yellow" />
        </div>
        <div className="kpi-content">
          <p className="kpi-title">Usuarios Activos</p>
          <div className="kpi-value-container">
            <p className="kpi-value">{totalUsuarios || 0}</p>
            <span className="kpi-change neutral">
              Sin cambios
            </span>
          </div>
        </div>
      </div>
      
      <div className="kpi-card">
        <div className="kpi-icon-container red">
          <Server className="kpi-icon red" />
        </div>
        <div className="kpi-content">
          <p className="kpi-title">Dispositivos Activos</p>
          <div className="kpi-value-container">
            <p className="kpi-value">{totalDispositivos || 0}</p>
            <span className="kpi-change up">
              <ArrowUpRight className="kpi-change-icon" />
              1 nuevo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICards;