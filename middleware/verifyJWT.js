const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const authHeaders = req.headers.authorization || req.headers.authorization

    if (!authHeaders?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorization' })
    }

    const token = authHeaders.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ status: "Forbidden", message: 'Forbidden' })
        req.user = decoded;
        next();
    })
}

module.exports = verifyJWT