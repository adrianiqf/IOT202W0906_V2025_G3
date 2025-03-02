<?php
 require_once '../../dao/AreaDao.php';
 require_once '../../util/ConexionBD.php';
 $codigo=$_POST['codigo'];



$objAreaDao=new AreaDao();
$lista=$objAreaDao->infoArea($codigo);

$cursos=$objAreaDao->cursosArea($codigo);

foreach($lista  as $reg  ){}

echo '<p class="cabecera_salon">'.$reg['nombre'].'</p>';


    echo   '
            <u><b>DETALLES:</b></u><br>
            <table class="table table_bordered">
            <tr>
            <td style="width: 30%;background-color: #68141C; color: white;">
            Ubicación:</td><td>Pabellón:  '.$reg['pabellon'].' - '.$reg['piso'].'° piso</td>
            </tr>
            <tr>
            <td style="width: 30%;background-color: #68141C; color: white;">
            Aforo:</td><td>'.$reg['aforo'].' personas</td>
            </tr>
            </table>
            <td><u><b>CURSOS:</b></u></td>';

    if($cursos!=null){
        foreach($cursos as $reg2){
        echo 
       '<table class="table table_bordered">
        <tr><td style="width: 30%;background-color: #68141C; color: white;">
        '.$reg2['codigo_curso'].'</td><td>'.$reg2['nombre'].' - '.$reg2['modo'].' - G'.$reg2['grupo'].'</td></tr>
        <tr><td style="background-color: #68141C; color: white;">
        Docente:</td><td>'.$reg2['profesor_ape'].', '.$reg2['profesor_nomb'].'</td></tr>
        <tr><td style="background-color: #68141C; color: white;">
        Fecha:</td><td>'.$reg2['dia'].' - '.$reg2['hora_entrada'].' - '.$reg2['hora_salida'].'</td></tr>
        <br></table>';
        }
        //echo $reg2['hora_entrada']." ".$reg2['nombre'];
    }else{
        echo "NO SE REALIZA NINGUN CURSO EN ESTA AREA.";
    }
    

?>

