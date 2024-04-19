const prismaClient = require("@prisma/client").PrismaClient
const prisma = new prismaClient()
const webResponse = require("../../helper/web_response")


module.exports = {
    index: async (req, res, next) => {
        try {
            let bankAccounts = await prisma.bankAccount.findMany()
            return webResponse(res, {
                data: bankAccounts
            })
        } catch (err) {
            next(err)
        }
    },
    show: async (req, res, next) => {
        let id = Number(req.params.accountId)
        try {
            let bankAccount = await prisma.bankAccount.findUnique({ where: { id } })
            if (!bankAccount) {
                return webResponse(res, {
                    code: 400,
                    isSucces: false,
                    message: "user not registered"
                })
            }
            return webResponse(res, {
                data: bankAccount
            })
        } catch (err) {
            next(err)
        }
    },
    create: async (req, res, next) => {
        let { user_id, bank_name, bank_account_number } = req.body
        try {
            let bankAccount = await prisma.bankAccount.create({
                data: {
                    user_id,
                    bank_name,
                    bank_account_number,
                    balance: 0
                }
            })
            if (!bankAccount) {
                return webResponse(res, {
                    code: 400,
                    message: "bad request",
                    isSucces: false
                })
            }
            return webResponse(res, {
                data: bankAccount
            })
        } catch (err) {
            if (err.code == 'P2003') {
                return webResponse(res, {
                    code: 400,
                    message: "User not found",
                    isSuccess: false
                });
            }
            next(err)
        }
    },
    upBalance: async (req, res, next) => {
        let { user_id, balance_transaction } = req.body
        try {
            let bankAccount = await prisma.bankAccount.findUnique({ where: { id: user_id } })

            if (!bankAccount) {
                return webResponse(res, {
                    code: 400,
                    isSucces: false,
                    message: "user not registered"
                })
            }

            let updatebankAccount = await prisma.bankAccount.update({
                data: {
                    balance: (bankAccount.balance + balance_transaction)
                }, where: {
                    id: user_id
                }
            })
            if (!updatebankAccount) {
                return webResponse(res, {
                    code: 400,
                    message: "bad request",
                    isSucces: false
                })
            }
            return webResponse(res, {
                data: updatebankAccount
            })
        } catch (err) {
            if (err.code == 'P2003') {
                return webResponse(res, {
                    code: 400,
                    message: "User not found",
                    isSuccess: false
                });
            }
            next(err)
        }
    },

}

