const pool = require("../config/db");

exports.createTeam = async(req,res)=>{
 const {
   tournament_id,name,owner_name,logo,purse,city
 } = req.body;

 const result = await pool.query(`
 INSERT INTO teams
 (tournament_id,name,owner_name,logo,purse,city)
 VALUES($1,$2,$3,$4,$5,$6)
 RETURNING *`,
 [tournament_id,name,owner_name,logo,purse,city]
 );

 res.json(result.rows[0]);
};

exports.getTeams = async(req,res)=>{
 const {id} = req.params;

 const result = await pool.query(`
 SELECT * FROM teams
 WHERE tournament_id=$1
 ORDER BY id ASC`,
 [id]);

 res.json(result.rows);
};