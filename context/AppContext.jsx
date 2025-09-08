'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()
const {user,isLoaded,isSignedIn}=useUser()
    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(true)
    const [cartItems, setCartItems] = useState({})

    const fetchProductData = async () => {
        setProducts(productsDummyData)
    }

    const fetchUserData = async () => {
        setUserData(userDummyData)
    }

    const addToCart = async (itemId) => {

        console.log(`[Cart] Adding item`, { itemId });
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        // persist to server if authenticated
        try{
            if(user){
                const res = await fetch('/api/cart',{
                    method:'PATCH',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({ itemId, quantity: cartData[itemId] }),
                    cache:'no-store',
                    credentials:'include'
                })
                if(res.ok){
                    console.log('[Cart] Server acknowledged add', { itemId })
                }
            }
        }catch(err){
            console.error('Failed to persist cart item', err)
        }

    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)
        try{
            if(user){
                await fetch('/api/cart',{
                    method:'PATCH',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({ itemId, quantity }),
                    cache:'no-store',
                    credentials:'include'
                })
            }
        }catch(err){
            console.error('Failed to persist cart update', err)
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [])

    // Load cart from server when user logs in
    useEffect(() => {
        const loadCart = async () => {
            if(!isLoaded){
                return;
            }
            if(!isSignedIn){
                setCartItems({})
                return;
            }
            try{
                const res = await fetch('/api/cart',{ cache:'no-store', credentials:'include' });
                if(res.ok){
                    const data = await res.json();
                    setCartItems(data.cartItems || {})
                    console.log('[Cart] Loaded from server, item keys:', Object.keys(data.cartItems||{}).length)
                }
            }catch(err){
                console.error('Failed to load cart', err)
            }
        }
        loadCart();
    }, [isLoaded,isSignedIn,user?.id])

    const value = {
        user,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}