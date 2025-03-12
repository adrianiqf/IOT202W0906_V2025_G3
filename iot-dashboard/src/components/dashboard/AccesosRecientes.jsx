import React from 'react';
import { formatTimestamp } from '../../utils/dataProcessing';

const AccesosRecientes = ({ ingresos }) => {
  // Función local para formatear timestamp con ajuste para Perú
  const formatTimestampPeru = (timestamp) => {
    // Añadimos 5 horas (18000 segundos) al timestamp
    const timestampPeru = timestamp + (5 * 60 * 60);
    return formatTimestamp(timestampPeru);
  };

  return (
    <div className="card">
      <h2 className="card-title">Accesos Recientes</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Usuario</th>
              <th>Dispositivo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ingresos
              .slice() // Creamos una copia para no mutar el array original
              .sort((a, b) => b.fecha - a.fecha) // Ordenamos por fecha descendente (más recientes primero)
              .slice(0, 5) // Tomamos solo los primeros 5 registros
              .map((ingreso) => (
                <tr key={ingreso.id}>
                  <td>{formatTimestampPeru(ingreso.fecha)}</td>
                  <td>{ingreso.usuario}</td>
                  <td>{ingreso.dispositivo}</td>
                  <td>
                    <span className={`badge ${ingreso.acceso ? 'badge-success' : 'badge-error'}`}>
                      {ingreso.acceso ? 'Concedido' : 'Denegado'}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccesosRecientes;