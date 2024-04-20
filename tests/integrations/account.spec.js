const request = require('supertest')
const app = require("../../app")

let loginData
let idAccount
describe("test POST /api/v1/accounts", () => {

    beforeAll(async () => {
        let email = "akhdanR@gmail.com"
        let password = "rahasia"
        let { statusCode, body } = await request(app).post('/api/v1/auth/login').send({ email, password })
        loginData = body.data
    })

    test("test post account -> success", async () => {
        let user_id = loginData.id
        let bank_name = "mandiri"
        let bank_account_number = 909234
        try {
            let { statusCode, body } = await request(app).post('/api/v1/accounts').send({ user_id, bank_name, bank_account_number }).set("authorization", "bearer " + loginData.token)
            expect(statusCode).toBe(200)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body).toHaveProperty('data')
            idAccount = body.data.id
        } catch (error) {
            expect(error).toBe("error")
        }
    })

    test("test get account -> success", async () => {
        try {
            let { statusCode, body } = await request(app).get('/api/v1/accounts').set("authorization", "bearer " + loginData.token)
            expect(statusCode).toBe(200)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body).toHaveProperty('data')
            expect(body.data).notToNull
        } catch (error) {
            expect(error).toBe("error")
        }
    })
    test("test get account by id -> success", async () => {
        try {
            let { statusCode, body } = await request(app).get('/api/v1/accounts/' + idAccount).set("authorization", "bearer " + loginData.token)
            expect(statusCode).toBe(200)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body).toHaveProperty('data')
            expect(body.data).notToNull
        } catch (error) {
            expect(error).toBe("error")
        }
    })
    
    test("test post balance by id -> success", async () => {
        let balance_transaction = 1000000
        try {
            let { statusCode, body } = await request(app).patch('/api/v1/accounts/balance').send({ user_id: idAccount, balance_transaction }).set("authorization", "bearer " + loginData.token)
            expect(statusCode).toBe(200)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body).toHaveProperty('data')
            expect(body.data).notToNull
        } catch (error) {
            expect(error).toBe("error")
        }
    })
})