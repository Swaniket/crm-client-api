const express = require('express')
const router = express.Router()

router.all('/', (req, res, next) => {
    res.json({ message: "Return from ticket router"})
})

module.exports = router