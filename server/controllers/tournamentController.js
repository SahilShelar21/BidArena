const pool = require("../config/db");

exports.createTournament = async (req, res) => {
  try {
    const {
      name,
      sport,
      auction_date,
      max_teams,
      purse,
      min_increment,
    } = req.body;

    // uploaded file path
    const logo = req.file
      ? req.file.filename
      : null;

    const result = await pool.query(
      `
      INSERT INTO tournaments
      (name,sport,logo,auction_date,max_teams,purse,min_increment)
      VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        name,
        sport,
        logo,
        auction_date,
        max_teams,
        purse,
        min_increment,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getTournaments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM tournaments
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};