var mongoose = require('mongoose');
var validator = require('validator')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')


var Schema = mongoose.Schema;

var userSchema = new Schema({

    login:{type:String,required:true,trim:true,unique:true,maxlength:20,minlength:3},
    email:{type:String,required:true,unique:true,trim:true,validate(value){
        if(!validator.isEmail(value)){
            throw new Error('Please enter proper format of email!')
        }
    }},
    password:{type:String,required:true,trim:true,minlength:6},
    admin:{type:Boolean,default:false},
    name:{type:String,minlength:3,trim:true},
    surname:{type:String,minlength:3,trim:true},
    city:{type:String},
    street:{type:String,trim:true},
    numberOfHome:{type:Number},
    postalCode:{type:Number},
    shoppingCartTotalPrice:{type:Number,default:0},
    shoppingCartTotalQuantity:{type:Number,default:0},
    shoppingCart:[{
      totalPrice:{type:Number,default:0},
      totalQuantity:{type:Number,default:0},
      product:{type: Schema.Types.ObjectId,
      ref:'Watch'
      }}],
    tokens:[{
      token:{type:String}
    }]

});

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'thisis')
    user.tokens = user.tokens.concat({token})
      await user.save()
    return token
  }
  
  userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    if(!user) {
        throw new Error('There is no user')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
      throw new Error('There is no match bitch')
  }
  return user
  }
  
  userSchema.pre('save',async function(next){
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
  })

var User = mongoose.model('User', userSchema);


module.exports = User