import { NextRequest, NextResponse } from 'next/server'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'

// FakeStore API base URL (used only on server-side)
const FAKESTORE_API_URL = 'https://fakestoreapi.com'
const CART_TTL_MS = 30 * 60 * 1000; // 30 minutes TTL for cart persistence

// In-memory session store: sessionId -> Server instance
const sessions = new Map<string, Server>();

// Helper: create and configure a new MCP server instance
function createServer(): Server {
  const server = new Server({ name: 'fakestore-mcp-server', version: '1.0.0' });
  // Error handling
  server.onerror = (error) => console.error('[MCP Error]', error);

  // Cart persistence state with TTL per session
  (server as any).cartItems = [];
  (server as any).cartTimestamp = 0;
  (server as any).cartId = null;

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
        const now = Date.now();
        let items = (server as any).cartItems || [];
        const ts = (server as any).cartTimestamp || 0;
        if (now - ts > CART_TTL_MS) items = [];
        if (!(server as any).cartId || now - ts > CART_TTL_MS) {
          const createResp = await fetch(`${FAKESTORE_API_URL}/carts`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: (server as any).currentUser.id, date: new Date().toISOString(), products: [] })
          });
          const created = await createResp.json();
          (server as any).cartId = created.id;
        }
        const { productId, quantity = 1 } = args;
        const existing = items.find((it: any) => it.productId === productId);
        if (existing) existing.quantity += quantity;
        else items.push({ productId, quantity });
        (server as any).cartItems = items;
        (server as any).cartTimestamp = now;
        await fetch(`${FAKESTORE_API_URL}/carts/${(server as any).cartId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: (server as any).currentUser.id, date: new Date().toISOString(), products: items })
        });
        const resp = await fetch(`${FAKESTORE_API_URL}/products/${productId}`);
        const product = await resp.json();
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, product, quantity }) }] };
      }
      case 'remove_from_cart': {
        if (!(server as any).currentUser) throw new Error('User must be logged in');
        const now = Date.now();
        let items = (server as any).cartItems || [];
        const ts = (server as any).cartTimestamp || 0;
        if (now - ts > CART_TTL_MS) items = [];
        if (!(server as any).cartId || now - ts > CART_TTL_MS) {
          const createResp = await fetch(`${FAKESTORE_API_URL}/carts`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: (server as any).currentUser.id, date: new Date().toISOString(), products: items })
          });
          const created = await createResp.json();
          (server as any).cartId = created.id;
        }
        const { productId } = args;
        items = items.filter((it: any) => it.productId !== productId);
        (server as any).cartItems = items;
        (server as any).cartTimestamp = now;
        await fetch(`${FAKESTORE_API_URL}/carts/${(server as any).cartId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: (server as any).currentUser.id, date: new Date().toISOString(), products: items })
        });
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, productId }) }] };
      }
      case 'get_cart': {
        if (!(server as any).currentUser) throw new Error('User must be logged in');
        const now = Date.now();
        let items = (server as any).cartItems || [];
        const ts = (server as any).cartTimestamp || 0;
        if (now - ts > CART_TTL_MS) {
          const resp = await fetch(`${FAKESTORE_API_URL}/carts/user/${(server as any).currentUser.id}`);
          const userCarts = resp.ok ? await resp.json() : [];
          if (Array.isArray(userCarts) && userCarts.length) {
            const latest = userCarts.reduce((a: any, b: any) => new Date(a.date) > new Date(b.date) ? a : b);
            items = latest.products.map((p: any) => ({ productId: p.productId, quantity: p.quantity }));
            (server as any).cartId = latest.id;
          } else {
            items = [];
            const createResp = await fetch(`${FAKESTORE_API_URL}/carts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: (server as any).currentUser.id, date: new Date().toISOString(), products: [] })
            });
            const createdCart = await createResp.json();
            (server as any).cartId = createdCart.id;
          }
          (server as any).cartItems = items;
          (server as any).cartTimestamp = now;
        }
        const enriched: any[] = [];
        for (const it of items) {
          const pr = await fetch(`${FAKESTORE_API_URL}/products/${it.productId}`);
          const product = await pr.json();
          enriched.push({ product, quantity: it.quantity });
        }
        const totalItems = enriched.reduce((sum, i) => sum + i.quantity, 0);
        const totalPrice = enriched.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, cart: { items: enriched, totalItems, totalPrice } }) }] };
      }
      case 'clear_cart': {
        if (!(server as any).currentUser) throw new Error('User must be logged in');
        if (!(server as any).cartId) {
          const createResp = await fetch(`${FAKESTORE_API_URL}/carts`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: (server as any).currentUser.id, date: new Date().toISOString(), products: [] })
          });
          const created = await createResp.json();
          (server as any).cartId = created.id;
        }
        (server as any).cartItems = [];
        (server as any).cartTimestamp = Date.now();
        await fetch(`${FAKESTORE_API_URL}/carts/${(server as any).cartId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: (server as any).currentUser.id, date: new Date().toISOString(), products: [] })
        });
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