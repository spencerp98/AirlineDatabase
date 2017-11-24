module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getAircraft(res, mysql, context, complete){
        mysql.pool.query("SELECT id, registrationNumber FROM aircraft", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.crewbase = results;
            complete();
        });
    }

    function getFlights(res, mysql, context, complete){
        mysql.pool.query("SELECT flight.id, flightNum, registrationNumber, departureCity, arrivalCity, dateTime FROM flight LEFT JOIN aircraft ON flight.aircraft = aircraft.id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.crew_member = results;
            complete();
        });
    }

    function getFlight(res, mysql, context, id, complete){
        var sql = "SELECT flight.id, flightNum, aircraft, departureCity, arrivalCity, dateTime FROM flight WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.crew_member = results[0];
            complete();
        });
    }

    /*Display all flights. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteflight.js"];
        var mysql = req.app.get('mysql');
        getFlights(res, mysql, context, complete);
        getAircraft(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('flights', context);
            }

        }
    });

    /* Display one flight for the specific purpose of updating that flight */

    router.get('/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectaircraft.js", "updateflight.js"];
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
/*********************************************************/
    /* Adds a crew_member, redirects to the crew page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO crew_member (fname, lname, crewbase, role) VALUES (?,?,?,?)";
        var inserts = [req.body.fname, req.body.lname, req.body.crewMemberBase, req.body.position];
	sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/crew');
            }
        });
    });

    /* The URI that update data is sent to in order to update a crew_member */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE crew_member SET fname=?, lname=?, crewbase=?, role=? WHERE id=?";
        var inserts = [req.body.fname, req.body.lname, req.body.crewbase, req.body.role, req.params.id];
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

    /* Route to delete a crew_member, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM crew_member WHERE id = ?";
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
