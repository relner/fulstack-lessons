export interface User {
    email: String
    password: String
}

export interface Category {
    name: string
    imageSrc?: string
    user?: string
    _id?: string
}

export interface Message {
    message: string
} 

export interface Position {
    name: string
    cost: number
    category: string
    user?: string
    _id?: string
    quantity: number
}