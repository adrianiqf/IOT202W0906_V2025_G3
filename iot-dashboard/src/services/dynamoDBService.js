// src/services/dynamoDBService.js

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  ScanCommand
} from "@aws-sdk/lib-dynamodb";
import { awsConfig } from "../config/aws";
import { parseUsuario, parseTarjeta, calcularDiasRestantes } from "../utils/dynamoDBParsers";

// Inicializar el cliente de DynamoDB
const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);

// Función para obtener todos los registros de una tabla
export const getAllItems = async (tableName) => {
  try {
    const command = new ScanCommand({
      TableName: tableName,
    });
    
    const response = await docClient.send(command);
    return response.Items;
  } catch (error) {
    console.error(`Error fetching data from DynamoDB table ${tableName}:`, error);
    throw error;
  }
};

// Función para obtener y procesar los ingresos
export const getIngresos = async () => {
  try {
    // Obtener datos de DynamoDB
    const items = await getAllItems("ingresos");
    
    // Diagnóstico del primer item
    if (items.length > 0) {
      console.log("Ejemplo de item crudo:", items[0]);
      if (items[0].payload) {
        console.log("Ejemplo de payload parseado:", items[0].payload);
      }
    }
    
    // Procesamiento correcto basado en la estructura real
    const ingresos = items.map(item => {
      // El payload ya es un objeto, no necesitamos parsearlo
      const payload = item.payload;
      
      // Crear objeto de ingreso con la estructura correcta
      return {
        id: item.ing,
        // Usar los valores directamente del payload
        fecha: payload.fecha || 0,
        dispositivo: payload.dispositivo || '',
        detectado: payload.detectado || false,
        numero_tarjeta: payload.numero_tarjeta || '',
        acceso: payload.acceso || false,  // Extraer el booleano directamente
        usuario: 'Desconocido'
      };
    });
    
    // Verificar procesamiento
    console.log("Total de ingresos:", ingresos.length);
    console.log("Ingresos con acceso concedido:", ingresos.filter(i => i.acceso === true).length);
    console.log("Ingresos con acceso denegado:", ingresos.filter(i => i.acceso === false).length);
    
    if (ingresos.length > 0) {
      console.log("Ejemplo de ingreso procesado:", ingresos[0]);
    }
    
    return ingresos;
  } catch (error) {
    console.error("Error processing ingresos:", error);
    return [];
  }
};

// Función para obtener y procesar los usuarios
export const getUsuarios = async () => {
  try {
    const items = await getAllItems("usuarios");
    return items.map(parseUsuario);
  } catch (error) {
    console.error("Error processing usuarios:", error);
    return [];
  }
};

// Función para obtener y procesar las tarjetas
export const getTarjetas = async () => {
  try {
    const items = await getAllItems("tarjetas");
    return items.map(item => {
      const tarjeta = parseTarjeta(item);
      // Agregamos el cálculo de días restantes
      tarjeta.diasRestantes = calcularDiasRestantes(tarjeta.fecha_experiacion);
      return tarjeta;
    });
  } catch (error) {
    console.error("Error processing tarjetas:", error);
    return [];
  }
};

// Función para combinar los datos y enriquecer la información
export const getDataCompleta = async () => {
  try {
    // Obtener todos los datos
    const [ingresos, usuarios, tarjetas] = await Promise.all([
      getIngresos(),
      getUsuarios(),
      getTarjetas()
    ]);
    
    // Crear mapeos para búsqueda rápida
    const usuariosPorId = new Map(usuarios.map(u => [u.id, u]));
    
    // Mapeo de número de tarjeta a ID de usuario
    const tarjetaToUsuario = new Map(tarjetas.map(t => [t.numero_tarjeta, t.usr]));
    
    // Enriquecer ingresos con información de usuario
    const ingresosCompletos = ingresos.map(ingreso => {
      const usrId = tarjetaToUsuario.get(ingreso.numero_tarjeta);
      const usuario = usrId ? usuariosPorId.get(usrId) : null;
      
      return {
        ...ingreso,
        usuario: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Desconocido'
      };
    });
    
    // Enriquecer tarjetas con información de usuario
    const tarjetasCompletas = tarjetas.map(tarjeta => {
      const usuario = usuariosPorId.get(tarjeta.usr);
      
      return {
        ...tarjeta,
        usuario: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Desconocido'
      };
    });
    
    return {
      ingresos: ingresosCompletos,
      usuarios,
      tarjetas: tarjetasCompletas
    };
  } catch (error) {
    console.error("Error getting complete data:", error);
    return {
      ingresos: [],
      usuarios: [],
      tarjetas: []
    };
  }
};