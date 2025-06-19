// FakeStore API Types based on https://fakestoreapi.com/docs

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export interface User {
  id: number
  username: string
  email: string
  name: {
    firstname: string
    lastname: string
  }
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthToken {
  token: string
}

export interface MCPToolResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface AddToCartParams {
  productId: number
  quantity: number
}

export interface RemoveFromCartParams {
  productId: number
}