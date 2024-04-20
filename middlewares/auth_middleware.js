const jwt = require("jsonwebtoken")
const webResponse = require("../helper/web_response")
const { JWT_SECRET } = process.env


function restricted(req, res, next) {
    let { authorization } = req.headers;
    if (!authorization || !authorization.split(" ")[1]) {
        return webResponse(res, { code: 401, isSucces: false, message: "token not provided" })
    }
    let token = authorization.split(" ")[1]

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return webResponse(res, {
                code: 401,
                isSucces: false,
                message: err.message
            })
        }
        delete user.iat
        req.user = user
        next()
    })

}

module.exports = restricted;