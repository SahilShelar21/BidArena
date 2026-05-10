const pool = require("../config/db");

exports.createTournament = async(req,res)=>{
 const {
   name,sport,logo,auction_date,max_teams,purse,min_increment
 } = req.body;

 const result = await pool.query(`
 INSERT INTO tournaments
 (name,sport,logo,auction_date,max_teams,purse,min_increment)
 VALUES($1,$2,$3,$4,$5,$6,$7)
 RETURNING *`,
 [name,sport,logo,auction_date,max_teams,purse,min_increment]
 );

 res.json(result.rows[0]);
};

exports.getTournaments = async(req,res)=>{
 const result = await pool.query(`
 SELECT * FROM tournaments
 ORDER BY id DESC
 `);

 res.json(result.rows);
};