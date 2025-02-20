import { db } from '../data/db'
import type { CartItem, Guitar } from "../types"

export type CartActions = 
    { type: 'add-to-cart', payload: {item : Guitar}} |
    { type: 'remove-from-cart', payload: {id : Guitar['id']}} |
    { type: 'decrease-quantity', payload: {id: Guitar['id']}} |
    { type: 'increase-quantity', payload: {id: Guitar['id']}} |
    { type: 'clear-cart'}

export type CartState = {
    data: Guitar[],
    cart: CartItem[]
}
const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
}
export const initialState : CartState = {
    data: db, //nuestra bbdd de guitarra con los datos
    //cart: []
    cart: initialCart()
}

const MIN_ITEMS = 1
const MAX_ITEMS = 5

export const cartReducer = (    
        state: CartState = initialState,
        action: CartActions
    ) => {

    if (action.type === "add-to-cart"){
        const itemExists = state.cart.find(guitar => guitar.id === action.payload.item.id)
        //console.log(itemExists)
        let updatedCart : CartItem[] = []
        if(itemExists ) { // existe en el carrito
            updatedCart = state.cart.map(item => {
                if(item.id === action.payload.item.id){ //ese es el elemento que el user está agregando repetido
                    if(item.quantity < MAX_ITEMS){ //le permitimos agregarlo
                        return{...item,quantity: item.quantity + 1 } //copia del item e incrementamos quantity
                    } else {
                        return item // llegamos a 5, no se cumple lo anterior pero mantenemos lo que teníamos en el carrito
                    }
                } else {//el que no estamos agregando repetido pero no queremos perder
                    return item
                }
            })            
        } else {
            const newItem : CartItem = {...action.payload.item, quantity : 1}
            updatedCart = [...state.cart, newItem]
        }

        return{
            ...state,
            cart: updatedCart
        }
    }
    if (action.type === "remove-from-cart"){
        const updatedCart = state.cart.filter( item => item.id !== action.payload.id)       
        return{
            ...state,
            cart: updatedCart
        }
    }
    if (action.type === "decrease-quantity"){
        const updatedCart = state.cart.map( item => {
            if(item.id === action.payload.id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })    
        return{
            ...state,
            cart: updatedCart
        }
    }
    if(action.type === "increase-quantity"){
        const updatedCart = state.cart.map( item => {
            if(item.id === action.payload.id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })        
        return{
            ...state,
            cart: updatedCart
        }
    }
    if(action.type === "clear-cart"){
        const updatedCart : CartItem[] = []
        return{
            ...state,
            cart: updatedCart
        }
    }

    return state
    
}