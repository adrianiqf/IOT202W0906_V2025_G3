// Configurar AWS SDK
AWS.config.update({
    accessKeyId: "AKIA57VDLZATXNLKTPOA",
    secretAccessKey: "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",
    region: "us-east-2"
});

var dynamoDB = new AWS.DynamoDB.DocumentClient();
var tableName = "ingresos";
var tarjetasTable = "tarjetas";
var usuariosTable = "usuarios";

let lastTimestamp = 0;
let colaInserciones = [];

// Función para convertir milisegundos a fecha legible
function convertirFecha(ms) {
    ms = ms * 1000
    let fecha = new Date(ms + (5 * 60 * 60 * 1000)); // UTC -5
    let dia = fecha.getDate().toString().padStart(2, "0");
    let mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    let anio = fecha.getFullYear();
    let horas = fecha.getHours().toString().padStart(2, "0");
    let minutos = fecha.getMinutes().toString().padStart(2, "0");
    let segundos = fecha.getSeconds().toString().padStart(2, "0");

    return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
}

// Buscar usuario en la tabla tarjetas
function obtenerUsuario(numeroTarjeta, callback) {
    var params = {
        TableName: tarjetasTable,
        FilterExpression: "numero_tarjeta = :num",
        ExpressionAttributeValues: { ":num": numeroTarjeta }
    };

    dynamoDB.scan(params, function(err, data) {
        if (err) {
            console.error("Error buscando en tabla tarjetas:", err);
            callback(null);
        } else {
            if (data.Items.length > 0) {
                // Obtenemos el usr de la tabla tarjetas
                let usr = data.Items[0].usr;
                
                // Ahora buscamos los datos completos en la tabla usuarios
                obtenerDatosUsuario(usr, function(datosUsuario) {
                    callback(datosUsuario);
                });
            } else {
                callback(null);
            }
        }
    });
}

// Buscar datos del usuario en la tabla usuarios
function obtenerDatosUsuario(usr, callback) {
    var params = {
        TableName: usuariosTable,
        FilterExpression: "usr = :usr",
        ExpressionAttributeValues: { ":usr": usr }
    };

    dynamoDB.scan(params, function(err, data) {
        if (err) {
            console.error("Error buscando en tabla usuarios:", err);
            callback({ usr: usr }); // Devolvemos al menos el usr si hay error
        } else {
            if (data.Items.length > 0) {
                // Extraemos todos los campos solicitados
                let usuario = {
                    usr: usr,
                    nombres: data.Items[0].nombres || "No disponible",
                    apellidos: data.Items[0].apellidos || "No disponible",
                    carrera: data.Items[0].carrera || "No disponible",
                    codigo_alumno: data.Items[0].codigo_alumno || "No disponible"
                };
                callback(usuario);
            } else {
                // Si no encontramos el usuario en la tabla usuarios, devolvemos solo el usr
                callback({ usr: usr });
            }
        }
    });
}

