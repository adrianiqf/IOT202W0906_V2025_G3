// src/components/dashboard/tabs/UsuariosTab.jsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UsuariosTabContent = ({ distribucionCarreras, tarjetas, usuariosFrecuentes }) => {
  return (
    <>
      <div className="dashboard-row dashboard-cols-1 lg-grid-cols-2">
        {/* Distribución de Usuarios por Carrera */}
        <div className="card">
          <h2 className="card-title">Distribución de Usuarios por Carrera</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribucionCarreras}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="carrera" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alertas de Tarjetas Próximas a Expirar */}
        <div className="card">
          <h2 className="card-title">Tarjetas Próximas a Expirar</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Número Tarjeta</th>
                  <th>Expiración</th>
                  <th>Días Restantes</th>
                </tr>
              </thead>
              <tbody>
                {tarjetas.map((tarjeta) => (
                  <tr key={tarjeta.id}>
                    <td>{tarjeta.usuario}</td>
                    <td>{tarjeta.numero_tarjeta}</td>
                    <td>{tarjeta.fecha_experiacion}</td>
                    <td>
                      <span className={`badge ${
                        tarjeta.diasRestantes > 30 ? 'badge-success' : 'badge-warning'
                      }`}>
                        {tarjeta.diasRestantes} días
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Usuarios Frecuentes */}
      <div className="card">
        <h2 className="card-title">Usuarios Frecuentes</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Carrera</th>
                <th>Total Accesos</th>
                <th>Tasa de Éxito</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFrecuentes.map((usuario, index) => (
                <tr key={index}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.carrera}</td>
                  <td>{usuario.accesos}</td>
                  <td>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${usuario.porcentajeExito}%` }}
                        ></div>
                      </div>
                      <span>{usuario.porcentajeExito}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UsuariosTabContent;