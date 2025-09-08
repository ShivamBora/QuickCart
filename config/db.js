import mongoose from "mongoose";
let cached = global.mongoose;
if(!cached){
    cached=global.mongoose={ conn: null,promise: null}
}
async function connectDB(){
    if(cached.conn){
        return cached.conn
    }
    if(!cached.promise){
        const opts={
            bufferCommands:false
        }
        const uri = process.env.MONGO_URI;
        if(!uri){
            throw new Error("MONGO_URI is not set");
        }
        cached.promise=mongoose.connect(uri,opts).then(mongoose=>{return mongoose})
    }
    cached.conn=await cached.promise
    return cached.conn
}
export default connectDB