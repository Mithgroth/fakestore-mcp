import { NextRequest, NextResponse } from 'next/server'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'

// FakeStore API base URL (used only on server-side)
const FAKESTORE_API_URL = 'https://fakestoreapi.com'

// In-memory session store: sessionId -> Server instance
const sessions = new Map<string, Server>();

// Helper: create and configure a new MCP server instance
function createServer(): Server {
  const server = new Server({ name: 'fakestore-mcp-server', version: '1.0.0' });
  // Error handling
  server.onerror = (error) => console.error('[MCP Error]', error);

  // Define available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'login',
        description: 'Authenticate user with FakeStore API',
        inputSchema: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' }
          },
          required: ['username','password']
        }
      },
      { name: 'logout', description: 'Log out the current user', inputSchema: { type: 'object', properties: {} } },
      { name: 'get_products', description: 'Get all products or filter by category', inputSchema: { type: 'object', properties: { category: { type: 'string' }, limit: { type: 'number' } } } },
      { name: 'get_product', description: 'Get a single product by ID', inputSchema: { type: 'object', properties: { productId: { type: 'number' } }, required: ['productId'] } },
      { name: 'get_categories', description: 'Get all product categories', inputSchema: { type: 'object', properties: {} } },
      { name: 'get_users', description: 'Get all users', inputSchema: { type: 'object', properties: {} } },
      { name: 'add_to_cart', description: "Add item to user's cart", inputSchema: { type: 'object', properties: { productId: { type: 'number' }, quantity: { type: 'number', default: 1 } }, required: ['productId'] } },
      { name: 'remove_from_cart', description: "Remove item from user's cart", inputSchema: { type: 'object', properties: { productId: { type: 'number' } }, required: ['productId'] } },
      { name: 'get_cart', description: "Get current cart", inputSchema: { type: 'object', properties: {} } },
      { name: 'clear_cart', description: "Clear the cart", inputSchema: { type: 'object', properties: {} } }
    ]
  }));

  // Tool handler
  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const toolName = req.params.name as string;
    const args = (req.params.arguments || {}) as any;
    switch (toolName) {
      case 'login': {
        const { username, password } = args;
        // Authenticate
        const resp = await fetch(`${FAKESTORE_API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
        if (!resp.ok) {
          return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: 'Invalid credentials' }) }] };
        }
        const { token } = await resp.json();
        // Fetch user details
        const userResp = await fetch(`${FAKESTORE_API_URL}/users`);
        const allUsers = userResp.ok ? await userResp.json() : [];
        const user = allUsers.find((u:any) => u.username === username) || null;
        // Store auth in server instance
        (server as any).authToken = token;
        (server as any).currentUser = user;
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, token, user }) }] };
      }
      case 'logout': {
        (server as any).authToken = null;
        (server as any).currentUser = null;
        return { content: [{ type: 'text', text: JSON.stringify({ success: true }) }] };
      }
      case 'get_products': {
        let url = `${FAKESTORE_API_URL}/products`;
        if (args.category) url = `${FAKESTORE_API_URL}/products/category/${args.category}`;
        if (args.limit) url += `?limit=${args.limit}`;
        const resp = await fetch(url);
        const products = await resp.json();
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, products, count: products.length }) }] };
      }
      case 'get_product': {
        const resp = await fetch(`${FAKESTORE_API_URL}/products/${args.productId}`);
        if (!resp.ok) throw new Error('Product not found');
        const product = await resp.json();
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, product }) }] };
      }
      case 'get_categories': {
        const resp = await fetch(`${FAKESTORE_API_URL}/products/categories`);
        const categories = await resp.json();
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, categories }) }] };
      }
      case 'get_users': {
        const resp = await fetch(`${FAKESTORE_API_URL}/users`);
        const users = await resp.json();
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, users }) }] };
      }
      case 'add_to_cart': {
        if (!(server as any).currentUser) throw new Error('User must be logged in');
        // Simulate cart: in real, we'd store state in session
        const resp = await fetch(`${FAKESTORE_API_URL}/products/${args.productId}`);
        const product = await resp.json();
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, product, quantity: args.quantity || 1 }) }] };
      }
      case 'remove_from_cart': {
        if (!(server as any).currentUser) throw new Error('User must be logged in');
        const resp = await fetch(`${FAKESTORE_API_URL}/products/${args.productId}`);
        const product = await resp.json();
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, productId: args.productId }) }] };
      }
      case 'get_cart': {
        if (!(server as any).currentUser) throw new Error('User must be logged in');
        // Simulated empty cart
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, cart: { items: [], totalItems: 0, totalPrice: 0 } }) }] };
      }
      case 'clear_cart': {
        if (!(server as any).currentUser) throw new Error('User must be logged in');
        return { content: [{ type: 'text', text: JSON.stringify({ success: true }) }] };
      }
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  });
  return server;
}

export async function POST(req: NextRequest) {
  // Establish or retrieve an MCP server instance for this session
  const sessionId = req.headers.get('Mcp-Session-Id') || crypto.randomUUID()
  let server = sessions.get(sessionId)
  if (!server) {
    server = createServer()
    sessions.set(sessionId, server)
  }
  // Parse incoming JSON-RPC request
  const requestBody = await req.json()
  const { id, method } = requestBody as { id: number | string; method: string }
  // Look up the handler for this method
  const handlers = (server as any)._requestHandlers as Map<string, Function>
  const handler = handlers.get(method)
  let responseBody: any
  if (!handler) {
    // Method not found
    responseBody = { jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } }
  } else {
    try {
      // Execute the tool or initialization handler
      const result = await handler(requestBody)
      responseBody = { jsonrpc: '2.0', id, result }
    } catch (error: any) {
      console.error('[MCP Handler Error]', error)
      responseBody = {
        jsonrpc: '2.0',
        id,
        error: { code: -32603, message: error instanceof Error ? error.message : 'Internal error' }
      }
    }
  }
  // Return the JSON-RPC response with session header
  const res = NextResponse.json(responseBody)
  res.headers.set('Mcp-Session-Id', sessionId)
  return res
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'GET not implemented' }, { status: 405 });
}

export { createServer, sessions }; 