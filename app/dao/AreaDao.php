<?php
//require "../util/ConexionBD.php";
//require '../bean/AreaBean.php';

class AreaDao
{
    public  function  ListarAreas()
    {
      try {

         $sql = "select * from area WHERE estado = 'A'";
         $objc = new ConexionBD();
         $cn = $objc->getConexionBD();
         $rs = mysqli_query($cn, $sql);
 
         $lista = array();
         while ($fila = mysqli_fetch_assoc($rs)) {
             $lista[] = $fila;
         }
         mysqli_close($cn);
     } catch (Exception $cn) {
         // Manejo de errores
     }
     return $lista;

    }

    public function EliminarAreas($codArea)
   {
          $objc = new ConexionBD();
         $cn = $objc->getConexionBD();

         $sql = "UPDATE area SET estado = 'B'
                  WHERE codigo_area = '$codArea'";

         $res = mysqli_query($cn, $sql);

      mysqli_close($cn);

    return $res;
    }

    public  function  EditarAreas($objAreaBean)
    {
         // Obtiene los valores del objeto AreaBean
        $codArea = $objAreaBean->getCodArea();
        $nombArea = $objAreaBean->getNombArea();
        $tipoArea = $objAreaBean->getTipoArea();
        $pabellonArea = $objAreaBean->getPabellonArea();
        $piso = $objAreaBean->getPiso();
        $aforo = $objAreaBean->getAforo();
        $notas = $objAreaBean->getNotas();

        // Utiliza la instancia de ConexionBD que ya tienes
        $objc = new ConexionBD();
        $cn = $objc->getConexionBD();

        // Construye y ejecuta la consulta SQL para actualizar el curso en la base de datos
        $sql = "UPDATE area 
                SET nombre = '$nombArea', tipo = '$tipoArea', pabellon = '$pabellonArea', 
                piso = '$piso', aforo = '$aforo', notas = '$notas' 
                WHERE codigo_area = '$codArea'";
    
        // Ejecuta la consulta SQL
        $res = mysqli_query($cn, $sql);
        
        // Cierra la conexión
        mysqli_close($cn);
        // Devuelve el resultado de la ejecución (true o false, por ejemplo)
        return $res;
    }


    public function AgregarAreas($objAreaBean)
    {
        // Obtiene los valores del objeto AreaBean
        $codArea = $objAreaBean->getCodArea();
        $nombArea = $objAreaBean->getNombArea();
        $tipoArea = $objAreaBean->getTipoArea();
        $pabellonArea = $objAreaBean->getPabellonArea();
        $piso = $objAreaBean->getPiso();
        $aforo = $objAreaBean->getAforo();
        $notas = $objAreaBean->getNotas();
        // Utiliza la instancia de ConexionBD que ya tienes
        $objc = new ConexionBD();
        $cn = $objc->getConexionBD();
        // Construye y ejecuta la consulta SQL para insertar el área en la base de datos
        $sql = "INSERT INTO area (codigo_area, nombre, tipo, pabellon, piso, aforo, notas) 
                VALUES ('$codArea', '$nombArea', '$tipoArea', '$pabellonArea', '$piso', '$aforo', '$notas')";
    
        // Ejecuta la consulta SQL
        $res = mysqli_query($cn, $sql);
        
        $sql = "UPDATE area SET estado = 'A'
        WHERE codigo_area = '$codArea'";
        
         $res = mysqli_query($cn, $sql);

        // Cierra la conexión
        mysqli_close($cn);
        // Devuelve el resultado de la ejecución (true o false, por ejemplo)
        return $res;
    }

    public  function  ListarPersonas()
    {
       try {

       $sql="select *   from   area where codigo_area='SA105'";

        $objc=new ConexionBD();
        $cn= $objc->getConexionBD();
       $rs= mysqli_query($cn,$sql);

       $lista=array();
       while($fila=mysqli_fetch_assoc($rs))
       {
          $lista[]=$fila;

       }
       mysqli_close($cn);
        
       } catch (Exception   $cn) {
        
       }
       return $lista;
    }


    public  function  infoArea($codigo)
    {
       try {
       $sql="select *   from   area where codigo_area='$codigo'";
        $objc=new ConexionBD();
        $cn= $objc->getConexionBD();
       $rs= mysqli_query($cn,$sql);

       $lista=array();
       while($fila=mysqli_fetch_assoc($rs))
       {
          $lista[]=$fila;

       }
       mysqli_close($cn);
        
       } catch (Exception   $cn) {
        
       }
       return $lista;
    }
    //Devuelve una lista con los cursos que se realizan en un area especifica
    public  function  cursosArea($codigo)
    {
       try {
       $sql="select *   from   curso where codigo_area='$codigo' AND estado='A'";
        $objc=new ConexionBD();
        $cn= $objc->getConexionBD();
       $rs= mysqli_query($cn,$sql);

       $lista=array();
       while($fila=mysqli_fetch_assoc($rs))
       {
          $lista[]=$fila;

       }
       mysqli_close($cn);
        
       } catch (Exception   $cn) {
        
       }
       return $lista;
    }
}


?>
