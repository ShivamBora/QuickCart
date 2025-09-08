import { Inngest } from "inngest";
import connectDB from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "borashivam" });
//ingest function 
export const syncUserCreation=inngest.createFunction(
    {
        id:'sysn-user-from-clerk'
    },
    {event: 'clerk/user.created'},
    async({event})=>{
        const{id,first_name,last_name,email_addresses,image_url}=event.data
        const userData={
            _id:id,
            email:email_addresses[0].email_addresses,
            name:first_name+' '+last_name,
            imageUrl:image_url
        }
        await connectDB()
        await User.create(userData)
    }
)
export const syncUserUpdation=inngest.createFunction(
    {
        id:'update-user-from-client'
    },
    {
        event:'cler/user.updated'
    },
    async({event})=>{
        const{id,first_name,last_name,email_addresses,image_url}=event.data
        const userData={
            _id:id,
             email:email_addresses[0].email_addresses,
            name:first_name+' '+last_name,
            imageUrl:image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id,userData)
    }
)
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'
    },
    {
        event: 'clerk/user.deleted'
    },
    async({event})=>{
        const {id}=event.data
        await connectDB()
        await User.findByIdAndDelete(id)
    }
)