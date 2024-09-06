-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         11.4.2-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para db_goldenfold
DROP DATABASE IF EXISTS `db_goldenfold`;
CREATE DATABASE IF NOT EXISTS `db_goldenfold` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci */;
USE `db_goldenfold`;

-- Volcando estructura para tabla db_goldenfold.asignaciones
DROP TABLE IF EXISTS `asignaciones`;
CREATE TABLE IF NOT EXISTS `asignaciones` (
  `id_asignacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) DEFAULT NULL,
  `ubicacion` varchar(10) DEFAULT NULL,
  `fecha_asignacion` datetime DEFAULT current_timestamp(),
  `fecha_liberacion` datetime DEFAULT NULL,
  `asignado_por` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_asignacion`),
  KEY `ID_Paciente` (`id_paciente`),
  KEY `Ubicacion` (`ubicacion`),
  KEY `Asignado_Por` (`asignado_por`),
  CONSTRAINT `asignaciones_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`),
  CONSTRAINT `asignaciones_ibfk_2` FOREIGN KEY (`ubicacion`) REFERENCES `camas` (`ubicacion`),
  CONSTRAINT `asignaciones_ibfk_3` FOREIGN KEY (`asignado_por`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla db_goldenfold.asignaciones: ~12 rows (aproximadamente)
INSERT INTO `asignaciones` (`id_asignacion`, `id_paciente`, `ubicacion`, `fecha_asignacion`, `fecha_liberacion`, `asignado_por`) VALUES
	(30, 20, 'F1011301', '2024-09-06 10:45:00', NULL, 5),
	(31, 22, 'F1011701', '2024-09-06 11:00:00', NULL, 6),
	(32, 26, 'F1010101', '2024-09-06 11:15:00', NULL, 5),
	(33, 28, 'F1011302', '2024-09-06 11:30:00', NULL, 6),
	(34, 32, 'F1011401', '2024-09-06 11:45:00', NULL, 7),
	(35, 34, 'F1011702', '2024-09-06 12:00:00', NULL, 7),
	(36, 38, 'F1010201', '2024-09-06 12:15:00', NULL, 5),
	(37, 41, 'F1010301', '2024-09-06 12:30:00', NULL, 6),
	(38, 45, 'F1010401', '2024-09-06 12:45:00', NULL, 7),
	(39, 47, 'F1010501', '2024-09-06 13:00:00', NULL, 6),
	(40, 49, 'F1010601', '2024-09-06 13:15:00', NULL, 5),
	(41, 55, 'F1010602', '2024-09-06 13:30:00', NULL, 7);

-- Volcando estructura para tabla db_goldenfold.camas
DROP TABLE IF EXISTS `camas`;
CREATE TABLE IF NOT EXISTS `camas` (
  `ubicacion` varchar(10) NOT NULL,
  `estado` varchar(50) DEFAULT 'Disponible',
  `tipo` varchar(50) DEFAULT NULL,
  `id_habitacion` int(11) DEFAULT NULL,
  PRIMARY KEY (`ubicacion`),
  KEY `fk_habitacion` (`id_habitacion`),
  CONSTRAINT `fk_habitacion` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla db_goldenfold.camas: ~40 rows (aproximadamente)
INSERT INTO `camas` (`ubicacion`, `estado`, `tipo`, `id_habitacion`) VALUES
	('F1010101', 'Disponible', 'General', 1),
	('F1010102', 'Disponible', 'General', 1),
	('F1010201', 'Ocupada', 'General', 2),
	('F1010202', 'Disponible', 'General', 2),
	('F1010301', 'Disponible', 'General', 3),
	('F1010302', 'Ocupada', 'General', 3),
	('F1010401', 'Disponible', 'General', 4),
	('F1010402', 'Disponible', 'General', 4),
	('F1010501', 'Disponible', 'General', 5),
	('F1010502', 'Ocupada', 'General', 5),
	('F1010601', 'Disponible', 'General', 6),
	('F1010602', 'Disponible', 'General', 6),
	('F1010701', 'Disponible', 'General', 7),
	('F1010702', 'Ocupada', 'General', 7),
	('F1010801', 'Disponible', 'General', 8),
	('F1010802', 'Disponible', 'General', 8),
	('F1010901', 'Ocupada', 'General', 9),
	('F1010902', 'Disponible', 'General', 9),
	('F1011001', 'Disponible', 'General', 10),
	('F1011002', 'Ocupada', 'General', 10),
	('F1011101', 'Disponible', 'General', 11),
	('F1011102', 'Disponible', 'General', 11),
	('F1011201', 'Ocupada', 'General', 12),
	('F1011202', 'Disponible', 'General', 12),
	('F1011301', 'Disponible', 'UCI', 13),
	('F1011302', 'Ocupada', 'UCI', 13),
	('F1011401', 'Disponible', 'UCI', 14),
	('F1011402', 'Disponible', 'UCI', 14),
	('F1011501', 'Ocupada', 'UCI', 15),
	('F1011502', 'Disponible', 'UCI', 15),
	('F1011601', 'Disponible', 'UCI', 16),
	('F1011602', 'Ocupada', 'UCI', 16),
	('F1011701', 'Disponible', 'Postoperatorio', 17),
	('F1011702', 'Ocupada', 'Postoperatorio', 17),
	('F1011801', 'Disponible', 'Postoperatorio', 18),
	('F1011802', 'Disponible', 'Postoperatorio', 18),
	('F1011901', 'Ocupada', 'Postoperatorio', 19),
	('F1011902', 'Disponible', 'Postoperatorio', 19),
	('F1012001', 'Disponible', 'Postoperatorio', 20),
	('F1012002', 'Ocupada', 'Postoperatorio', 20);

-- Volcando estructura para tabla db_goldenfold.consultas
DROP TABLE IF EXISTS `consultas`;
CREATE TABLE IF NOT EXISTS `consultas` (
  `id_consulta` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) DEFAULT NULL,
  `id_medico` int(11) DEFAULT NULL,
  `motivo` text DEFAULT NULL,
  `fecha_solicitud` datetime DEFAULT current_timestamp(),
  `fecha_consulta` datetime DEFAULT NULL,
  `estado` enum('pendiente de consultar','pendiente de ingreso') DEFAULT 'pendiente de consultar',
  PRIMARY KEY (`id_consulta`),
  KEY `fk_paciente_consulta` (`id_paciente`),
  KEY `fk_medico_consulta` (`id_medico`),
  CONSTRAINT `fk_medico_consulta` FOREIGN KEY (`id_medico`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `fk_paciente_consulta` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla db_goldenfold.consultas: ~18 rows (aproximadamente)
INSERT INTO `consultas` (`id_consulta`, `id_paciente`, `id_medico`, `motivo`, `fecha_solicitud`, `fecha_consulta`, `estado`) VALUES
	(37, 18, 5, 'Consulta por fiebre alta persistente', '2024-09-06 10:30:00', NULL, 'pendiente de consultar'),
	(38, 19, 5, 'Consulta por dolor abdominal agudo', '2024-09-06 10:35:00', NULL, 'pendiente de consultar'),
	(39, 21, 7, 'Consulta por mareos y náuseas', '2024-09-06 10:40:00', NULL, 'pendiente de consultar'),
	(40, 27, 5, 'Consulta por erupciones cutáneas', '2024-09-06 10:55:00', NULL, 'pendiente de consultar'),
	(41, 31, 7, 'Consulta por fatiga y mareos', '2024-09-06 11:05:00', NULL, 'pendiente de consultar'),
	(42, 33, 8, 'Consulta por dolor abdominal', '2024-09-06 11:10:00', NULL, 'pendiente de consultar'),
	(43, 40, 5, 'Consulta por problemas cardíacos', '2024-09-06 11:20:00', NULL, 'pendiente de consultar'),
	(44, 56, 5, 'Consulta por fatiga crónica', '2024-09-06 11:45:00', NULL, 'pendiente de consultar'),
	(45, 23, 8, 'Consulta por tos persistente y fiebre', '2024-09-06 10:45:00', '2024-09-06 13:00:00', 'pendiente de ingreso'),
	(46, 24, 9, 'Consulta por dolor en las articulaciones', '2024-09-06 10:50:00', '2024-09-06 13:30:00', 'pendiente de ingreso'),
	(47, 30, 6, 'Consulta por fiebre alta', '2024-09-06 11:00:00', '2024-09-06 14:00:00', 'pendiente de ingreso'),
	(48, 35, 9, 'Consulta por fiebre alta persistente', '2024-09-06 11:15:00', '2024-09-06 15:00:00', 'pendiente de ingreso'),
	(49, 43, 6, 'Consulta por dolor de garganta', '2024-09-06 11:25:00', '2024-09-06 16:00:00', 'pendiente de ingreso'),
	(50, 44, 7, 'Consulta por dolor abdominal', '2024-09-06 11:30:00', '2024-09-06 16:30:00', 'pendiente de ingreso'),
	(51, 46, 8, 'Consulta por infección respiratoria', '2024-09-06 11:35:00', '2024-09-06 17:00:00', 'pendiente de ingreso'),
	(52, 54, 9, 'Consulta por dolor abdominal agudo', '2024-09-06 11:40:00', '2024-09-06 17:30:00', 'pendiente de ingreso'),
	(53, 57, 6, 'Consulta por dolor de cabeza persistente', '2024-09-06 11:50:00', '2024-09-06 18:00:00', 'pendiente de ingreso'),
	(54, 59, 7, 'Consulta por dolor abdominal crónico', '2024-09-06 11:55:00', '2024-09-06 18:30:00', 'pendiente de ingreso');

-- Volcando estructura para tabla db_goldenfold.habitaciones
DROP TABLE IF EXISTS `habitaciones`;
CREATE TABLE IF NOT EXISTS `habitaciones` (
  `id_habitacion` int(11) NOT NULL AUTO_INCREMENT,
  `edificio` varchar(2) DEFAULT NULL,
  `planta` varchar(2) DEFAULT NULL,
  `numero_habitacion` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`id_habitacion`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla db_goldenfold.habitaciones: ~20 rows (aproximadamente)
INSERT INTO `habitaciones` (`id_habitacion`, `edificio`, `planta`, `numero_habitacion`) VALUES
	(1, 'F1', '01', '01'),
	(2, 'F1', '01', '02'),
	(3, 'F1', '01', '03'),
	(4, 'F1', '01', '04'),
	(5, 'F1', '01', '05'),
	(6, 'F1', '01', '06'),
	(7, 'F1', '01', '07'),
	(8, 'F1', '01', '08'),
	(9, 'F1', '01', '09'),
	(10, 'F1', '01', '10'),
	(11, 'F1', '01', '11'),
	(12, 'F1', '01', '12'),
	(13, 'F1', '01', '13'),
	(14, 'F1', '01', '14'),
	(15, 'F1', '01', '15'),
	(16, 'F1', '01', '16'),
	(17, 'F1', '01', '17'),
	(18, 'F1', '01', '18'),
	(19, 'F1', '01', '19'),
	(20, 'F1', '01', '20');

-- Volcando estructura para tabla db_goldenfold.historialaltas
DROP TABLE IF EXISTS `historialaltas`;
CREATE TABLE IF NOT EXISTS `historialaltas` (
  `id_historial` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) DEFAULT NULL,
  `fecha_alta` datetime DEFAULT NULL,
  `diagnostico` varchar(255) DEFAULT NULL,
  `tratamiento` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `ID_Paciente` (`id_paciente`),
  CONSTRAINT `historialaltas_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla db_goldenfold.historialaltas: ~13 rows (aproximadamente)
INSERT INTO `historialaltas` (`id_historial`, `id_paciente`, `fecha_alta`, `diagnostico`, `tratamiento`) VALUES
	(40, 25, '2022-02-15 00:00:00', 'Fatiga crónica', 'Reposo absoluto y seguimiento con médico de cabecera'),
	(41, 25, '2023-06-10 00:00:00', 'Recuperación tras cirugía menor', 'Seguimiento ambulatorio'),
	(42, 29, '2023-04-01 00:00:00', 'Pérdida de memoria por trauma', 'Rehabilitación cognitiva y medicamentos'),
	(43, 36, '2021-09-25 00:00:00', 'Angina de pecho', 'Reposo y tratamiento con nitroglicerina'),
	(44, 36, '2023-08-12 00:00:00', 'Recuperación de infarto leve', 'Rehabilitación cardiaca y control mensual'),
	(45, 37, '2023-05-23 00:00:00', 'Problemas de movilidad', 'Terapia física intensiva y seguimiento neurológico'),
	(46, 39, '2022-11-12 00:00:00', 'Dolor de cabeza crónico', 'Analgésicos y cambio en la dieta'),
	(47, 42, '2021-12-03 00:00:00', 'Neumonía leve', 'Antibióticos y reposo en casa'),
	(48, 42, '2023-07-19 00:00:00', 'Problemas respiratorios', 'Inhaladores y seguimiento con neumólogo'),
	(49, 50, '2022-09-08 00:00:00', 'Fatiga crónica', 'Reposo y terapia psicológica'),
	(50, 53, '2023-03-11 00:00:00', 'Problemas cardíacos', 'Tratamiento con betabloqueantes y seguimiento mensual'),
	(51, 58, '2023-01-05 00:00:00', 'Problemas respiratorios graves', 'Tratamiento con broncodilatadores'),
	(52, 48, '2023-06-17 00:00:00', 'Problemas digestivos', 'Dieta especial y seguimiento con gastroenterólogo');

-- Volcando estructura para tabla db_goldenfold.ingresos
DROP TABLE IF EXISTS `ingresos`;
CREATE TABLE IF NOT EXISTS `ingresos` (
  `id_ingreso` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) DEFAULT NULL,
  `id_medico` int(11) DEFAULT NULL,
  `motivo` text DEFAULT NULL,
  `fecha_solicitud` datetime DEFAULT current_timestamp(),
  `estado` enum('pendiente','asignado','rechazado') DEFAULT 'pendiente',
  `id_asignacion` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_ingreso`),
  KEY `fk_paciente_ingreso` (`id_paciente`),
  KEY `fk_medico_ingreso` (`id_medico`),
  KEY `fk_asignacion_ingreso` (`id_asignacion`),
  CONSTRAINT `fk_asignacion_ingreso` FOREIGN KEY (`id_asignacion`) REFERENCES `asignaciones` (`id_asignacion`),
  CONSTRAINT `fk_medico_ingreso` FOREIGN KEY (`id_medico`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `fk_paciente_ingreso` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla db_goldenfold.ingresos: ~10 rows (aproximadamente)
INSERT INTO `ingresos` (`id_ingreso`, `id_paciente`, `id_medico`, `motivo`, `fecha_solicitud`, `estado`, `id_asignacion`) VALUES
	(1, 23, 8, 'Consulta por tos persistente y fiebre', '2024-09-06 13:00:00', 'pendiente', NULL),
	(2, 24, 9, 'Consulta por dolor en las articulaciones', '2024-09-06 13:30:00', 'pendiente', NULL),
	(3, 30, 6, 'Consulta por fiebre alta', '2024-09-06 14:00:00', 'pendiente', NULL),
	(4, 35, 9, 'Consulta por fiebre alta persistente', '2024-09-06 15:00:00', 'pendiente', NULL),
	(5, 43, 6, 'Consulta por dolor de garganta', '2024-09-06 16:00:00', 'pendiente', NULL),
	(6, 44, 7, 'Consulta por dolor abdominal', '2024-09-06 16:30:00', 'pendiente', NULL),
	(7, 46, 8, 'Consulta por infección respiratoria', '2024-09-06 17:00:00', 'pendiente', NULL),
	(8, 54, 9, 'Consulta por dolor abdominal agudo', '2024-09-06 17:30:00', 'pendiente', NULL),
	(9, 57, 6, 'Consulta por dolor de cabeza persistente', '2024-09-06 18:00:00', 'pendiente', NULL),
	(10, 59, 7, 'Consulta por dolor abdominal crónico', '2024-09-06 18:30:00', 'pendiente', NULL);

-- Volcando estructura para tabla db_goldenfold.pacientes
DROP TABLE IF EXISTS `pacientes`;
CREATE TABLE IF NOT EXISTS `pacientes` (
  `id_paciente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `edad` int(11) NOT NULL,
  `sintomas` varchar(255) DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'Pendiente de cama',
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `seguridad_social` varchar(12) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `historial_medico` text DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  PRIMARY KEY (`id_paciente`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla db_goldenfold.pacientes: ~43 rows (aproximadamente)
INSERT INTO `pacientes` (`id_paciente`, `nombre`, `edad`, `sintomas`, `estado`, `fecha_registro`, `seguridad_social`, `direccion`, `telefono`, `email`, `historial_medico`, `fecha_nacimiento`) VALUES
	(18, 'Sergio Rodríguez', 45, 'Fiebre alta persistente', 'Pendiente de cama', '2024-09-06 10:27:36', '746310728493', 'Calle Mayor 42, Madrid', '600123456', 'sergio.rodriguez@example.com', 'Historial médico del paciente Sergio Rodríguez', '1979-12-02'),
	(19, 'Carmen López', 50, 'Dolor abdominal agudo', 'Pendiente de cama', '2024-09-06 10:27:36', '254719038612', 'Avenida de las Ciencias 10, Sevilla', '621234567', 'carmen.lopez@example.com', 'Historial médico del paciente Carmen López', '1974-04-16'),
	(20, 'Luis Fernández', 32, 'Dificultad respiratoria', 'En tratamiento', '2024-09-06 10:27:36', '873124678914', 'Calle del Sol 5, Valencia', '609876543', 'luis.fernandez@example.com', 'Historial médico del paciente Luis Fernández', '1992-07-20'),
	(21, 'Ana Martínez', 27, 'Mareos y náuseas', 'Pendiente de cama', '2024-09-06 10:27:36', '495871023984', 'Calle Nueva 8, Barcelona', '612345789', 'ana.martinez@example.com', 'Historial médico del paciente Ana Martínez', '1995-03-28'),
	(22, 'Jorge Pérez', 60, 'Dolor en el pecho', 'En tratamiento', '2024-09-06 10:27:36', '573981045721', 'Calle Gran Vía 100, Bilbao', '623456789', 'jorge.perez@example.com', 'Historial médico del paciente Jorge Pérez', '1963-01-18'),
	(23, 'Laura Sánchez', 42, 'Tos persistente y fiebre', 'Pendiente de cama', '2024-09-06 10:27:36', '139472981627', 'Calle de la Luna 23, Zaragoza', '634567890', 'laura.sanchez@example.com', 'Historial médico del paciente Laura Sánchez', '1981-10-15'),
	(24, 'Marta Ruiz', 36, 'Dolor en las articulaciones', 'Pendiente de cama', '2024-09-06 10:27:36', '928374645192', 'Avenida del Parque 25, Málaga', '644567890', 'marta.ruiz@example.com', 'Historial médico del paciente Marta Ruiz', '1987-06-21'),
	(25, 'Carlos Gómez', 55, 'Fatiga crónica', 'Alta', '2024-09-06 10:27:36', '182736451092', 'Calle del Río 7, Murcia', '654567890', 'carlos.gomez@example.com', 'Historial médico del paciente Carlos Gómez', '1968-02-17'),
	(26, 'Pablo Morales', 47, 'Pérdida de apetito', 'En tratamiento', '2024-09-06 10:27:36', '192837465017', 'Plaza del Sol 4, Alicante', '664567890', 'pablo.morales@example.com', 'Historial médico del paciente Pablo Morales', '1976-08-25'),
	(27, 'Sofía Díaz', 31, 'Erupciones cutáneas', 'Pendiente de cama', '2024-09-06 10:27:36', '293746182039', 'Calle de las Flores 6, Granada', '674567890', 'sofia.diaz@example.com', 'Historial médico del paciente Sofía Díaz', '1991-09-11'),
	(28, 'Isabel García', 29, 'Infección respiratoria', 'En tratamiento', '2024-09-06 10:27:36', '374819263058', 'Avenida de los Pinos 9, Salamanca', '684567890', 'isabel.garcia@example.com', 'Historial médico del paciente Isabel García', '1993-03-14'),
	(29, 'Raúl Jiménez', 64, 'Pérdida de memoria', 'Alta', '2024-09-06 10:27:36', '485710923716', 'Calle de la Estrella 11, Córdoba', '694567890', 'raul.jimenez@example.com', 'Historial médico del paciente Raúl Jiménez', '1959-05-22'),
	(30, 'David Torres', 40, 'Fiebre alta', 'Pendiente de cama', '2024-09-06 10:27:36', '918374650183', 'Calle de los Vientos 15, Vigo', '600234567', 'david.torres@example.com', 'Historial médico del paciente David Torres', '1983-01-03'),
	(31, 'Lucía Castro', 33, 'Fatiga y mareos', 'Pendiente de cama', '2024-09-06 10:27:36', '823647192305', 'Calle del Sol 12, Cádiz', '611234567', 'lucia.castro@example.com', 'Historial médico del paciente Lucía Castro', '1990-04-28'),
	(32, 'Fernando Martín', 70, 'Problemas respiratorios', 'En tratamiento', '2024-09-06 10:27:36', '263741092847', 'Plaza Mayor 18, Palma', '622345678', 'fernando.martin@example.com', 'Historial médico del paciente Fernando Martín', '1953-12-09'),
	(33, 'Patricia Ramírez', 28, 'Dolor abdominal', 'Pendiente de cama', '2024-09-06 10:27:36', '374618290374', 'Calle Mayor 19, León', '633456789', 'patricia.ramirez@example.com', 'Historial médico del paciente Patricia Ramírez', '1995-07-23'),
	(34, 'Manuel López', 49, 'Dificultad respiratoria', 'En tratamiento', '2024-09-06 10:27:36', '465712938571', 'Calle de la Paz 21, Oviedo', '644567891', 'manuel.lopez@example.com', 'Historial médico del paciente Manuel López', '1974-02-08'),
	(35, 'Clara Romero', 37, 'Fiebre alta persistente', 'Pendiente de cama', '2024-09-06 10:27:36', '591283746510', 'Calle de las Rosas 23, Almería', '655678912', 'clara.romero@example.com', 'Historial médico del paciente Clara Romero', '1986-05-16'),
	(36, 'Víctor Medina', 52, 'Dolor de pecho agudo', 'Alta', '2024-09-06 10:27:36', '847162930485', 'Avenida del Mar 2, Huelva', '666789123', 'victor.medina@example.com', 'Historial médico del paciente Víctor Medina', '1971-09-29'),
	(37, 'Gloria Vázquez', 63, 'Problemas de movilidad', 'Alta', '2024-09-06 10:27:36', '628374516027', 'Calle de la Estación 17, Burgos', '677891234', 'gloria.vazquez@example.com', 'Historial médico del paciente Gloria Vázquez', '1960-07-31'),
	(38, 'Roberto Delgado', 41, 'Dolor lumbar crónico', 'En tratamiento', '2024-09-06 10:27:36', '374920576184', 'Calle de los Cipreses 20, Santander', '688912345', 'roberto.delgado@example.com', 'Historial médico del paciente Roberto Delgado', '1982-11-20'),
	(39, 'Inés Blanco', 59, 'Dolor de cabeza', 'Alta', '2024-09-06 10:27:36', '729384105627', 'Calle del Olmo 30, Logroño', '600321456', 'ines.blanco@example.com', 'Historial médico del paciente Inés Blanco', '1964-10-07'),
	(40, 'Joaquín Ortiz', 68, 'Problemas cardíacos', 'Pendiente de cama', '2024-09-06 10:27:36', '631827493050', 'Plaza de la Iglesia 13, Cuenca', '611432567', 'joaquin.ortiz@example.com', 'Historial médico del paciente Joaquín Ortiz', '1955-06-17'),
	(41, 'Rosa Molina', 30, 'Fatiga intensa', 'En tratamiento', '2024-09-06 10:27:36', '234857192065', 'Avenida de los Reyes 25, Segovia', '622543678', 'rosa.molina@example.com', 'Historial médico del paciente Rosa Molina', '1992-12-05'),
	(42, 'Alberto Ruiz', 56, 'Problemas respiratorios', 'Alta', '2024-09-06 10:27:36', '192837465091', 'Calle del Sol 19, Guadalajara', '633654789', 'alberto.ruiz@example.com', 'Historial médico del paciente Alberto Ruiz', '1967-04-01'),
	(43, 'Lourdes Herrera', 24, 'Dolor de garganta', 'Pendiente de cama', '2024-09-06 10:27:36', '938475610287', 'Avenida del Lago 21, Toledo', '644765890', 'lourdes.herrera@example.com', 'Historial médico del paciente Lourdes Herrera', '1999-08-30'),
	(44, 'Ignacio Sanz', 36, 'Dolor abdominal', 'Pendiente de cama', '2024-09-06 10:27:36', '102938475612', 'Calle Mayor 33, Zaragoza', '655876901', 'ignacio.sanz@example.com', 'Historial médico del paciente Ignacio Sanz', '1987-11-22'),
	(45, 'Alicia Gil', 43, 'Tos crónica', 'En tratamiento', '2024-09-06 10:27:36', '120394857623', 'Calle de la Luna 12, Badajoz', '666987012', 'alicia.gil@example.com', 'Historial médico del paciente Alicia Gil', '1980-10-19'),
	(46, 'Fátima Navarro', 50, 'Infección respiratoria', 'Pendiente de cama', '2024-09-06 10:27:36', '495817362094', 'Calle del Sol 22, Pamplona', '677098123', 'fatima.navarro@example.com', 'Historial médico del paciente Fátima Navarro', '1973-05-12'),
	(47, 'Alejandro Ramos', 63, 'Dolor en las articulaciones', 'En tratamiento', '2024-09-06 10:27:36', '561827394561', 'Plaza Mayor 35, Salamanca', '688109234', 'alejandro.ramos@example.com', 'Historial médico del paciente Alejandro Ramos', '1960-01-08'),
	(48, 'Beatriz Pérez', 39, 'Problemas digestivos', 'Alta', '2024-09-06 10:27:36', '738495610297', 'Calle del Río 28, Valencia', '600987345', 'beatriz.perez@example.com', 'Historial médico del paciente Beatriz Pérez', '1984-03-11'),
	(49, 'Pablo Alonso', 27, 'Dolor de cabeza crónico', 'En tratamiento', '2024-09-06 10:27:36', '928374156029', 'Calle Mayor 40, León', '611987456', 'pablo.alonso@example.com', 'Historial médico del paciente Pablo Alonso', '1996-12-24'),
	(50, 'Dolores Ibáñez', 53, 'Fatiga crónica', 'Alta', '2024-09-06 10:27:36', '483719205837', 'Avenida del Sol 45, Huesca', '622765890', 'dolores.ibanez@example.com', 'Historial médico del paciente Dolores Ibáñez', '1970-09-14'),
	(51, 'Ramón Núñez', 47, 'Problemas respiratorios', 'Pendiente de cama', '2024-09-06 10:27:36', '239817405627', 'Calle de la Fuente 6, Albacete', '633876912', 'ramon.nunez@example.com', 'Historial médico del paciente Ramón Núñez', '1976-04-05'),
	(52, 'Claudia Castro', 31, 'Dolor de garganta persistente', 'En tratamiento', '2024-09-06 10:27:36', '192837450293', 'Calle de los Olivos 23, Vitoria', '644987123', 'claudia.castro@example.com', 'Historial médico del paciente Claudia Castro', '1992-06-10'),
	(53, 'Santiago Pardo', 62, 'Problemas cardíacos', 'Alta', '2024-09-06 10:27:36', '728495610372', 'Plaza de España 50, Barcelona', '655109876', 'santiago.pardo@example.com', 'Historial médico del paciente Santiago Pardo', '1961-02-01'),
	(54, 'Eva Moreno', 38, 'Dolor abdominal agudo', 'Pendiente de cama', '2024-09-06 10:27:36', '938471520938', 'Calle del Lago 55, Madrid', '666219087', 'eva.moreno@example.com', 'Historial médico del paciente Eva Moreno', '1985-11-18'),
	(55, 'Raquel Ramírez', 25, 'Mareos y náuseas', 'En tratamiento', '2024-09-06 10:27:36', '593817205738', 'Calle Mayor 60, Sevilla', '677098721', 'raquel.ramirez@example.com', 'Historial médico del paciente Raquel Ramírez', '1998-07-14'),
	(56, 'Francisco Gómez', 44, 'Fatiga crónica', 'Pendiente de cama', '2024-09-06 10:27:36', '172839465029', 'Calle del Sol 9, Burgos', '688098234', 'francisco.gomez@example.com', 'Historial médico del paciente Francisco Gómez', '1979-12-30'),
	(57, 'Andrea Vargas', 29, 'Dolor de cabeza persistente', 'Pendiente de cama', '2024-09-06 10:27:36', '293817405672', 'Avenida de los Reyes 4, Murcia', '600987123', 'andrea.vargas@example.com', 'Historial médico del paciente Andrea Vargas', '1994-01-22'),
	(58, 'Javier Gil', 58, 'Problemas respiratorios', 'Alta', '2024-09-06 10:27:36', '938475610283', 'Calle de las Flores 7, Bilbao', '611234789', 'javier.gil@example.com', 'Historial médico del paciente Javier Gil', '1965-06-13'),
	(59, 'Lucía Álvarez', 33, 'Dolor abdominal crónico', 'Pendiente de cama', '2024-09-06 10:27:36', '192837465028', 'Plaza del Sol 3, Granada', '622654321', 'lucia.alvarez@example.com', 'Historial médico del paciente Lucía Álvarez', '1990-08-25'),
	(60, 'Julio Ferrer', 45, 'Problemas digestivos', 'En tratamiento', '2024-09-06 10:27:36', '728394510837', 'Calle del Río 17, Cádiz', '633765098', 'julio.ferrer@example.com', 'Historial médico del paciente Julio Ferrer', '1978-05-03');

-- Volcando estructura para tabla db_goldenfold.roles
DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla db_goldenfold.roles: ~4 rows (aproximadamente)
INSERT INTO `roles` (`id_rol`, `nombre_rol`) VALUES
	(1, 'Administrativo'),
	(2, 'Médico'),
	(3, 'Coordinador de Camas'),
	(4, 'Administrador de Sistema');

-- Volcando estructura para tabla db_goldenfold.usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `contrasenya` varchar(255) NOT NULL,
  `id_rol` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `Usuario` (`nombre_usuario`),
  KEY `ID_Rol` (`id_rol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla db_goldenfold.usuarios: ~12 rows (aproximadamente)
INSERT INTO `usuarios` (`id_usuario`, `nombre`, `nombre_usuario`, `contrasenya`, `id_rol`) VALUES
	(5, 'Dr. Carlos García', 'carlos.garcia', 'hashed_password_1', 2),
	(6, 'Dra. Ana Martínez', 'ana.martinez', 'hashed_password_2', 2),
	(7, 'Dr. Juan Pérez', 'juan.perez', 'hashed_password_3', 2),
	(8, 'Dra. Laura Sánchez', 'laura.sanchez', 'hashed_password_4', 2),
	(9, 'Dr. Luis Fernández', 'luis.fernandez', 'hashed_password_5', 2),
	(10, 'María López', 'maria.lopez', 'hashed_password_6', 1),
	(11, 'Jorge Rodríguez', 'jorge.rodriguez', 'hashed_password_7', 1),
	(12, 'Clara Ramírez', 'clara.ramirez', 'hashed_password_8', 1),
	(13, 'Pablo Morales', 'pablo.morales', 'hashed_password_9', 3),
	(14, 'Isabel Díaz', 'isabel.diaz', 'hashed_password_10', 3),
	(15, 'Roberto Vázquez', 'roberto.vazquez', 'hashed_password_11', 4),
	(16, 'Sofía Romero', 'sofia.romero', 'hashed_password_12', 4);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
