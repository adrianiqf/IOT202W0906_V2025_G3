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
