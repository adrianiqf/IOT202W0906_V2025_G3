<?php
require_once '../util/ConexionBD.php';

// Ingreso a la plataforma

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST["usuario"];
    $contrasena = $_POST["contrasena"];

    $conexionBD = new ConexionBD();
    $cn = $conexionBD->getConexionBD();

    if (validarUsuario($cn, $usuario, $contrasena)) {
        session_start();
        $_SESSION["usuario"] = $usuario;

        // Comprobar si la casilla de verificación "recordar" está marcada
        if (isset($_POST['recordar']) && $_POST['recordar'] == 'on') {
            // Crear cookies para recordar la cuenta del usuario y la contraseña
            $expire = time() + 60 * 24 * 60 * 60; // Por ejemplo, 60 días
            setcookie('recordar_usuario', $usuario, $expire, '/');
            setcookie('recordar_contrasena', $contrasena, $expire, '/');
        }
        // Permitir el acceso al sistema
        //window.location.href = "../controlador/curso_controlador.php?op=1";
        //header("Location: ../app/controlador/usu_controlador.php?accion=navegar_a_cursos");
        header("Location: ../app/controlador/curso_controlador.php?op=1");


    } else {
        // Si no son correctas las credenciales mandar un alert
        echo "<script>alert('Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.');
              window.location.href = '../app/vista/frm_login.php';</script>";
        exit;
    }
}
