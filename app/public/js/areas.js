
function eliminarCookies() {
    document.cookie = 'recordar_usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'recordar_contrasena=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

function redirigir_cursos() {
window.location.href = "../controlador/curso_controlador.php?op=1";
}
function redirigir_areas() {
    window.location.href = "../controlador/area_Controlador.php?op=1";
}
function redirigir_login() {
window.location.href = "../controlador/usu_controlador.php?accion=navegar_a_login";

}
function cargarD(){
    window.location.href = "../controlador/curso_Controlador.php?op=5";
}
function abrirModal() {
var modal = document.getElementById('modalAgregarArea');
modal.style.display = 'block';
}
function cerrarModal() {
var modal = document.getElementById('modalAgregarArea');
modal.style.display = 'none';
}

function mostrarinfo()
{
window.location.href = "../controlador/curso_controlador.php?op=1";      

}

function abrirEditarA(button) {
var modal = document.getElementById('modalEditarArea');

// Obtener los valores de los atributos de datos del botón
var codigoArea = button.getAttribute('data-codigo-area');
var nombreArea = button.getAttribute('data-nombre-area');
var tipoArea = button.getAttribute('data-tipo-area');
var pabellonArea = button.getAttribute('data-pabellon-area');
var piso = button.getAttribute('data-piso');
var aforo = button.getAttribute('data-aforo');
var notas = button.getAttribute('data-notas');

// Rellenar los campos del modal con los valores
document.getElementById('campo1').value = codigoArea;
document.getElementById('campo2').value = aforo;
document.getElementById('campo3').value = nombreArea;
document.getElementById('campo4').value = tipoArea;
document.getElementById('campo5').value = pabellonArea;
document.getElementById('campo6').value = piso;
document.getElementById('campo7').value = notas;


modal.style.display = 'block';
}


function cerrarEditarA() {
var modal = document.getElementById('modalEditarArea');
modal.style.display = 'none';
}
