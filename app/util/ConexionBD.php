<?php

class ConexionBD
{
  const servidor="localhost";
  const usuario="root";
  const password="";
  const basedatos="mapafisi";
  public $cn=null;

  public function  getConexionBD()
  {
    try {
       
        $this->cn=mysqli_connect(self::servidor,self::usuario,self::password,self::basedatos);

      } catch (Exception  $e)
     {
     }
     return $this->cn;
  }
}

?>