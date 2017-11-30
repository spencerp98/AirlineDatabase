DROP TABLE IF EXISTS `crew_base`;
DROP TABLE IF EXISTS `crew_member`;
DROP TABLE IF EXISTS `crew_flight`;
DROP TABLE IF EXISTS `flight`;
DROP TABLE IF EXISTS `aircraft`;
DROP TABLE IF EXISTS `aircraft_type`;
DROP TABLE IF EXISTS `crew_aircraft`;

CREATE TABLE `crew_base` (
	`id` int NOT NULL AUTO_INCREMENT,
	`city` varchar(255),
	PRIMARY KEY (`id`),
	UNIQUE (`city`)
) ENGINE=InnoDB;

CREATE TABLE `crew_member` (
	`id` int NOT NULL AUTO_INCREMENT,
	`fname` varchar(255) NOT NULL,
	`lname` varchar(255) NOT NULL,
	`crewbase` int,
	`role` varchar(255) NOT NULL,
	PRIMARY KEY (`id`),
	CONSTRAINT U_Person UNIQUE (`fname`, `lname`),
	FOREIGN KEY (`crewbase`) REFERENCES `crew_base` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `crew_flight` (
	`id` int NOT NULL AUTO_INCREMENT,
	`crew_id` int NOT NULL,
	`flight_id` int NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`crew_id`) REFERENCES `crew_member` (`id`),
	FOREIGN KEY (`flight_id`) REFERENCES `flight` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `flight` (
	`id` int NOT NULL AUTO_INCREMENT,
	`flightNum` int NOT NULL,
	`aircraft` int NOT NULL,
	`departureCity` varchar(255) NOT NULL,
	`arrivalCity` varchar(255) NOT NULL,
	`dateTime` datetime NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`aircraft`) REFERENCES `aircraft` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `aircraft_type` (
	`id` int NOT NULL AUTO_INCREMENT,
	`manufacturer` varchar(255) NOT NULL,
	`model` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `aircraft` (
	`id` int NOT NULL AUTO_INCREMENT,
	`type` int NOT NULL,
	`registrationNumber` varchar(6) NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`type`) REFERENCES `aircraft_type` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `crew_aircraft` (
	`id` int NOT NULL AUTO_INCREMENT,
	`crew_id` int NOT NULL,
	`aircraftTypeID` int NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`crew_id`) REFERENCES `crew_member` (`id`),
	FOREIGN KEY (`aircraftTypeID`) REFERENCES `aircraft_type` (`id`)
) ENGINE=InnoDB;
