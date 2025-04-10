const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/profile", protect, authController.getProfile);
router.get("/users", protect, userController.getAllUsers);
router.get("/users/:id", protect, userController.getUserById);
router.put("/users/:id", protect, userController.updateUser);
router.delete("/users/:id", protect, userController.deleteUser);

module.exports = router;
