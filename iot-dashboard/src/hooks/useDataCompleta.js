// src/hooks/useDataCompleta.js

import { useState, useEffect, useCallback } from 'react';
import { getDataCompleta } from '../services/dynamoDBService';
import { processIngresos, groupIngresosByHour } from '../utils/dataProcessing';

export const useDataCompleta = () => {
  const [data, setData] = useState({
    ingresos: [],
    usuarios: [],
    tarjetas: [],
    stats: {
      totalAccesos: 0,
      tasaExito: 0,
      totalUsuarios: 0,
      totalDispositivos: 0,
      accesosPorEstado: [],
      accesosPorDispositivo: [],
      accesosPorHora: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar los datos
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obtener los datos completos
      const result = await getDataCompleta();
      
      // Procesar estadísticas
      const processed = processIngresos(result.ingresos);
      const accesosPorHora = groupIngresosByHour(result.ingresos);
      
      // Actualizar el estado con todos los datos y estadísticas
      setData({
        ...result,
        stats: {
          ...processed,
          accesosPorHora,
          totalUsuarios: result.usuarios.length,
          totalDispositivos: new Set(result.ingresos.map(i => i.dispositivo)).size
        }
      });
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching complete data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...data, loading, error, refreshData: fetchData };
};