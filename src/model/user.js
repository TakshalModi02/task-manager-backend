const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value<0){
                throw new Error('Age must be positive')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email")
            }
        }
    },
    password: {
        type: String,
        trime: true,
        minLength: 6,
        required: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("Invalid Password")
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true,

        }
    }],
    avatar: {
        type: Buffer 
    }
}, {
    timestamps: true,
})

userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    
    return userObject
}

userSchema.methods.generateAuthToken = async function (){
    const user = this
    
    const token = jwt.sign({_id: user._id.toString()}, process.env.jwt_secret)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({email: email})

    if(!user){
        throw new Error('Email not found!!!')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Incorrect Password');
    }
    
    return user;
}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('deleteOne',{ query: true, document: true }, async function(next){
    const user = this
    
    const ans = await Task.deleteMany({ owner: user._id })
    console.log(ans)
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User