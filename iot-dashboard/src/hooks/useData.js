// src/hooks/useData.js

import { useState, useEffect } from 'react';
import { getIngresos, getUsuarios, getTarjetas } from '../services/dynamoDBService';

// Hook para cargar datos
export const useData = (dataType) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let result;
        
        // Determinar qué tipo de datos cargar
        switch(dataType) {
          case 'ingresos':
            result = await getIngresos();
            break;
          case 'usuarios':
            result = await getUsuarios();
            break;
          case 'tarjetas':
            result = await getTarjetas();
            break;
          default:
            result = [];
        }
        
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error(`Error fetching ${dataType}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataType]);

  return { data, loading, error };
};