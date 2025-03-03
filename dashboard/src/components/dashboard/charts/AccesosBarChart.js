import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AccesosBarChart = ({ data, layout = 'vertical' }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        layout={layout}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {layout === 'vertical' ? (
          <>
            <XAxis type="number" />
            <YAxis dataKey="fecha" type="category" />
          </>
        ) : (
          <>
            <XAxis dataKey="name" />
            <YAxis />
          </>
        )}
        <Tooltip />
        <Legend />
        <Bar dataKey="permitidos" stackId="a" fill="#4ade80" name="Permitidos" />
        <Bar dataKey="denegados" stackId="a" fill="#f87171" name="Denegados" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AccesosBarChart;