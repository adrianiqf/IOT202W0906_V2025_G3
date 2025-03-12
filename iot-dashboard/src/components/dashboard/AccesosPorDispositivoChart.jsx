// src/components/dashboard/AccesosPorDispositivoChart.jsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AccesosPorDispositivoChart = ({ data }) => {
  return (
    <div className="card">
      <h2 className="card-title">Distribución de Accesos por Dispositivo</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="dispositivo" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="concedidos" stackId="a" fill="#4CAF50" />
            <Bar dataKey="denegados" stackId="a" fill="#F44336" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AccesosPorDispositivoChart;