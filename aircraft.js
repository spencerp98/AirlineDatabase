module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getAircraftTypes(res, mysql, context, complete){
    	mysql.pool.query("SELECT id, manufacturer, model FROM aircraft_type", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.aircraftType = results;
            complete();
        });
    }

    function getAircrafts(res, mysql, context, complete){
        mysql.pool.query("SELECT aircraft.id, type, registrationNumber FROM aircraft", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.aircraft = results;
            complete();
        });
    }

     function getAircraft(res, mysql, context, id, complete){
        var sql = "SELECT id, type, registrationNumber FROM aircraft WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.aircraft = results[0];
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteaircraft.js"];
        var mysql = req.app.get('mysql');
        getAircrafts(res, mysql, context, complete);
        getAircraftTypes(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('aircraft', context);
            }

        }
    });

    router.get('/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedaircraft.js", "updateaircraft.js"];
        var mysql = req.app.get('mysql');
        getCrewMember(res, mysql, context, req.params.id, complete);
        getCrewBases(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-aircraft', context);
            }

        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO aircraft (type, registrationNumber) VALUES (?,?)";
        var inserts = [req.body.type, req.body.registrationNumber];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/aircraft');
            }
        });
    });

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE aircraft SET ttype=?, registrationNumber=? WHERE id=?";
        var inserts = [req.body.type, req.body.registrationNumber, req.params.id];
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

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM aircraftt WHERE id = ?";
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


    