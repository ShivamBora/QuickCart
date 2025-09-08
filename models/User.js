import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    _id:{type: String,required:true},
    name:{type:String},
    email:{type: String},
    cartItems:{type: Object,default:{}},
    imageUrl:{type: String}

},{minimize:false})
const User=mongoose.models.user||mongoose.model('user',userSchema)
export default User