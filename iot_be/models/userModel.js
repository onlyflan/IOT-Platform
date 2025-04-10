const db = require("../db/database");
const bcrypt = require("bcryptjs");

const User = {
  register: async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    return db.execute(sql, [username, email, hashedPassword]);
  },

  findByEmail: async (email) => {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows.length > 0 ? rows[0] : null;
  },

  findById: async (id) => {
    const [rows] = await db.execute(
      "SELECT id, username, email FROM users WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  getAllUsers: async () => {
    const [rows] = await db.execute("SELECT id, username, email FROM users");
    return rows;
  },

  updateUser: async (id, username, email, password) => {
    let sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
    let params = [username, email, id];

    // Nếu có password mới, băm lại và cập nhật
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql =
        "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?";
      params = [username, email, hashedPassword, id];
    }

    const [result] = await db.execute(sql, params);
    return result.affectedRows;
  },

  deleteUser: async (id) => {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows;
  },
};

module.exports = User;
