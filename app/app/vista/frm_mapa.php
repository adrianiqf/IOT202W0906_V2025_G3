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


            <button onclick="redirigir_login()"><img src="../../public/img/usuario.png" alt="imagen" >Acceder</button>   
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
