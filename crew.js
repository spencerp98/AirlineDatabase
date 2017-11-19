module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCrewBases(res, mysql, context, complete){
        mysql.pool.query("SELECT id, city FROM crew_base", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.crewbase = results;
            complete();
        });
    }

    function getCrewMembers(res, mysql, context, complete){
        mysql.pool.query("SELECT crew_member.id, fname, lname, crew_base.name AS crewbase, role FROM crew_member INNER JOIN crew_base ON crew_member.crewbase = crew_base.id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.crewMembers = results;
            complete();
        });
    }

    function getCrewMember(res, mysql, context, id, complete){
        var sql = "SELECT id, fname, lname, crewbase, role FROM crew_member WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.crewMember = results[0];
            complete();
        });
    }

    /*Display all crew. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js"];
        var mysql = req.app.get('mysql');
        getCrewMembers(res, mysql, context, complete);
        getCrewBases(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('crew', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedcrewbase.js", "updatecrewmember.js"];
        var mysql = req.app.get('mysql');
        getCrewMember(res, mysql, context, req.params.id, complete);
        getCrewBases(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-crew-member', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO bsg_people (fname, lname, crewbase, role) VALUES (?,?,?,?)";
        var inserts = [req.body.fname, req.body.lname, req.body.crewbase, req.body.position];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/crew');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE bsg_people SET fname=?, lname=?, homeworld=?, age=? WHERE id=?";
        var inserts = [req.body.fname, req.body.lname, req.body.homeworld, req.body.age, req.params.id];
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

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

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