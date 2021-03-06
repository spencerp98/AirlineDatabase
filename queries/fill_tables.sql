INSERT INTO crew_base (city)
VALUES ("PHL");

INSERT INTO crew_base (city)
VALUES ("CLT");

INSERT INTO crew_base (city)
VALUES ("JFK");

INSERT INTO crew_base (city)
VALUES ("LAX");

INSERT INTO crew_member (fname, lname, crewbase, role)
VALUES ("Joe", "Pilot", 1, "Captain");

INSERT INTO crew_member (fname, lname, crewbase, role)
VALUES ("Tom", "Cruise", 3, "First Officer");

INSERT INTO crew_member (fname, lname, crewbase, role)
VALUES ("Matt", "Damon", 2, "Flight Attendent");

INSERT INTO aircraft_type (manufacturer, model)
VALUES ("Boeing", "B747");

INSERT INTO aircraft_type (manufacturer, model)
VALUES ("Airbus", "A320");

INSERT INTO aircraft_type (manufacturer, model)
VALUES ("Airbus", "A330");

INSERT INTO aircraft (`type`, registrationNumber)
VALUES (2, "N123OS");

INSERT INTO aircraft (`type`, registrationNumber)
VALUES (1, "N246EB");

INSERT INTO aircraft (`type`, registrationNumber)
VALUES (2, "N777CS");

INSERT INTO flight (flightNum, aircraft, departureCity, arrivalCity, dateTime)
VALUES (425, 1, "PHL", "PDX", "2017-12-05 10:30:00");

INSERT INTO flight (flightNum, aircraft, departureCity, arrivalCity, dateTime)
VALUES (1784, 2, "JFK", "LAX", "2017-12-07 07:46:00");