// Detectar nueva inserción y actualizar botones
// Modificación en la función detectarInserciones para cambiar también el color de los polígonos
function detectarInserciones() {
    var params = { TableName: tableName };

    dynamoDB.scan(params, function(err, data) {
        if (err) {
            console.error("Error obteniendo datos:", err);
        } else {
            if (data.Items.length === 0) return;

            let registrosOrdenados = data.Items
                .filter(item => item.payload && item.payload.fecha)
                .sort((a, b) => b.payload.fecha - a.payload.fecha);

            if (registrosOrdenados.length === 0) return;

            let nuevaInsercion = registrosOrdenados[0]; // Última inserción
            let nuevoTimestamp = nuevaInsercion.payload.fecha;

            if (nuevoTimestamp > lastTimestamp) {
                lastTimestamp = nuevoTimestamp;
                console.log("Nueva inserción detectada:", nuevaInsercion);
                
                // Seleccionar el botón según el dispositivo
                let dispositivo = nuevaInsercion.payload.dispositivo;
                let boton = dispositivo === "rfid1"
                    ? document.getElementById("statusButton1")
                    : document.getElementById("statusButton2");
                
                // Identificar qué polígono modificar
                let lineaId = dispositivo === "rfid1" ? "lineaRoja" : "lineaRoja2";

                // Verificar condiciones y cambiar color del botón y polígono
                if (!nuevaInsercion.payload.detectado && !nuevaInsercion.payload.acceso) {
                    boton.style.backgroundColor = "red"; // Mantener rojo si no detectado y no acceso
                    map.setPaintProperty(lineaId, 'line-color', '#FF0000'); // Rojo
                } else if (nuevaInsercion.payload.detectado && !nuevaInsercion.payload.acceso) {
                    boton.style.backgroundColor = "red"; // Mantener rojo si detectado y acceso denegado
                    map.setPaintProperty(lineaId, 'line-color', '#FF0000'); // Rojo
                } else {
                    boton.style.backgroundColor = "green"; // Cambiar a verde si acceso es permitido
                    map.setPaintProperty(lineaId, 'line-color', '#00FF00'); // Verde

                    // Volver a rojo después de 4 segundos (tanto botón como línea)
                    setTimeout(() => {
                        boton.style.backgroundColor = "red";
                        map.setPaintProperty(lineaId, 'line-color', '#FF0000'); // Rojo
                    }, 4000);
                }

                // El resto del código permanece igual...
                let payload = nuevaInsercion.payload;
                let numeroTarjeta = payload.numero_tarjeta;

                obtenerUsuario(numeroTarjeta, function(datosUsuario) {
                    // Clonar el payload para no modificar el original
                    let payloadConUsuario = {...payload};
                    
                    // Agregar los datos del usuario al payload
                    if (datosUsuario) {
                        payloadConUsuario.usr = datosUsuario.usr || "Desconocido";
                        payloadConUsuario.nombres = datosUsuario.nombres || "No disponible";
                        payloadConUsuario.apellidos = datosUsuario.apellidos || "No disponible";
                        payloadConUsuario.carrera = datosUsuario.carrera || "No disponible";
                        payloadConUsuario.codigo_alumno = datosUsuario.codigo_alumno || "No disponible";
                    } else {
                        payloadConUsuario.usr = "Desconocido";
                        payloadConUsuario.nombres = "No disponible";
                        payloadConUsuario.apellidos = "No disponible";
                        payloadConUsuario.carrera = "No disponible";
                        payloadConUsuario.codigo_alumno = "No disponible";
                    }
                    
                    // Agregar al inicio de la cola
                    colaInserciones.unshift(payloadConUsuario);
                    
                    // Actualizar la tabla
                    actualizarTabla();
                    
                    // Eliminar la inserción después de 20 segundos
                    setTimeout(() => {
                        colaInserciones.pop();
                        actualizarTabla();
                    }, 60000);
                });
            }
        }
    });
}
// Actualizar la tabla con los elementos en la cola
function actualizarTabla() {
    let tablaHTML = "<table class='ingresos-table'>";

    colaInserciones.forEach(payload => {
        let colorFondo = "#ffffff"; // Blanco por defecto
        let nombrePuerta = payload.dispositivo === "rfid1" ? "Puerta 1" : payload.dispositivo === "rfid2" ? "Puerta 2" : "Desconocido";

        // Enmascarar el número de tarjeta, dejando visibles solo los últimos 3 dígitos
        let numeroTarjeta = payload.numero_tarjeta;
        let numeroTarjetaOculto = numeroTarjeta.length > 3 
            ? "*".repeat(numeroTarjeta.length - 3) + numeroTarjeta.slice(-3) 
            : numeroTarjeta; 

        let contenido = `  
            <strong>Fecha:</strong> ${convertirFecha(payload.fecha)}<br>
            <strong>${nombrePuerta}</strong><br>
            <strong>Número de tarjeta:</strong> ${numeroTarjetaOculto}<br>
            <strong>Nombres:</strong> ${payload.nombres || "N/A"}<br>
            <strong>Apellidos:</strong> ${payload.apellidos || "N/A"}<br>
            <strong>Carrera:</strong> ${payload.carrera || "N/A"}<br>
            <strong>Código de alumno:</strong> ${payload.codigo_alumno || "N/A"}
        `;

        if (payload.detectado && payload.acceso) {
            colorFondo = "#a3f7a3"; // Verde fuerte
        } else if (!payload.detectado && payload.acceso) {
            colorFondo = "#ffdb58"; // Amarillo fuerte
            contenido = "<strong>ERROR: La persona no ingresó</strong>";
        } else if (payload.detectado && !payload.acceso) {
            colorFondo = "#ff6961"; // Rojo fuerte
            contenido = "<strong>ERROR: La tarjeta no está registrada en el sistema (" + nombrePuerta + ")</strong>";
            //contenido = "<strong>ALERTA: Se ha detectado un acceso no autorizado</strong>";
        } else if (!payload.detectado && !payload.acceso) {
            colorFondo = "#ff6961"; // Rojo fuerte
            contenido = "<strong>ERROR: La tarjeta no está registrada en el sistema (" + nombrePuerta + ")</strong>";
        }

        tablaHTML += `<tr style="background-color: ${colorFondo};"><td>${contenido}</td></tr>`;
    });

    tablaHTML += "</table>";
    document.getElementById("tabla").innerHTML = tablaHTML;
}

// Llamar la detección de inserciones en intervalos regulares
setInterval(detectarInserciones, 2000);
