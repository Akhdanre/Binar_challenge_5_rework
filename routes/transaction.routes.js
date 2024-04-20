var express = require('express');
var router = express.Router();
const middlwareAuth = require("../middlewares/auth_middleware")
const transactionController = require("../controllers/v1/transaction_controller")

router.get("/", middlwareAuth, transactionController.index)
router.get("/:id", middlwareAuth, transactionController.show)
router.post("/", middlwareAuth, transactionController.create)


module.exports = router;
