const pool = require("../config/db");

exports.placeBid = async(req,res)=>{
 const {
   tournament_id,
   player_id,
   team_id,
   amount
 } = req.body;

 await pool.query(`
 INSERT INTO bids
 (tournament_id,player_id,team_id,amount)
 VALUES($1,$2,$3,$4)
 `,
 [tournament_id,player_id,team_id,amount]);

 res.json({msg:"Bid Placed"});
};

exports.sellPlayer = async(req,res)=>{
 const {
   tournament_id,
   player_id,
   team_id,
   price
 } = req.body;

 await pool.query("BEGIN");

 try{

 await pool.query(`
 INSERT INTO sold_players
 (tournament_id,player_id,team_id,price)
 VALUES($1,$2,$3,$4)
 `,
 [tournament_id,player_id,team_id,price]);

 await pool.query(`
 UPDATE teams
 SET purse = purse - $1
 WHERE id=$2
 `,
 [price,team_id]);

 await pool.query(`
 UPDATE players
 SET sold=TRUE
 WHERE id=$1
 `,
 [player_id]);

 await pool.query("COMMIT");

 res.json({msg:"Player Sold"});

 }catch(err){
   await pool.query("ROLLBACK");
   res.status(500).json({msg:"Error"});
 }
};

exports.liveResults = async(req,res)=>{
 const {id} = req.params;

 const result = await pool.query(`
 SELECT sp.id,p.name AS player,
 t.name AS team,
 sp.price
 FROM sold_players sp
 JOIN players p ON p.id=sp.player_id
 JOIN teams t ON t.id=sp.team_id
 WHERE sp.tournament_id=$1
 ORDER BY sp.id DESC
 `,
 [id]);

 res.json(result.rows);
};

exports.state = async(req,res)=>{
 const result = await pool.query(
 `SELECT * FROM auction_rooms WHERE tournament_id=$1`,
 [req.params.id]
 );
 res.json(result.rows[0]);
};

exports.history = async(req,res)=>{
 const result = await pool.query(`
 SELECT b.*, t.name team_name
 FROM bids b
 JOIN teams t ON t.id=b.team_id
 WHERE tournament_id=$1
 ORDER BY b.id DESC
 LIMIT 20
 `,[req.params.id]);

 res.json(result.rows);
};

exports.results = async(req,res)=>{
 const result = await pool.query(`
 SELECT sp.price,p.name player,t.name team
 FROM sold_players sp
 JOIN players p ON p.id=sp.player_id
 JOIN teams t ON t.id=sp.team_id
 WHERE sp.tournament_id=$1
 ORDER BY sp.id DESC
 `,[req.params.id]);

 res.json(result.rows);
};