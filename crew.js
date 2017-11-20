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
        mysql.pool.query("SELECT crew_member.id, fname, lname, crew_base.city AS crewbase, role FROM crew_member LEFT JOIN crew_base ON crew_member.crewbase = crew_base.id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.crew_member = results;
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
            context.crew_member = results[0];
            complete();
        });
    }

    /*Display all crew. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecrew.js"];
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

    /* Display one crew_member for the specific purpose of updating that crew_member */

    router.get('/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedcrewbase.js", "updatecrew.js"];
        var mysql = req.app.get('mysql');
        getCrewMember(res, mysql, context, req.params.id, complete);
        getCrewBases(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-crew', context);
            }

        }
    });

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
