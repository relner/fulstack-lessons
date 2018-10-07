const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

/*
module.exports.login = function(req, res){
    res.status(200).json({
        login: {
            email: req.body.email,
            password: req.body.password
        }
    })
}

module.exports.register = async function(req, res){

    const user = new User({
        email: req.body.email,
        password: req.body.password
    })

    user.save().then(() => console.log('user created'))

}
*/

module.exports.login = async function(req, res){

    const candidate = await User.findOne({email: req.body.email})

    if(candidate){
        //Check password, user exist
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if(passwordResult){
            //create tocken, password is machets
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 *60})

            res.status(200).json({
                token: `Bearer ${token}`
            })

        } else {
            //bad password
            res.status(401).json({
                message: 'password not mached'
            })
        }
    } else {
        //user does not exist, error
        res.status(404).json({
            message: 'user does not exist'
        })
    }
}

module.exports.register = async function(req, res){

    const candidate = await User.findOne({email: req.body.email})

    if(candidate){
        //user exist in db
        res.status(409).json({
            message: 'User already exist'
        })
    } else {
        //add new user
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password

        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            await user.save()
            res.status(201).json(user)
        } catch (error) {
            
        }
    }
    
}