import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "@/models/User";

export async function GET() {
    try{
        const { userId } = auth();
        if(!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const user = await User.findById(userId).lean();
        const cartItems = user?.cartItems || {};
        return NextResponse.json({ cartItems });
    }catch(err){
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// Replace entire cart
export async function PUT(request){
    try{
        const { userId } = auth();
        if(!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const { cartItems } = body || {};
        if(typeof cartItems !== 'object' || cartItems === null){
            return NextResponse.json({ error: "cartItems must be an object" }, { status: 400 });
        }
        await connectDB();
        const user = await User.findById(userId);
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        user.cartItems = cartItems;
        await user.save();
        return NextResponse.json({ cartItems: user.cartItems });
    }catch(err){
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// Update a single item quantity: { itemId, quantity }
export async function PATCH(request){
    try{
        const { userId } = auth();
        if(!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const { itemId, quantity } = body || {};
        if(!itemId || typeof quantity !== 'number'){
            return NextResponse.json({ error: "itemId and numeric quantity required" }, { status: 400 });
        }
        await connectDB();
        const doc = await User.findById(userId);
        if(!doc){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const current = doc.cartItems || {};
        if(quantity <= 0){
            delete current[itemId];
        } else {
            current[itemId] = quantity;
        }
        doc.cartItems = current;
        await doc.save();
        return NextResponse.json({ cartItems: doc.cartItems });
    }catch(err){
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}


