const authController = require("../controllers/v1/auth_controller")
const userController = require("../controllers/v1/user_controller")



const routes = require("express").Router()

routes.post("/auth/login", authController.auth)
routes.post("/auth/register", userController.create)

module.exports = routes