var mongoose = require('mongoose');
var validator = require('validator')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')


var Schema = mongoose.Schema;

var userSchema = new Schema({

    //DANE OSOBISTE
    login:{type:String,required:true,trim:true,unique:true,maxlength:20,minlength:3},
    userPhoto:{type:String,default:"https://s3.amazonaws.com/kayjay/users/0/image.jpg"},
    email:{type:String,required:true,unique:true,trim:true,validate(value){
        if(!validator.isEmail(value)){
            throw new Error('Please enter proper format of email!')
        }
    }},
    password:{type:String,required:true,trim:true},
    admin:{type:Boolean,default:false},
    name:{type:String,minlength:3,trim:true,default:'Dawid'},
    surname:{type:String,minlength:3,trim:true},
    city:{type:String},
    street:{type:String,trim:true},
    numberOfHome:{type:Number},
    postalCode:{type:Number},
    displayData:{type:Boolean,default:true},
    displayDataForUnknown:{type:Boolean,default:true},
    invitations:{type:String,enum:['Wszyscy','Nikt','Znajomi znajomych'],default:'Wszyscy'},
    listOfFriends:{type:String,enum:['Wszyscy','Znajomi','Znajomi znajomych','Nikt'],default:'Wszyscy'},
    numberOfFriends:{type:Number},
    friendsInvitation:[{
      friendInvitation:{type: Schema.Types.ObjectId,
        ref:'User'
        }
    }],
    friends:[{
      friend:{type: Schema.Types.ObjectId,
        ref:'User'
        }
    }],

    //SKLEP
    shoppingCartTotalPrice:{type:Number,default:0},
    shoppingCartTotalQuantity:{type:Number,default:0},
    shoppingCart:[{
      totalPrice:{type:Number,default:0},
      totalQuantity:{type:Number,default:0},
      product:{type: Schema.Types.ObjectId,
      ref:'Watch'
      }}],
    favorite:[{
      favoriteProduct:{type: Schema.Types.ObjectId,
        ref:'Watch'
      }
    }],
    wishList:[{
      wishProduct:{type: Schema.Types.ObjectId,
        ref:'Watch'
      }
    }],
    tokens:[{
      token:{type:String}
    }],

    //FORUM
    posts:[{
      post:{type:String},
      postDate:{type:Date},
      postLikes:{type:Number},
      postUnlikes:{type:Number}
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