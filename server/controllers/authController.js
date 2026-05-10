const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO allusers(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,role`,
      [name, email, hash, role]
    );

    const token = jwt.sign(
      { id: result.rows[0].id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ user: result.rows[0], token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating user" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(`SELECT * FROM allusers WHERE email=$1`, [email]);

    if (user.rows.length === 0) return res.status(400).json({ msg: "User not found" });

    const valid = await bcrypt.compare(password, user.rows[0].password);

    if (!valid) return res.status(400).json({ msg: "Wrong Password" });

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: user.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Database error" });
  }
};
