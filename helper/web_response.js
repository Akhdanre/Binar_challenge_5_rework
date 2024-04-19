
function webResponse(res, { code = 200, isSucces = true, message = "Success", data = null }) {
    return res.status(code).json({
        status: isSucces,
        message: message,
        data: data
    })
}

module.exports = webResponse