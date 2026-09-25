const bcrypt = require("bcrypt");
const connection = require("../database");
const jwt = require("jsonwebtoken");

const login = (email, password, callback) => {
  const sql = `
        SELECT id_users, username, email, password
        FROM users
        WHERE email = ?
    `;

  connection.query(sql, [email], (error, results) => {
    if (error) {
      return callback(error);
    }

    if (results.length === 0) {
      return callback(null, null);
    }

    const user = results[0];

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return callback(null, null);
    }

    const token = jwt.sign(
      {
        id_users: user.id_users,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    callback(null, {
      user: {
        id_users: user.id_users,
        username: user.username,
        email: user.email,
      },
      token,
    });
  });
};

module.exports = {
  login,
};
