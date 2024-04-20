const request = require('supertest')
const app = require("../../app")

let loginData

let email = "akhdanR@gmail.com"
let password = "rahasia"
describe("test GET /api/v1/users", () => {

    beforeAll(async () => {
        let { statusCode, body } = await request(app).post('/api/v1/auth/login').send({ email, password })
        loginData = body.data
    })

    test("test get all users -> success", async () => {
        try {
            let { statusCode, body } = await request(app).get('/api/v1/users').set("authorization", "bearer " + loginData.token)
            expect(statusCode).toBe(200)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body).toHaveProperty('data')
            expect(body.data).notToNull
        } catch (error) {
            expect(error).toBe("error")
        }
    })
    test("test get users by id -> success", async () => {
        try {
            let { statusCode, body } = await request(app).get('/api/v1/users/' + loginData.id).set("authorization", "bearer " + loginData.token)
            expect(statusCode).toBe(200)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body).toHaveProperty('data')
            expect(body.data).notToNull
            expect(body.data.email).toBe(email)
        } catch (error) {
            expect(error).toBe("error")
        }
    })
    test("test get users by id but not data registered-> success", async () => {
        try {
            let { statusCode, body } = await request(app).get('/api/v1/users/100').set("authorization", "bearer " + loginData.token)
            expect(statusCode).toBe(400)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body).toHaveProperty('data')
            expect(body.message).toBe('user not found')
        } catch (error) {
            expect(error).toBe("error")
        }
    })
})