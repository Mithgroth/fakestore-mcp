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
  productId: number
  quantity: number
}

export interface Cart {
  id: number
  userId: number
  date: string
  products: CartItem[]
}

export interface User {
  id: number
  email: string
  username: string
  password: string
  name: {
    firstname: string
    lastname: string
  }
  address: {
    city: string
    street: string
    number: number
    zipcode: string
    geolocation: {
      lat: string
      long: string
    }
  }
  phone: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthToken {
  token: string
}

// MCP Tool Types
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