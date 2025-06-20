// MCP Client for FakeStore API operations
// Browser-compatible client that communicates with MCP server via HTTP

import { User, Cart, Product } from '@/lib/types'

class MCPClientManager {
  private baseUrl = '/api/mcp'
  private authToken: string | null = null
  private currentUser: User | null = null
  private sessionId: string | null = null
  private requestId = 0

  setAuth(token: string, user: User) {
    this.authToken = token
    this.currentUser = user
  }

  clearAuth() {
    this.authToken = null
    this.currentUser = null
    // Preserve sessionId to retain cart session across logouts until TTL expires
  }

  private async callRpc<T>(toolName: string, args: any = {}): Promise<T> {
    const id = ++this.requestId
    const body = { jsonrpc: '2.0', id, method: 'tools/call', params: { name: toolName, arguments: args } }
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'MCP-Protocol-Version': '2025-06-18'
    }
    if (this.authToken) headers.Authorization = `Bearer ${this.authToken}`
    if (this.sessionId) headers['Mcp-Session-Id'] = this.sessionId

    const res = await fetch(this.baseUrl, { method: 'POST', body: JSON.stringify(body), headers })
    if (!res.ok) throw new Error(`MCP call failed: ${res.status} ${res.statusText}`)

    const newSid = res.headers.get('Mcp-Session-Id')
    if (newSid) this.sessionId = newSid

    const rpc = await res.json()
    if (rpc.error) throw new Error(rpc.error.message || 'Unknown RPC error')

    const content = rpc.result.content as Array<{ type: string; text: string }>
    const payload = JSON.parse(content[0].text)
    return payload as T
  }

  async login(username: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const result = await this.callRpc<{ success: boolean; user?: User; token?: string; error?: string }>(
        'login',
        { username, password }
      )
      if (result.success && result.user && result.token) this.setAuth(result.token, result.user)
      return result
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' }
    }
  }

  async logout(): Promise<{ success: boolean }> {
    try {
      const result = await this.callRpc<{ success: boolean }>('logout')
      this.clearAuth()
      return result
    } catch (error) {
      this.clearAuth()
      return { success: false }
    }
  }

  async getUsers(): Promise<{ success: boolean; users?: User[]; error?: string }> {
    try {
      return await this.callRpc<{ success: boolean; users?: User[]; error?: string }>('get_users')
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get users' }
    }
  }

  async getProducts(category?: string, limit?: number): Promise<{ success: boolean; products?: Product[]; count?: number; error?: string }> {
    try {
      const args: any = {}
      if (category) args.category = category
      if (limit) args.limit = limit
      return await this.callRpc<{ success: boolean; products?: Product[]; count?: number; error?: string }>(
        'get_products',
        args
      )
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get products' }
    }
  }

  async getProduct(productId: number): Promise<{ success: boolean; product?: Product; error?: string }> {
    try {
      return await this.callRpc<{ success: boolean; product?: Product; error?: string }>(
        'get_product',
        { productId }
      )
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get product' }
    }
  }

  async getCategories(): Promise<{ success: boolean; categories?: string[]; error?: string }> {
    try {
      return await this.callRpc<{ success: boolean; categories?: string[]; error?: string }>('get_categories')
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get categories' }
    }
  }

  async addToCart(productId: number, quantity = 1): Promise<{ success: boolean; message?: string; product?: Product; quantity?: number; error?: string }> {
    try {
      return await this.callRpc<{ success: boolean; message?: string; product?: Product; quantity?: number; error?: string }>(
        'add_to_cart',
        { productId, quantity }
      )
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add to cart' }
    }
  }

  async removeFromCart(productId: number): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      return await this.callRpc<{ success: boolean; message?: string; error?: string }>(
        'remove_from_cart',
        { productId }
      )
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to remove from cart' }
    }
  }

  async getCart(): Promise<{ success: boolean; cart?: Cart; message?: string; error?: string }> {
    try {
      return await this.callRpc<{ success: boolean; cart?: Cart; message?: string; error?: string }>('get_cart')
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get cart' }
    }
  }

  async clearCart(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      return await this.callRpc<{ success: boolean; message?: string; error?: string }>('clear_cart')
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to clear cart' }
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return !!this.authToken && !!this.currentUser
  }
}

// Singleton instance
export const mcpClient = new MCPClientManager() 