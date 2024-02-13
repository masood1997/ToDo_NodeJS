import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   name :{
    type : String,
    required : true
   },

   email:{
    type : String,
    unique : true,
    required : true,
    lowercase : true
   },

   password:{
    type: String,
    required: true,
    select: false
   },

   createdAt:{
    type: Date,
    default: Date.now
   }

});

const User = mongoose.model("users", userSchema);

export default User;