const webResponse = require("../../helper/web_response")

const prismaClient = require("@prisma/client").PrismaClient
const prisma = new prismaClient()

const bcrypt = require("bcrypt")


module.exports = {
    index: async (req, res, next) => {
        try {
            let users = await prisma.user.findMany()
            if (!users) {
                return webResponse(res, {
                    isSucces: false,
                    code: 404,
                    message: "user data empty"
                })
            }
            return webResponse(res, { data: users })
        } catch (err) {
            next(err)
        }
    },
    show: async (req, res, next) => {
        let id = Number(req.params.userId)
        try {
            if (id) {
                let user = await prisma.user.findUnique({ where: { id } })
                if (!user) {
                    return webResponse(res, {
                        code: 400,
                        isSucces: false,
                        message: `user with id ${id} not found`
                    })
                }
                return webResponse(res, { data: user })
            }
        } catch (err) {
            next(err)
        }
    },

    create: async (req, res, next) => {
        let { name, email, password, address, identify_type, identify_number } = req.body
        try {
            let exist = await prisma.user.findUnique({ where: { email } })
            if (exist) {
                return webResponse(res, {
                    code: 400,
                    isSucces: false,
                    message: "email already used"
                })
            }

            let encryptedPass = await bcrypt.hash(password, 10)
            

            let user = await prisma.user.create({
                data: {
                    email,
                    password : encryptedPass,
                    name,
                    profile: {
                        create: {
                            identify_type,
                            identify_number,
                            address
                        }
                    }
                },
                select: {
                    email: true,
                    name: true,
                    profile: {
                        select: {
                            identify_number: true,
                            identify_type: true,
                            address: true,
                        }
                    }
                }
            })
            if (!user) {
                return webResponse(res, {
                    code: 400,
                    message: "User Register failed"
                })
            }
            return webResponse(res, { data: user })
        } catch (err) {
            // if (err.code == 'P2002') {
            //     return webResponse(res, {
            //         code: 400,
            //         message: "email is already in use",
            //         isSuccess: false
            //     });
            // }
            next(err)
        }
    }
}