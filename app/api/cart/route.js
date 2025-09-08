export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "@/models/User";

export async function GET() {
    try{
        const { userId } = auth();
        console.log('[API /api/cart][GET] userId=', userId)
        if(!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const user = await User.findById(userId).lean();
        const cartItems = user?.cartItems || {};
        console.log('[API /api/cart][GET] cartItems keys=', Object.keys(cartItems||{}).length)
        return NextResponse.json({ cartItems });
    }catch(err){
        console.error('[API /api/cart][GET] error', err)
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// Replace entire cart
export async function PUT(request){
    try{
        const { userId } = auth();
        console.log('[API /api/cart][PUT] userId=', userId)
        if(!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const { cartItems } = body || {};
        if(typeof cartItems !== 'object' || cartItems === null){
            return NextResponse.json({ error: "cartItems must be an object" }, { status: 400 });
        }
        await connectDB();
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { cartItems } },
            { new: true, upsert: true }
        );
        console.log('[API /api/cart][PUT] saved keys=', Object.keys(user.cartItems||{}).length)
        return NextResponse.json({ cartItems: user.cartItems });
    }catch(err){
        console.error('[API /api/cart][PUT] error', err)
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// Update a single item quantity: { itemId, quantity }
export async function PATCH(request){
    try{
        const { userId } = auth();
        console.log('[API /api/cart][PATCH] userId=', userId)
        if(!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const { itemId, quantity } = body || {};
        if(!itemId || typeof quantity !== 'number'){
            return NextResponse.json({ error: "itemId and numeric quantity required" }, { status: 400 });
        }
        await connectDB();
        const doc = await User.findByIdAndUpdate(
            userId,
            { $setOnInsert: { cartItems: {} } },
            { new: true, upsert: true }
        );
        const current = doc.cartItems || {};
        if(quantity <= 0){
            delete current[itemId];
        } else {
            current[itemId] = quantity;
        }
        doc.cartItems = current;
        await doc.save();
        console.log('[API /api/cart][PATCH] itemId=', itemId, 'quantity=', quantity, 'totalKeys=', Object.keys(doc.cartItems||{}).length)
        return NextResponse.json({ cartItems: doc.cartItems });
    }catch(err){
        console.error('[API /api/cart][PATCH] error', err)
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}


