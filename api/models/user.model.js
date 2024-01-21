import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true, // As No two users can have same userName
    },
    password : {
        type : String,
        required : true,
    },
    },
    {timestamps : true} // This will help us manage our timestamps

)

const User = mongoose.model('User' , userSchema);

export default User;