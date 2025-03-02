DROP DATABASE IF EXISTS mapafisi;
CREATE DATABASE  mapafisi;
USE  mapafisi;
CREATE TABLE `area` (
  `codigo_area` varchar(30) NOT NULL PRIMARY KEY,
  `nombre` varchar(60) DEFAULT NULL,
  `tipo` CHARACTER DEFAULT NULL,
  `pabellon` varchar(30) DEFAULT NULL,
  `piso` int(11) DEFAULT NULL,
  `aforo` int(11) DEFAULT NULL,
  `notas` varchar(60) DEFAULT NULL,
  `estado` CHARACTER NOT NULL  
); 

CREATE TABLE `curso` (
  `id_curso` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo_curso` varchar(30) NOT NULL,
  `nombre` varchar(60) DEFAULT NULL,
  `grupo` int(11) DEFAULT NULL,
  `hora_entrada` TIME DEFAULT NULL,
  `hora_salida` TIME DEFAULT NULL,
  `modo` varchar(30) DEFAULT NULL,
  `dia` varchar(30) DEFAULT NULL,
  `profesor_ape` varchar(30) DEFAULT NULL,
  `profesor_nomb` varchar(30) DEFAULT NULL,
  `matriculados` int(11) DEFAULT NULL,
  `estado` CHARACTER NOT NULL,
  `codigo_area` varchar(30) DEFAULT NULL,
   FOREIGN KEY (`codigo_area`) REFERENCES `area`(`codigo_area`)
); 

CREATE TABLE usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
	usuario VARCHAR(30) NOT NULL, 
    contrasena VARCHAR(30) NOT NULL
);

-- Areas del primer piso
INSERT INTO `area` (`codigo_area`, `nombre`, `tipo`,`pabellon`,`piso`,`aforo`,`notas`,`estado`) VALUES
('SA101-AP', 'SALON 101', 'S','ANT',1,20,'Salon 101 - Antiguo Pabellon','A'),
('SA102-AP', 'SALON 102', 'S','ANT',1,20,'Salon 102 - Antiguo Pabellon','A'),
('SA103-AP', 'SALON 103', 'S','ANT',1,30,'Salon 103 - Antiguo Pabellon','A'),
('LA011', '110 LABORATORIO 11', 'L','ANT',1,40,'Laboratorio 11 (110)','A'),
('SA105-AP', 'SALON 105', 'S','ANT',1,20,'Salon 105 - Antiguo Pabellon','A'),
('SA106-AP', 'SALON 106', 'S','ANT',1,40,'Salon 106 - Antiguo Pabellon','A'),
('SA107-AP', 'SALON 107', 'S','ANT',1,50,'Salon 107 - Antiguo Pabellon','A'),
('SA108-AP', 'SALON 108', 'S','ANT',1,50,'Salon 108 - Antiguo Pabellon','A'),
('SA109-AP', 'SALON 109', 'S','ANT',1,30,'Salon 109 - Antiguo Pabellon','A'),
('LA008', '104 LABORATORIO 8', 'L','ANT',1,40,'Laboratorio 8 (104)','A'),
('SA101-NP', 'SALON 101', 'S','NUEVO',1,20,'Salon 101 - Nuevo Pabellon','A'),
('SA102-NP', 'SALON 102', 'S','NUEVO',1,20,'Salon 102 - Nuevo Pabellon','A'),
('SA103-NP', 'SALON 103', 'S','NUEVO',1,30,'Salon 103 - Nuevo Pabellon','A'),
('SGDFG', 'SISTEMA DE GESTIÓN DOCUMENTAL Y FIRMA DIGITAL', 'O','ANT',1,40,'Oficina de Sistema de Gestión Documental (104)','A'),
('SA105-NP', 'SALON 105', 'S','NUEVO',1,20,'Salon 105 - Nuevo Pabellon','A'),
('SA106-NP', 'SALON 106', 'S','NUEVO',1,40,'Salon 106 - Nuevo Pabellon','A'),
('SA107-NP', 'SALON 107', 'S','NUEVO',1,50,'Salon 107 - Nuevo Pabellon','A'),
('SA108-NP', 'SALON 108', 'S','NUEVO',1,50,'Salon 108 - Nuevo Pabellon','A'),
('SA109-NP', 'SALON 109', 'S','NUEVO',1,30,'Salon 109 - Nuevo Pabellon','A'),
('USGOM', 'UNIDAD DE SERVICIOS DE OPERACIONES Y MANTENIMIENTO', 'O','ANT',1,4,'','A'),
('DACC', 'DEPARTAMENTO ACADEMICO DE CIENCIAS DE LA COMPUTACIÓN', 'O','ANT',1,4,'','A'),
('OCA', 'OFICINA DE CALIDAD ACADÉMICA', 'O','ANT',1,4,'','A'),
('CERSEU', 'CERSEU', 'O','ANT',1,4,'','A'),
('DAD', 'DIRECCIÓN ADMINISTRATIVA', 'O','ANT',1,4,'','A'),
('UTD', 'UNIDAD DE TRÁMITE DOCUMENTARIO', 'O','ANT',1,4,'','A'),
('UDE', 'UNIDAD DE ECONOMÍA', 'O','ANT',1,4,'','A'),
('BTC', 'BIBLIOTECA', 'O','ANT',1,40,'Biblioteca de la Facultad','A'),
('GYM', 'GIMNASIO', 'O','ANT',1,20,'Gimnasio de la Facultad','A'),
('AUD', 'AUDITORIO', 'O','ANT',1,50,'Auditorio de la Facultad','A'),
('CAP', 'CAPILLA', 'O','ANT',1,20,'Capilla de la Facultad','A'),
('ASC', 'ASCENSOR', '-','NUEVO',1,3,'Ascensor de la Fisi','A'),
('CAN', 'CANCHITA', 'O','OTRO',1,60,'Canchita FISI','A'),
('CCE', 'Cuarto de Control Eléctrico', '-',' ',1,3,'Peligro Eléctrico','A'),
('SSHH-P1', 'BAÑOS PISO 1', 'O','',1,15,'Baños de Primera planta','A'),

-- Areas del segundo piso
('SA201-AP', 'SALON 201', 'S','ANT',2,30,'Salon 201 - Antiguo Pabellon','A'),
('SA202-AP', 'SALON 202', 'S','ANT',2,30,'Salon 202 - Antiguo Pabellon','A'),
('SA203-AP', 'SALON 203', 'S','ANT',2,30,'Salon 202 - Antiguo Pabellon','A'),
('SA204-AP', 'SALON 204', 'S','ANT',2,30,'Salon 204 - Antiguo Pabellon','A'),
('SA205-AP', 'SALON 205', 'S','ANT',2,20,'Salon 205 - Antiguo Pabellon','A'),
('SA206-AP', 'SALON 206', 'S','ANT',2,40,'Salon 206 - Antiguo Pabellon','A'),
('SA207-AP', 'SALON 207', 'S','ANT',2,50,'Salon 207 - Antiguo Pabellon','A'),
('SA209-AP', 'SALON 209', 'S','ANT',2,30,'Salon 209 - Antiguo Pabellon','A'),
('SA210-AP', 'SALON 210', 'S','ANT',2,30,'Salon 210 - Antiguo Pabellon','A'),
('SA211-AP', 'SALON 211', 'S','ANT',2,30,'Salon 211 - Antiguo Pabellon','A'),
('SA212-AP', 'SALON 212', 'S','ANT',2,30,'Salon 210 - Antiguo Pabellon','A'),
('SA213-AP', 'SALON 211', 'S','ANT',2,30,'Salon 211 - Antiguo Pabellon','A'),

('LA110', 'LABORATORIO 10', 'L','ANT',2,40,'Laboratorio 10 (110)','A'),
('AM', 'AULA MAGNA', 'S','ANT',2,40,'Aula Magna(208)','A'),
('TE', 'TERCIO', 'O','ANT',2,20,'Tercio Estudiantil','A'),
('ODG', 'OFICINA DE DIGITALIZACION', 'O','ANT',2,10,'Oficina de Digitalizacion','A'),
('OCAA', 'OFICINA DE CALIDAD ACADEMICA Y ACREDITACION', 'O','ANT',2,10,'Oficina de calidad academica y acreditacion','A'),
('UPPN', 'OFICINA DE PLANIFICACION Y PRESUPUESTO', 'O','ANT',2,10,'Oficina de planificacion y presupuesto','A'),
('UP', 'UNIDAD DE PUBLICACIONES', 'O','ANT',2,10,'Unidad de Publicaciones','A'),
('SC', 'SALON CATEDRATICO', 'O','ANT',2,10,'Salon de Catedraticos','A'),
('GI', 'GRUPO DE INVESTIGACION', 'L','ANT',2,30,'Grupo de investigacion (laboratorio)','A'),
('DEC', 'DECANATO', 'O','ANT',2,10,'Decanato','A'),
('SSHH-AD-2', 'BAÑOS ADMINISTRACION', 'O','ANT',2,10,'Baños de administracion','A'),
('SSHH-P2', 'BAÑOS PISO 2', 'O','',2,15,'Baños de segunda planta','A'),
('COM', 'COMEDOR FACULTAD', 'S','ANT',2,20,'Comedor de la facultad','A'),

('LA001', '207 LABORATORIO 1 ', 'L','NUE',2,30,'Laboratorio (207) - Nuevo Pabellon','A'),
('LA002', '208 LABORATORIO 2', 'L','NUE',2,30,'Laboratorio (208) - Nuevo Pabellon','A'),
('LA003', 'LABORATORIO 3 ', 'L','NUE',2,30,'Laboratorio  - Nuevo Pabellon','A'),
('LA004', 'LABORATORIO 4 ', 'L','NUE',2,30,'Laboratorio  - Nuevo Pabellon','A'),
('LA005', 'LABORATORIO 5 ', 'L','NUE',2,30,'Laboratorio  - Nuevo Pabellon','A'),
('LA006', 'LABORATORIO 6 ', 'L','NUE',2,30,'Laboratorio  - Nuevo Pabellon','A'),
('SA201-NP', 'SALON 201', 'S','NUE',2,30,'Aula Posgrado - Nuevo Pabellon','A'),
('SA202-NP', 'SALON 202', 'S','NUE',2,30,'Sala de estudio 202 - Nuevo Pabellon','A'),
('SA203-NP', 'SALON 203', 'S','NUE',2,30,'Aula Posgrado - Nuevo Pabellon','A'),
('SA204-NP', 'SALON 204', 'S','NUE',2,30,'Sala de estudio 204 - Nuevo Pabellon','A'),
('SA205-NP', 'SALON 205', 'S','NUE',2,30,'Salon 205 - Nuevo Pabellon','A'),
('DTC', 'DATA CENTER', 'O','NUE',2,10,'Data Center (206)','A'),

-- AREAS DEL TERCER PISO
('LA304-AP', '304 LABORATORIO 1', 'L','ANT',3,30,'Laboratorio 1 (304)','A'),
('LA305-AP', '305 LABORATORIO 2', 'L','ANT',3,30,'Laboratorio 2 (305)','A'),
('LA306-AP', '306 LABORATORIO 3', 'L','ANT',3,30,'Laboratorio 3 (306)','A'),
('LA307-AP', '307 LABORATORIO 4-CENPRO', 'L','ANT',3,30,'Laboratorio 4 (307)','A'),
('LA308-AP', '308 LABORATORIO 5', 'L','ANT',3,30,'Laboratorio 5 (308)','A'),
('SA310-AP', '310 SALON 310', 'S','ANT',3,20,'Salon 311 - AP','A'),
('SA311-AP', 'SALON 311', 'S','ANT',3,20,'Salon 311 - AP','A'),
('SA309-AP', '309 Soporte tecnico', 'S','ANT',3,20,'Soporte técnico','A'),
('SA302-AP', 'SALON 302', 'S','ANT',3,20,'Laboratorio 6','A'),
('LA301-AP', '301 LABORATORIO 7', 'L','ANT',3,30,'Laboratorio 7 (301)','A'),
('LA303-AP', '303 LABORATORIO IoT', 'L','ANT',3,25,'Laboratorio de robotica e IoT','A'),
('SSHH-D-AP3', 'BAÑOS PARA DOCENTES', 'O','ANT',3,5,'Baños para docentes tercera planta','A'),
('OF309', 'ESCUELA ACADEMICA SISTEMAS', 'O','ANT',3,8,'Escuela academica profesional de Ingenieria de Sistemas','A'),
('OF311', 'ESCUELA ACADEMICA SOFTWARE', 'O','ANT',3,8,'Escuela academica profesional de Ingenieria de Software','A'),
('SSHH-P3', 'BAÑOS PISO 3', 'O','',3,15,'Baños tercera planta','A'),
('SA-CA', 'SALON DE CATEDRATICOS', 'O','ANT',3,25,'Salon de juntas de catedraticos','A'),
('UN-MA', 'UNIDAD DE MATRICULA', 'O','ANT',3,10,'Unidad de Matricula','A'),
('UN-PO', 'UNIDAD DE POSGRADO', 'O','ANT',3,50,'Unidad de Posgrado','A'),

('SA302-NP', 'SALON 302', 'S','NUE',3,30,'Salon 302 - Nuevo Pabellon','A'),
('SA301-NP', 'SALON DE MUSICA (301)', 'O','NUE',3,40,'Salon de musica - Nuevo Pabellon','A'),
('LA303-NP', '303 LABORATORIO 4', 'L','NUE',3,30,'Laboratorio 4 (303)','A'),
('LA304-NP', '304 LABORATORIO 5', 'L','NUE',3,30,'Laboratorio 5 (304)','A'),
('LA305-NP', '305 LABORATORIO 6', 'L','NUE',3,30,'Laboratorio 6 (305)','A'),
('LA306-NP', '306 LABORATORIO 7', 'L','NUE',3,30,'Laboratorio 7 (306)','A'),
('LA307-NP', '307 LABORATORIO 8', 'L','NUE',3,30,'Laboratorio 8 (307)','A');

-- Cursos del primer piso
INSERT INTO `curso` (`codigo_curso`, `nombre`, `grupo`,`hora_entrada`,`hora_salida`,`modo`,`dia`,`profesor_ape`,`profesor_nomb`,`matriculados`,`estado`,`codigo_area`) VALUES
('202W0701', 'ARQUITECTURA DE SOFTWARE',1,'14:00:00','16:00:00','TEO','Viernes','MENÉNDEZ MUERAS','ROSA','30','A','SA101-AP'),
('202W0702', 'BASE DE DATOS II',1,'16:00:00','18:00:00','TEO','Jueves','ARREDONDO CASTILLO','GUSTAVO','20','A','SA103-AP'),
('202W0703', 'EXPERIENCIA DE USUARIO Y USABILIDAD',1,'16:00:00','18:00:00','TEO','Jueves','PETRLIK AZABACHE','IVAN CARLO','20','A','LA008'),
('202W0704', 'GESTIÓN DE PROYECTO DE SOFTWARE',1,'14:00:00','18:00:00','TEO','Sabado','BARTRA MORE','ARTURO ALEJANDRO','50','A','SA109-AP'),
('202W0705', 'INTELIGENCIA ARTIFICIAL',1,'14:00:00','16:00:00','LABO','Lunes','GAMARRA MORENO','JUAN','50','A','LA008'),
('202W0706', 'MÉTODOS FORMALES PARA PRUEBAS',1,'18:00:00','20:00:00','TEO','Martes','BARTRA MORE','ARTURO ALEJANDRO','50','A','SA105-NP'),
('202W0707', 'REDES Y TRANSMISIÓN DE DATOS',1,'08:00:00','12:00:00','TEO','Sabado','UGAZ CACHAY','WINSTON IGNACIO','20','A','SA102-AP'),
('202W0602', 'BASE DE DATOS I',1,'16:00:00','18:00:00','LABO','Miercoles','MURAKAMI DE LA CRUZ','SUMIKO ELIZABETH','30','A','LA008'),

-- Cursos del tercer piso
-- (`codigo_curso`, `nombre`, `grupo`,`hora_entrada`,`hora_salida`,`modo`,`dia`,`profesor_ape`,`profesor_nomb`,`matriculados`,`estado`,`codigo_area`)
('20118076', 'INTERNET DE LAS COSAS', 1, '10:00:00', '12:00:00','LABO', 'VIERNES', 'GUERRA GUERRA', 'JORGUE LEONCIO', 30, 'A', 'LA306-NP'),
('20118083', 'DESARROLLO DE SISTEMAS MOVILES', 2, '18:00:00', '22:00:00','LABO', 'VIERNES', 'GUERRA GUERRA', 'JORGUE LEONCIO', 30, 'A', 'LA306-NP'),
('20118092', 'MINERIA DE DATOS', 2, '20:00:00', '22:00:00','LABO', 'VIERNES', 'LEZAMA GONZALES', 'PEDRO MARTIN', 30, 'A', 'LA305-NP'),
('20118041', 'ALGORÍTMICA Y PROGRAMACIÓN ORIENTADA A OBJETOS', 2, '17:00:00', '19:00:00','LABO', 'VIERNES', 'CORTEZ VAZQUEZ', 'AUGUSTO PARCEMON', 30, 'A', 'LA308-AP'),
('202W0301', 'ALGORÍTMICA I', 1, '11:00:00', '13:00:00','LABO', 'VIERNES', 'ARREDONDO CASTILLO', 'GUSTAVO', 35, 'A', 'LA307-AP'),
('202W0401 ', 'ALGORÍTMICA II', 3, '11:00:00', '13:00:00','LABO', 'VIERNES', 'CORTEZ VÁSQUEZ,', 'AUGUSTO PARCEMON', 16, 'A', 'LA307-NP'),
('202W0403 ', 'INNOVACIÓN, TECNOLOGÍA Y EMPRENDIMIENTO', 3, '16:00:00', '18:00:00','LABO', 'VIERNES', 'AGUILAR ALONSO', 'IGOR JOVINO ', 33, 'A', 'LA306-NP'),
('202W0502 ', 'ARQUITECTURA DE COMPUTADORAS', 1, '20:00:00', '22:00:00','LABO', 'VIERNES', 'AGUILAR ALONSO', 'IGOR JOVINO ', 38, 'A', 'LA304-NP')
;

INSERT INTO usuarios(usuario, contrasena) 
VALUES ('user1', 'password'), ('user2', 'password'), ('a', 'a');