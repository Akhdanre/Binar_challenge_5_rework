const webResponse = require("../../helper/web_response")
const prismaClient = require("@prisma/client").PrismaClient
const prisma = new prismaClient()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = process.env

module.exports = {
    auth: async (req, res, next) => {
        const { email, password } = req.body
        try {
            if(!email || !password){
                return webResponse(res, { code: 400, isSucces: false, message: "email and password require" })
            }
            let user = await prisma.user.findUnique({ where: { email } })
            if (!user) {
                return webResponse(res, { code: 400, isSucces: false, message: "user not registered" })
            }
            let isPasswordCorrect = await bcrypt.compare(password, user.password)
            if (!isPasswordCorrect) {
                return webResponse(res, { code: 400, isSucces: false, message: "check again username and password" })
            }
            delete user.password
            let token = jwt.sign(user, JWT_SECRET)
            return webResponse(res, { data: {...user, token }})
        } catch (err) {
            console.log(err)
            next(err)
        }
    },
}