var mongoose = require('mongoose');
var validator = require('validator')

var Schema = mongoose.Schema;

var watchSchema = new Schema({

    watchMark:{type:String,required:[true,'Enter mark of watch !'],trim:true},
    watchPrice:{type:Number,required:[true,'Enter price of watch !'],trim:true,validate(value) {
        if(value <= 0) {
            throw new Error('Price cannot be lower than 0 !')
        }
    }},
    watchSex:{type:String,required:[true,'Enter sex of watch !'],trim:true,enum:['Mężczyzna','Kobieta']},
    watchGlass:{type:String,required:true,trim:true,enum:['Mineralne','Szafirowe']},
    watchMechanism:{type:String,required:true,trim:true,enum:['Kwarcowy','Solarny']},
    watchEnvelopeMaterial:{type:String,required:true,trim:true},
    watchBeltMaterial:{type:String,required:true,trim:true},
    watchStyle:{type:String,required:true,trim:true},
    watchCollection:{type:String,required:true,trim:true},
    watchBeltColor:{type:String,required:true,trim:true},
    watchShieldColor:{type:String,required:true,trim:true},
    watchEnvelopeColor:{type:String,required:true,trim:true},
    watchWaterproof:{type:Boolean,required:true,trim:true},
    watchWidth:{type:Number,required:true,trim:true,validate(value) {
        if(value <= 0) {
            throw new Error('Value cannot be less or equal 0 !')
        }
    }},
    watchHeight:{type:Number,required:true,trim:true,validate(value) {
        if(value <= 0) {
            throw new Error('Value cannot be less or equal 0 !')
        }
    }},
    watchThickness:{type:Number,required:true,trim:true,validate(value) {
        if(value <= 0) {
            throw new Error('Value cannot be less or equal 0 !')
        }
    }},
    watchDiameter:{type:Number,required:true,trim:true,validate(value) {
        if(value <= 0) {
            throw new Error('Value cannot be less or equal 0 !')
        }
    }},
    watchPhotos:[{type:String}],
    comments:[{
        comment:{type:String,required:[true,'Comment is required !'],trim:true,minlength:2,validate(value) {
            if(validator.isEmpty(value)) {
                throw new Error('There is no comment !')
            }
        }},
        commentDate:{type:Date,default:Date.now},
        commentRatio:{type:Number,default:2.5,min:0,max:5},
        postedBy:{type:Schema.Types.ObjectId,
            ref:"User",
            required:true
          },
    }]
})

var Watch = mongoose.model('Watch', watchSchema);

module.exports = Watch