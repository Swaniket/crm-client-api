const express = require('express')
const router = express.Router()

router.all('/', (req, res, next) => {
    res.json({ message: "Return from user router"})
})

// Create user account
router.post("/", (req, res) => {
    res.json(req.body)
})

module.exports = router