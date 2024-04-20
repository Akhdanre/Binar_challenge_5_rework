var express = require('express');
var router = express.Router(); 
const middlwareAuth = require("../middlewares/auth_middleware")
const accountController = require("../controllers/v1/account_controller")

router.get("/", middlwareAuth, accountController.index)
router.get("/:accountId", middlwareAuth, accountController.show)
router.post("/", middlwareAuth, accountController.create)
router.patch("/balance", middlwareAuth, accountController.upBalance)

module.exports = router;
