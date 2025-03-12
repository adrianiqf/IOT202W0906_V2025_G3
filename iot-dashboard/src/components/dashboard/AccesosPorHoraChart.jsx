// src/components/dashboard/AccesosPorHoraChart.jsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AccesosPorHoraChart = ({ data }) => {
  return (
    <div className="card">
      <h2 className="card-title">Tendencia de Accesos por Hora</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="concedidos" stroke="#4CAF50" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="denegados" stroke="#F44336" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AccesosPorHoraChart;