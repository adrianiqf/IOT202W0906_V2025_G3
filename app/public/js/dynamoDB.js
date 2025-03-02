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
