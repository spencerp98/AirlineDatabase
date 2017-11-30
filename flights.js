module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getAircraft(res, mysql, context, complete){
        mysql.pool.query("SELECT id, registrationNumber FROM aircraft", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.aircraft = results;
            complete();
        });
    }

    function getFlights(res, mysql, context, complete){
        mysql.pool.query("SELECT flight.id, flightNum, registrationNumber, departureCity, arrivalCity, dateTime FROM flight LEFT JOIN aircraft ON flight.aircraft = aircraft.id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.flights = results;
            complete();
        });
    }

    function getFlight(res, mysql, context, id, complete){
        var sql = "SELECT id, flightNum, aircraft, departureCity, arrivalCity, DATE_FORMAT(dateTime, '%Y-%m-%dT%H:%i') AS dateTime FROM flight WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.flight = results[0];
            complete();
        });
    }
    
    function getCrewFlight(res, mysql, context, id, complete){
        var sql = "SELECT fname, lname, flightNum, dateTime FROM crew_member INNER JOIN crew_flight ON crew_member.id = crew_flight.crew_id INNER JOIN flight ON crew_flight.flight_id = flight.id";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.crew_flight = results;
            complete();
        });
    }

    /*Display all flights. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteflight.js", "deleteCrewFlight.js"];
        var mysql = req.app.get('mysql');
        getFlights(res, mysql, context, complete);
        getAircraft(res, mysql, context, complete);
        getCrewFlight(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('flights', context);
            }

        }
    });

    /* Display one flight for the specific purpose of updating that flight */

    router.get('/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedaircraft.js", "updateflight.js"];
        var mysql = req.app.get('mysql');
        getFlight(res, mysql, context, req.params.id, complete);
        getAircraft(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-flight', context);
            }

        }
    });
    
    /* Adds a flight, redirects to the flights page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO flight (flightNum, aircraft, departureCity, arrivalCity, dateTime) VALUES (?,?,?,?,?)";
        var inserts = [req.body.flightNum, req.body.aircraft, req.body.departure, req.body.arrival, req.body.dateTime];
	sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/flights');
            }
        });
    });
    
    /* The URI that update data is sent to in order to update a flight */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE flight SET flightNum=?, aircraft=?, departureCity=?, arrivalCity=?, dateTime=? WHERE id=?";
        var inserts = [req.body.flightNum, req.body.aircraft, req.body.departure, req.body.arrival, req.body.dateTime, req.params.id];
	    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a flight, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM flight WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })
    
    /* Route to delete a flight, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('assignment/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM crew_flight WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
