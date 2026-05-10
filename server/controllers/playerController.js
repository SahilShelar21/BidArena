const pool = require("../config/db");

exports.createPlayer = async(req,res)=>{
 const {
 tournament_id,name,photo,age,role,category,base_price,country
 } = req.body;

 const result = await pool.query(`
 INSERT INTO players
 (tournament_id,name,photo,age,role,category,base_price,country)
 VALUES($1,$2,$3,$4,$5,$6,$7,$8)
 RETURNING *`,
 [tournament_id,name,photo,age,role,category,base_price,country]
 );

 res.json(result.rows[0]);
};

exports.getPlayers = async(req,res)=>{
 const {id} = req.params;

 const result = await pool.query(`
 SELECT * FROM players
 WHERE tournament_id=$1
 ORDER BY sold ASC,id ASC`,
 [id]);

 res.json(result.rows);
};