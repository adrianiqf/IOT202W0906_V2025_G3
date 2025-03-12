// src/utils/dataProcessing.js
  
  // Función para formatear fechas desde timestamps
  export const formatTimestamp = (timestamp) => {
    // El timestamp está en segundos, no en milisegundos
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };
  
  // Procesar datos de ingresos para cálculos estadísticos
  export const processIngresos = (ingresos) => {
    if (!ingresos || ingresos.length === 0) return {};
    
    // Total de accesos
    const totalAccesos = ingresos.length;
    
    // Accesos concedidos vs denegados - USAR COMPARACIÓN ESTRICTA
    const accesosExitosos = ingresos.filter(ing => ing.acceso === true).length;
    const accesosDenegados = ingresos.filter(ing => ing.acceso === false).length;
    
    console.log(`En processIngresos - Exitosos: ${accesosExitosos}, Denegados: ${accesosDenegados}`);
    
    // Datos para gráfico circular
    const accesosPorEstado = [
      { name: 'Concedidos', value: accesosExitosos, color: '#4CAF50' },
      { name: 'Denegados', value: accesosDenegados, color: '#F44336' },
    ];
    
    // Calcular distribución por dispositivo
    const deviceMap = new Map();
    
    ingresos.forEach(ing => {
      const device = ing.dispositivo;
      if (!deviceMap.has(device)) {
        deviceMap.set(device, { dispositivo: device, concedidos: 0, denegados: 0 });
      }
      
      const deviceData = deviceMap.get(device);
      if (ing.acceso) {
        deviceData.concedidos += 1;
      } else {
        deviceData.denegados += 1;
      }
    });
    
    const accesosPorDispositivo = Array.from(deviceMap.values());
    
    return {
      totalAccesos,
      accesosPorEstado,
      accesosPorDispositivo,
      tasaExito: (accesosExitosos / totalAccesos * 100).toFixed(1),
    };
  };
  

// Agrupar ingresos por hora (ajustado para Perú UTC-5)
export const groupIngresosByHour = (ingresos) => {
  const hourMap = new Map();
  
  // Ajuste para zona horaria de Perú (UTC-5): 5 horas en segundos
  const peruTimezoneOffset = 5 * 60 * 60; // 5 horas * 60 minutos * 60 segundos
  
  ingresos.forEach(ing => {
    // Añadimos 5 horas al timestamp para ajustarlo a hora de Perú
    const adjustedTimestamp = ing.fecha + peruTimezoneOffset;
    const date = new Date(adjustedTimestamp * 1000);
    const hour = date.getHours().toString().padStart(2, '0') + ":00";
    
    if (!hourMap.has(hour)) {
      hourMap.set(hour, { hora: hour, concedidos: 0, denegados: 0 });
    }
    
    const hourData = hourMap.get(hour);
    if (ing.acceso) {
      hourData.concedidos += 1;
    } else {
      hourData.denegados += 1;
    }
  });
  
  // Convertir a array y ordenar por hora
  return Array.from(hourMap.values())
    .sort((a, b) => a.hora.localeCompare(b.hora));
};

  // Función para filtrar ingresos por período
  export const filtrarIngresosPorPeriodo = (ingresos, periodo) => {
    const ahora = new Date();
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    
    return ingresos.filter(ingreso => {
      const fechaIngreso = new Date(ingreso.fecha * 1000);
      
      switch (periodo) {
        case 'hoy':
          return fechaIngreso >= hoy;
        
        case 'semana':
          const inicioSemana = new Date(hoy);
          inicioSemana.setDate(hoy.getDate() - hoy.getDay()); // Domingo como inicio de semana
          return fechaIngreso >= inicioSemana;
        
        case 'mes':
          const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
          return fechaIngreso >= inicioMes;
        
        default:
          return true; // Sin filtro
      }
    });
  };