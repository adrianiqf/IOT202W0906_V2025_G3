import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAccesos, fetchIngresos } from '../services/dynamoDbService';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('principal');
  const [accesosData, setAccesosData] = useState([]);
  const [ingresosData, setIngresosData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const accesos = await fetchAccesos();
        const ingresos = await fetchIngresos();
        
        setAccesosData(accesos);
        setIngresosData(ingresos);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  return (
    <DashboardContext.Provider value={{
      activeTab,
      setActiveTab,
      accesosData,
      ingresosData,
      isLoading
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);