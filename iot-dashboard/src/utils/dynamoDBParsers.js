// src/utils/dynamoDBParsers.js

// Función para parsear el payload JSON de la tabla de ingresos
export const parseIngresoPayload = (rawIngreso) => {
  if (!rawIngreso) return null;
  
  try {
    // Caso 1: El formato es { ing: "...", payload: "{...}" }
    if (rawIngreso.ing && rawIngreso.payload) {
      let payload;
      
      // Si el payload es un string, lo parseamos
      if (typeof rawIngreso.payload === 'string') {
        try {
          payload = JSON.parse(rawIngreso.payload);
        } catch (e) {
          console.error("Error parsing payload string:", e);
          return null;
        }
      } else {
        payload = rawIngreso.payload;
      }
      
      // SOLUCIÓN CORREGIDA: Extraer el valor booleano correctamente
      // El formato es: acceso: { BOOL: true/false }
      const accesoValue = payload.acceso && payload.acceso.BOOL === true;
      
      return {
        id: rawIngreso.ing,
        fecha: payload.fecha?.N ? Number(payload.fecha.N) : 0,
        dispositivo: payload.dispositivo?.S || '',
        detectado: payload.detectado?.BOOL || false,
        numero_tarjeta: payload.numero_tarjeta?.S || '',
        acceso: accesoValue,  // Aquí aplicamos la corrección
        usuario: 'Desconocido'
      };
    }
    
    // Caso 2: El formato es directo desde DynamoDB con atributos tipados
    if (rawIngreso.fecha && (rawIngreso.fecha.N || typeof rawIngreso.fecha === 'number')) {
      // SOLUCIÓN CORREGIDA: El mismo enfoque para objetos directos
      const accesoValue = rawIngreso.acceso && rawIngreso.acceso.BOOL === true;
      
      return {
        id: rawIngreso.ing || rawIngreso.id || '',
        fecha: rawIngreso.fecha.N ? Number(rawIngreso.fecha.N) : 
              (typeof rawIngreso.fecha === 'number' ? rawIngreso.fecha : 0),
        dispositivo: rawIngreso.dispositivo?.S || rawIngreso.dispositivo || '',
        detectado: rawIngreso.detectado?.BOOL || rawIngreso.detectado || false,
        numero_tarjeta: rawIngreso.numero_tarjeta?.S || rawIngreso.numero_tarjeta || '',
        acceso: accesoValue,  // Aquí aplicamos la corrección
        usuario: 'Desconocido'
      };
    }
    
    // Si llegamos aquí, el formato no es reconocido
    console.error("Formato de ingreso no reconocido:", rawIngreso);
    return null;
    
  } catch (error) {
    console.error("Error parsing ingreso:", error, rawIngreso);
    return null;
  }
};

// Función para procesar datos de usuarios
export const parseUsuario = (rawUsuario) => {
  return {
    id: rawUsuario.usr,
    nombres: rawUsuario.nombres || '',
    apellidos: rawUsuario.apellidos || '',
    nombreCompleto: `${rawUsuario.nombres || ''} ${rawUsuario.apellidos || ''}`.trim(),
    carrera: rawUsuario.carrera || '',
    codigo_alumno: rawUsuario.codigo_alumno || '',
    eliminado: rawUsuario.eliminado === 'true',
    fecha_creacion: rawUsuario.fecha_creacion || ''
  };
};

// Función para procesar datos de tarjetas
export const parseTarjeta = (rawTarjeta) => {
  return {
    id: rawTarjeta.card,
    numero_tarjeta: rawTarjeta.numero_tarjeta || '',
    activo: rawTarjeta.activo === 'true',
    usr: rawTarjeta.usr || '',
    fecha_creacion: rawTarjeta.fecha_creacion || '',
    fecha_experiacion: rawTarjeta.fecha_experiacion || ''
  };
};

// Función para calcular días restantes hasta la expiración
export const calcularDiasRestantes = (fechaExpiracion) => {
  if (!fechaExpiracion) return 0;
  
  const hoy = new Date();
  const expiracion = new Date(fechaExpiracion);
  const diferencia = expiracion - hoy;
  
  // Convertir de milisegundos a días
  return Math.max(0, Math.floor(diferencia / (1000 * 60 * 60 * 24)));
};