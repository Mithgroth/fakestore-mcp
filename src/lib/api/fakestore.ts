// FakeStore API Client - ONLY API allowed per assignment requirements
import { Product, Cart, User, LoginCredentials, AuthToken } from '@/lib/types'

const FAKESTORE_API_BASE = 'https://fakestoreapi.com'

export class FakeStoreAPI {
  private static instance: FakeStoreAPI
  private authToken: string | null = null

  private constructor() {}

  static getInstance(): FakeStoreAPI {
    if (!FakeStoreAPI.instance) {
      FakeStoreAPI.instance = new FakeStoreAPI()
    }
    return FakeStoreAPI.instance
  }

  setAuthToken(token: string) {
    this.authToken = token
  }

  clearAuthToken() {
    this.authToken = null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${FAKESTORE_API_BASE}${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthToken> {
    return this.request<AuthToken>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products')
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`)
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.request<Product[]>(`/products/category/${category}`)
  }

  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/products/categories')
  }

  // Carts
  async getCarts(): Promise<Cart[]> {
    return this.request<Cart[]>('/carts')
  }

  async getCart(id: number): Promise<Cart> {
    return this.request<Cart>(`/carts/${id}`)
  }

  async getUserCarts(userId: number): Promise<Cart[]> {
    return this.request<Cart[]>(`/carts/user/${userId}`)
  }

  async createCart(cart: Omit<Cart, 'id'>): Promise<Cart> {
    return this.request<Cart>('/carts', {
      method: 'POST',
      body: JSON.stringify(cart),
    })
  }

  async updateCart(id: number, cart: Partial<Cart>): Promise<Cart> {
    return this.request<Cart>(`/carts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cart),
    })
  }

  async deleteCart(id: number): Promise<Cart> {
    return this.request<Cart>(`/carts/${id}`, {
      method: 'DELETE',
    })
  }

  // Users
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users')
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`)
  }
} 