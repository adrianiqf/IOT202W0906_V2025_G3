<?php 
 session_start();// la sesion se esta manteniendo activa
 
 //$lista=$_SESSION['LISTA'];
 require_once '../../dao/AreaDao.php';
 require_once '../../util/ConexionBD.php';


 $objAreaDao=new AreaDao();
 $codigo="AR001";
 $info=$objAreaDao->infoArea($codigo);

foreach($info  as $reg  ){}
?>


<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Control de Accesos</title>
    <link rel="stylesheet" href="../../public/css/estilo_mapa.css">
    <link rel="stylesheet" href="../../public/css/estilo_horarios.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap">
    <!--API de mapbox-->
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js'></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://unpkg.com/@turf/turf@latest/turf.min.js"></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css' rel='stylesheet' />
    <!--Agregar BootStrap al proyecto (CSS)-->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous" />
    <!-- AWS SDK para DynamoDB -->
    <script src="https://sdk.amazonaws.com/js/aws-sdk-2.1057.0.min.js"></script>
    <style>
        /* Estilos para la ventana de ingresos */
        .ingresos-container {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 350px;
            z-index: 1000;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-family: 'Roboto', sans-serif;
        }
        
        .ingresos-header {
            background-color: #f3f3f3;
            padding: 10px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
            text-align: center;
        }
        
        .ingresos-scroll {
            max-height: 300px;
            overflow-y: auto;
            padding: 0;
        }
        
        .ingresos-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .ingresos-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 0.9em;
        }
        
        .ingresos-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
        
        .status-button {
            background-color: red;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 120px;
            font-size: 14px;
        }
        
        /* Colores para estados */
        .success-bg { background-color: #a3f7a3; }
        .warning-bg { background-color: #ffdb58; }
        .error-bg { background-color: #ff6961; }
    </style>
    <script>
        function redirigir_login() {
        window.location.href = "../controlador/usu_controlador.php?accion=navegar_a_login";
        }

        function mostrar_info() {
            <?php

            ?>

            //descomenta
            //ventanaEmergenteSalon.style.display = 'block';
            //botonMostrarHorario.style.display = 'none';
            
        }
    </script>
    <style>
        
    </style>
    <script>
        // Función para alternar la selección de los botones
        function toggleButton(buttonId) {
            var buttons = document.querySelectorAll(".toggle-button");
            buttons.forEach(function(button) {
                if (button.id === buttonId) {
                    button.classList.add("active"); // Selecciona el botón clicado
                } else {
                    button.classList.remove("active"); // Deselecciona los demás botones
                }
            });
        }

        function rutaClick() {
        var selectElementInicio=document.getElementById('inicio');
        var selectElementFin=document.getElementById('fin');

        var campo1 = selectElementInicio.value;
        var campo2 = selectElementFin.value;

        var pisoInicio = selectElementInicio.options[selectElementInicio.selectedIndex].getAttribute('data-piso');;
        var pisoFin = selectElementFin.options[selectElementFin.selectedIndex].getAttribute('data-piso');;
        
        //acá falta cambiar por mi ubicacion real
        if (campo1 == ''){
            campo1='a';
            pisoInicio='1';
        }

        if (campo1 == '999'){
            campo1='R2';
            pisoInicio='2';
        }

        console.log('Campo1:', campo1);
        console.log('Campo2:', campo2);

        console.log('Campo1:', pisoInicio);
        console.log('Campo2:', pisoFin);
        
        
        mostrarRuta(campo1, campo2, pisoInicio,pisoFin);
        toggleButton("button"+pisoInicio);
        
        //mostrarRuta('A', 'SA109-AP');

        /*
        var campo1 = document.getElementById('inicio').value;
    var selectElement = document.getElementById('fin');
    var campo2 = selectElement.value;

    // Obtén el atributo data-piso de la opción seleccionada
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    var piso = selectedOption.getAttribute('data-piso');

    console.log('Campo1:', campo1);
    console.log('Campo2:', campo2);
    console.log('Piso:', piso);
        */
        }

        
        
    </script>
    
</head>
<body>
<form name="form" method="post">
    <input type="hidden" name="op"/>
    <input type="hidden" name="codigoArea"/>
</form>

    <!--Parte superior de la página-->
    <header>
        <div id="cabecera">
            <img src="../../public/img/logo-fisi.png" alt="Logo de la FISI">
            <h3>Control de Accesos para la FISI</h3>
            <!--Aqui se guardan los datos-->


            <!--<button onclick="redirigir_login()"><img src="../../public/img/usuario.png" alt="imagen" >Acceder</button>-->   
        </div>
    </header>
        <!-- BÚSQUEDA-->
        <form class="buscador d-flex" role="search">
         <!--   <input id="txtSearch" class="form-control me-2" type="search" placeholder="¿A donde vamos?" aria-label="Search">-->
            <!-- <button id="btnSearch" class="btn btn-outline-success" type="submit">Buscar</button> -->
        </form>

        <!-- Lista para mostrar los resultados -->
        <ul id="searchResults">
            <!-- Aquí se agregarán los elementos coincidentes -->
        </ul>

    <div id="pantalla_mapa"  >
        

        <input type="hidden" name="op"/> <!--OPPPPPPPPP-->
        <!--Pantala principal del mapa-->

        <div class="botones" id="cambia_MapaHorario" style="display: none;">
            <button type="button">Ver Horario</button>

        </div>

     </div>

    
  
<!-- Zonas flotantes
<button class="toggle-button" id="button1" onclick="toggleLayer(1)">1</button>
-->    
  <div class="navegador">
  <button class="toggle-button active" id="button1" onclick="toggleButton('button1'), toggleLayer(1)">1</button>
    <button class="toggle-button" id="button2" onclick="toggleButton('button2'), toggleLayer(2)">2</button>
    <button class="toggle-button" id="button3" onclick="toggleButton('button3'), toggleLayer(3)">3</button>


    
    </div>
        
    

    <div id="ventanaEmergenteHorario" style="display: none;">
    <div class="ventana_horarios">
        <div class="cabecera">
            <h2 class="h2_horarios">HOJA DE HORARIOS</h2>
            <span class="cerrar" id="cerrarVentanaHorarioBtn">&times;</span>
     </div>
        
        <table class="tabla_horarios">
            <center>
            <tr>
                <td>Código</td>
                <td>Nombre</td>
                <td>Grupo</td>
                <td>Entrada</td>
                <td>Salida</td>
                <td>Modo</td>
                <td>Día</td>
                <td>Profesor</td>
                <td>Salón</td>
            </tr>
            <tr id="fila_horarios">
                <td>202W1003T</td>
                <td>PRÁCTICA PRE PROFESIONAL</td>
                <td>1</td>
                <td>14:00</td>
                <td>16:00</td>
                <td>TEO</td>
                <td>Sábado</td>
                <td>MURAKAMI DE LA CRUZ, SUMIKO ELIZABETH </td>
                <td>105</td>
            </tr>
            <tr id="fila_horarios">
                <td>202W0701T</td>
                <td>ARQUITECTURA DE SOFTWARE</td>
                <td>1</td>
                <td>8:00</td>
                <td>12:00</td>
                <td>TEO</td>
                <td>Sábado</td>
                <td>MENENDEZ MUERAS, ROSA </td>
                <td>102</td>
            </tr>
            <tr id="fila_horarios">
                <td>202W0705</td>
                <td>INTELIGENCIA ARTIFICIAL</td>
                <td>1</td>
                <td>14:00</td>
                <td>18:00</td>
                <td>TEO</td>
                <td>Lúnes</td>
                <td>GAMARRA MORENO, JUAN</td>
                <td>104</td>
            </tr>
            <tr id="fila_horarios">
                <td>202W0804</td>
                <td>MINERÍA DE DATOS</td>
                <td>2</td>
                <td>16:00</td>
                <td>22:00</td>
                <td>TEO</td>
                <td>Martes</td>
                <td>CALDERON VILCA, HUGO DAVID</td>
                <td>106</td>
            </tr>
            <tr id="fila_horarios">
                <td>202W0905</td>
                <td>GESTIÓN RIESGO DEL SW</td>
                <td>1</td>
                <td>16:00</td>
                <td>22:00</td>
                <td>TEO</td>
                <td>Viernes</td>
                <td>MACHADO VICENTE, JOEL FERNANDO</td>
                <td>209</td>
            </tr>
        <!-- Agrega más filas según sea necesario -->
        </table>
    </div>
    </div>


<!-- Contenido salones--> 
    <!-- Salón 105-->
    <div id="ventanaEmergenteSalon" class="ventana">
        <div class="contenido_ventana_salon">
            <span class="cerrar" id="cerrarSalonBtn">&times;</span>
            <img src="../../public/img/Salon1.png" alt="Imagen del salón" style="max-width: 100%; max-height: 80vh;">
            <div class="info_salon">

                <div id='mostrar_datos'></div>

            </div>
        </div>
    </div>

      
     <!--Vista de rutas-->
    <div id="ruta" style="display: none;">
        <div id=central>
            <button type="button"></button>
            <img src="" alt="imagen RUTA">
            <button type="button"></button>
        </div>
        <div id=aceptar>
            <button type="button" onclick="mostrarMapa()">Aceptar</button>
        </div>
        
    </div>

    <!-- Contenedor para la ventana de ingresos -->
    <div class="ingresos-container">
        <div class="ingresos-header">
            Registro de Ingresos
        </div>
        <div class="ingresos-scroll" id="tabla">
            <!-- Aquí se cargará dinámicamente la tabla de ingresos -->
        </div>
        <div class="ingresos-buttons">
            <button id="statusButton1" class="status-button">Puerta 1</button>
            <button id="statusButton2" class="status-button">Puerta 2</button>
        </div>
    </div>    

    <!--AGREGAR BOOTSTRAP (JSCRIPT)-->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
        crossorigin="anonymous"></script>
    <script src="../../public/js/mapa.js"></script>

    <script>
// Variables para botón 105
var botonAula105 = document.getElementById('mostrarInfo');
var ventanaEmergenteSalon = document.getElementById('ventanaEmergenteSalon');
var cerrarSalonBtn = document.getElementById('cerrarSalonBtn');
// Variables para botón 106
var botonAula106 = document.getElementById('mostrarInfo2');
var ventanaEmergenteSalon2 = document.getElementById('ventanaEmergenteSalon2');
var cerrarSalonBtn2 = document.getElementById('cerrarSalonBtn2');
// Variables para Vista Horario
var botonMostrarHorario = document.getElementById('cambia_MapaHorario');
var ventanaEmergenteHorario = document.getElementById('ventanaEmergenteHorario');
var cerrarVentanaHorarioBtn = document.getElementById('cerrarVentanaHorarioBtn');
// Función para ocultar ventana y mostrar botón
function ocultarVentanaYMostrarBoton(ventana, boton) {
    ventana.style.display = 'none';
    //boton.style.display = 'block';
}

// Agrega un evento de clic al botón de cierre de la ventana del salón 105
cerrarSalonBtn.addEventListener('click', function() {
    ocultarVentanaYMostrarBoton(ventanaEmergenteSalon, botonAula105);
    ocultarVentanaYMostrarBoton(ventanaEmergenteSalon, botonMostrarHorario);
    //botonAula105.style.borderWidth = '2px';
    //botonAula105.style.borderColor = 'black';
    //botonAula105.style.borderStyle = 'solid';
});


// Agrega un evento de clic al botón "Vista horario"
botonMostrarHorario.addEventListener('click', function() {
    ventanaEmergenteHorario.style.display = 'block';
    //botonMostrarHorario.style.display = 'none';
    //botonAula105.style.display = 'none';
    //botonAula106.style.display = 'none';
});
// Agrega un evento de clic al botón de cierre de la ventana de horario
cerrarVentanaHorarioBtn.addEventListener('click', function() {
    ventanaEmergenteHorario.style.display = 'none';
    //botonMostrarHorario.style.display = 'block';
    //botonAula105.style.display = 'block';
    //botonAula106.style.display = 'block';
});
</script>
</body>
<script type="text/javascript" src="../../public/js/mapa_config.js"></script>
<script type="text/javascript" src="../../public/js/dynamoDB.js"></script>
<script>
    function fetchData(doorValue) {
        $.ajax({
            url: "proxy.php",
            type: "POST",
            data: { door: doorValue },
            dataType: "json",
            success: function (data) {
                if (data.statusCode === 200) {
                    const records = JSON.parse(data.body);
                    const tableBody = $("#data-table tbody");
                    tableBody.empty(); // Limpiar tabla antes de agregar nuevos datos

                    records.forEach(item => {
                        const row = `
                            <tr>
                                <td>${item.usr}</td>
                                <td>${item.codigo_alumno}</td>
                                <td>${item.apellidos}</td>
                                <td>${item.nombres}</td>
                                <td>${item.carrera}</td>
                                <td>${item.fecha_creacion}</td>
                            </tr>
                        `;
                        tableBody.append(row);
                    });
                } else {
                    console.error("Error en la respuesta del servidor");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error en la solicitud:", error);
            }
        });
    }

    // Llamar a fetchData con un valor por defecto
    $(document).ready(function () {
        //fetchData(1); // Puedes cambiar el valor aquí

        // Si tienes un formulario o botón para cambiar el "door", puedes hacer algo así:
        $("#btnBuscar").click(function () {
            const doorValue = $("#doorInput").val();
            fetchData(doorValue);
        });
    });
</script>


</html>
<!--Prueba!>
