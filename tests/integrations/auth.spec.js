const request = require('supertest')
const app = require("../../app")

const { deleteUsers } = require("../../controllers/v1/user_controller")


describe("test POST /api/v1/auth/register", () => {
    let email = "akhdanR@gmail.com"
    let name = "akhdan"
    let password = "rahasia"
    let address = "jl lokannata"
    let identify_number = 23
    let identify_type = "bank"

    beforeAll(async () => {
        await deleteUsers()
    })

    test("test email belum terdaftar -> success", async () => {
        try {
            let { statusCode, body } = await request(app).post('/api/v1/auth/register').send({ name, email, password, address, identify_type, identify_number })

            expect(statusCode).toBe(200)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body).toHaveProperty('data')
            expect(body.data).toHaveProperty('email')
            expect(body.data).toHaveProperty('name')
            expect(body.data).toHaveProperty('profile')
            expect(body.data.profile).toHaveProperty('identify_number')
            expect(body.data.profile).toHaveProperty('identify_type')
            expect(body.data.name).toBe(name)
            expect(body.data.email).toBe(email)
        } catch (error) {
            console.log(error)
            expect(error).toBe("error")
        }
    })
    test("test email sudah terdaftar -> failed", async () => {
        try {
            let { statusCode, body } = await request(app).post('/api/v1/auth/register').send({ name, email, password, address, identify_type, identify_number })

            expect(statusCode).toBe(400)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body.message).toBe("email already used")
        } catch (error) {
            expect(error).toBe("error")
        }
    })
})

describe("test POST /api/v1/auth/login", () => {
    let email = "akhdanR@gmail.com"
    let password = "rahasia"

    test("test login email terdaftar -> success", async () => {
        try {
            let { statusCode, body } = await request(app).post('/api/v1/auth/login').send({ email, password })

            expect(statusCode).toBe(200)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body).toHaveProperty('data')
            expect(body.data).toHaveProperty('email')
            expect(body.data).toHaveProperty('name')
            expect(body.data).toHaveProperty('token')
        } catch (error) {
            expect(error).toBe("error")
        }
    })
    test("test email tida terdaftar -> failed", async () => {
        try {
            let { statusCode, body } = await request(app).post('/api/v1/auth/login').send({ email: "salah@gmail.com", password })
            expect(statusCode).toBe(400)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body).toHaveProperty('data')
            expect(body.message).toBe('user not registered')
        } catch (error) {
            expect(error).toBe("error")
        }
    })
    test("test email tida terdaftar -> failed", async () => {
        try {
            let { statusCode, body } = await request(app).post('/api/v1/auth/login').send({ email, password: "salah" })
            expect(statusCode).toBe(400)
            expect(body).toHaveProperty('status')
            expect(body).toHaveProperty('message')
            expect(body).toHaveProperty('data')
            expect(body.message).toBe('check again username and password')
        } catch (error) {
            expect(error).toBe("error")
        }
    })
})
