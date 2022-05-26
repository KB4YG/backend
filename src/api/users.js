const { Router } = require('express')
const bcrypt = require('bcryptjs')
const { ValidationError } = require('sequelize')

const { User, UserClientFields } = require('../models/user')
const { requireAuthentication, generateAuthToken } = require('../lib/auth')

const router = Router()

/*
 * Create a new user
 */
router.post('/', requireAuthentication, async function (req, res, next) {
    if (!req.body || !req.body.name || !req.body.email || !req.body.password ) {
        next()
    } else {
        req.body.password = await bcrypt.hash(req.body.password, 8)

        try {
            const user = await User.create(req.body, UserClientFields)
            res.status(201).send({ id: user.id })
        } catch (e) {
            if (e instanceof ValidationError) {
                res.status(400).send({ error: e.message})
            } else {
                throw e
            }
        }
    }
})

/*
 * Log in a user
 */
router.post('/login', async function (req, res) {
    if (req.body && req.body.id && req.body.password) {
        const user = await User.findByPk(req.body.id)
        const isAuthenticated = user && await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (isAuthenticated) {
            const token = generateAuthToken(req.body.id)
            res.status(200).send({ token: token })
        } else {
            res.status(401).send({
                error: "Invalid credentials"
            })
        }
    } else {
        res.status(400).send({
            error: "Request needs user ID and password"
        })
    }
})

/*
 * Get information for the currently logged in user
 */
router.get('/', requireAuthentication, async function (req, res) {
    console.log("== req.user:", req.user)
    const user = await User.findByPk(parseInt(req.user))
    res.status(200).send(user)
})