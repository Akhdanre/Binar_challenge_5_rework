const webResponse = require("../../helper/web_response")

const prismaClient = require("@prisma/client").PrismaClient
const prisma = new prismaClient()

module.exports = {
    index: async (req, res, next) => {
        try {
            let transactions = await prisma.transaction.findMany()
            return webResponse(res, {
                data: transactions,
            })
        } catch (err) {
            next(err)
        }
    },
    show: async (req, res, next) => {
        let id = req.params.id
        try {
            id = Number(id)
            let transaction = await prisma.transaction.findUnique({ where: { id } })
            if (!transaction) {
                return webResponse(res, {
                    code: 400,
                    message: "BAD REQUEST",
                    isSucces: false
                })
            }
            return webResponse(res, {
                data: transaction
            })
        } catch (err) {
            next(err)
        }

    },
    create: async (req, res, next) => {
        let { source_account_id, destination_account_id, amount } = req.body

        try {
            let sourceData = await prisma.bankAccount.findUnique({
                where: {
                    id: source_account_id
                },
                select: {
                    id: true,
                    balance: true,
                    bank_name: true,
                }
            })
            let destinationData = await prisma.bankAccount.findUnique({
                where: {
                    id: destination_account_id
                }, select: {
                    id: true,
                    balance: true,
                    bank_name: true,
                }
            })

            if (!sourceData && !destinationData) {
                return webResponse(res, {
                    code: 400,
                    message: "user not registered",
                    isSucces: false
                })
            }

            if (sourceData.balance <= amount) {
                return webResponse(res, {
                    code: 400,
                    message: "your balance is low",
                    isSucces: false
                })
            }
            let [transaction, sourceNew, destinationNew] = await prisma.$transaction(
                [
                    prisma.transaction.create({
                        data: {
                            sourceAccount: {
                                connect: {
                                    id: source_account_id
                                }
                            },
                            destinationAccount: {
                                connect: {
                                    id: destination_account_id,
                                }
                            },
                            amount: amount,
                        }
                    }),
                    prisma.bankAccount.update({
                        data: {
                            balance: (sourceData.balance - amount)
                        },
                        where: {
                            id: sourceData.id
                        }
                    }),
                    prisma.bankAccount.update({
                        data: {
                            balance: (destinationData.balance + amount)
                        },
                        where: {
                            id: destinationData.id
                        }
                    }),

                ]
            )

            if (!transaction && !sourceNew && !destinationNew) {
                return webResponse(res, {
                    code: 400,
                    message: "BAD REQUEST",
                    isSucces: false
                })
            }

            return webResponse(res, {
                data: transaction
            })
        } catch (err) {
            console.log(err)
            next(err)
        }

    }
}