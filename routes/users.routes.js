var express = require('express');
var router = express.Router();
const userController = require("../controllers/v1/user_controller")
const middlwareAuth = require("../middlewares/auth_middleware")


router.get("/", middlwareAuth, userController.index)
router.get("/:userId", middlwareAuth, userController.show)

module.exports = router;
