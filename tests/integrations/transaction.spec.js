const request = require('supertest')
const app = require("../../app")

let loginData
let user2


let idTransaction
describe("test POST /api/v1/transaction", () => {

    beforeAll(async () => {
        let email = "akhdanR@gmail.com";
        let password = "rahasia";
        let emailReg = "akeon@gmail.com";
        let name = "oukenzeumasio";
        let passwordReg = "rahasia";
        let address = "jl lokannata";
        let identify_number = 24;
        let identify_type = "bank";

        let { statusCode: statusCodeLogin, body: bodyLogin } = await request(app)
            .post('/api/v1/auth/login')
            .send({ email, password })
        loginData = bodyLogin.data

        let { statusCode: statusCodeRegister, body: bodyRegister } = await request(app)
            .post('/api/v1/auth/register')
            .send({ name, email: emailReg, password: passwordReg, address, identify_type, identify_number })

        let { statusCode: statusCodeLogin2, body: bodyLogin2 } = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: emailReg, password: passwordReg })
        user2 = bodyLogin2.data
        let user_id = user2.id
        let bank_name = "mandiri"
        let bank_account_number = 909237
        let balance_transaction = 10000
        let { statusCode: statusCodeAcc, body: bodyAcc } = await request(app).post('/api/v1/accounts').send({ user_id, bank_name, bank_account_number }).set("authorization", "bearer " + loginData.token)
        // let { statusCode, body } = await request(app).patch('/api/v1/accounts/balance').send({ user_id: bodyAcc.id, balance_transaction }).set("authorization", "bearer " + loginData.token)
   
    });


    test("test post Transaction -> success", async () => {
        let source_account_id = 1
        let destination_account_id = 2
        let amount = 200000
        try {
            let { statusCode, body } = await request(app).post('/api/v1/transaction').send({ source_account_id, destination_account_id, amount }).set("authorization", "bearer " + loginData.token)
            console.log(body)
            expect(statusCode).toBe(200)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body).toHaveProperty('data')
            idTransaction = body.data.id
        } catch (error) {
            expect(error).toBe("error")
        }
    })

    test("test get transaction -> success", async () => {
        try {
            let { statusCode, body } = await request(app).get('/api/v1/transaction').set("authorization", "bearer " + loginData.token)
            expect(statusCode).toBe(200)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body).toHaveProperty('data')
        } catch (error) {
            expect(error).toBe("error")
        }
    })
    test("test get account by id -> success", async () => {
        try {
            let { statusCode, body } = await request(app).get('/api/v1/transaction/' + idTransaction).set("authorization", "bearer " + loginData.token)
            expect(statusCode).toBe(200)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body).toHaveProperty('data')
        } catch (error) {
            expect(error).toBe("error")
        }
    })
})