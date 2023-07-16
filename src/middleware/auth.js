const jwt = require('jsonwebtoken')
const User = require('../model/user')

const auth = async (req, res, next)=>{
    try     {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.jwt_secret)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error('User may not logged in or User may not exists!!')
        }
        req.token = token
        req.user = user
        next()
    }catch(e){
        console.log(e)
        return res.status(401).send({
            "error": "Please Authenticate!"
        })
    }
}

module.exports = auth;