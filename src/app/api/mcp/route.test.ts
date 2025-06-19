// @ts-nocheck
import fetchMock from 'jest-fetch-mock';
import { createServer, sessions, POST, GET } from './route';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { NextRequest } from 'next/server';

describe('MCP Server - direct handler tests', () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
    sessions.clear();
  });

  test('ListTools returns all tools', async () => {
    const server = createServer();
    const handlers = (server as any)._requestHandlers as Map<string, Function>;
    const handler = handlers.get(ListToolsRequestSchema.shape.method.value);
    const result = await handler({ method: ListToolsRequestSchema.shape.method.value, params: {} });
    expect(result).toHaveProperty('tools');
    expect(Array.isArray(result.tools)).toBe(true);
    expect(result.tools).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'login' })])
    );
  });

  test('login succeeds with valid credentials', async () => {
    fetchMock.mockResponses(
      // login endpoint
      [JSON.stringify({ token: 'abc123' }), { status: 200 }],
      // users endpoint
      [
        JSON.stringify([
          { id: 1, username: 'john', name: 'John Doe' }
        ]),
        { status: 200 }
      ]
    );
    const server = createServer();
    const handlers = (server as any)._requestHandlers as Map<string, Function>;
    const handler = handlers.get(CallToolRequestSchema.shape.method.value);
    const req = {
      method: CallToolRequestSchema.shape.method.value,
      params: {
        name: 'login',
        arguments: { username: 'john', password: 'password' }
      }
    };
    const res = await handler(req);
    const content = JSON.parse(res.content[0].text);
    expect(content).toMatchObject({
      success: true,
      token: 'abc123',
      user: { id: 1, username: 'john', name: 'John Doe' }
    });
  });

  test('login fails with invalid credentials', async () => {
    fetchMock.mockResponseOnce('', { status: 401 });
    const server = createServer();
    const handler = (server as any)._requestHandlers.get(
      CallToolRequestSchema.shape.method.value
    );
    const req = {
      method: CallToolRequestSchema.shape.method.value,
      params: {
        name: 'login',
        arguments: { username: 'john', password: 'wrong' }
      }
    };
    const res = await handler(req);
    const content = JSON.parse(res.content[0].text);
    expect(content).toEqual({ success: false, error: 'Invalid credentials' });
  });

  test('get_product returns product on success and throws on failure', async () => {
    fetchMock
      .mockResponseOnce(
        JSON.stringify({ id: 42, title: 'Test Product' }),
        { status: 200 }
      )
      .mockResponseOnce('', { status: 404 });
    const server = createServer();
    const handler = (server as any)._requestHandlers.get(
      CallToolRequestSchema.shape.method.value
    );
    // Success
    let req: any = {
      method: CallToolRequestSchema.shape.method.value,
      params: { name: 'get_product', arguments: { productId: 42 } }
    };
    let res = await handler(req);
    let content = JSON.parse(res.content[0].text);
    expect(content).toMatchObject({
      success: true,
      product: { id: 42, title: 'Test Product' }
    });
    // Failure
    req = { method: CallToolRequestSchema.shape.method.value, params: { name: 'get_product', arguments: { productId: 999 } } };
    await expect(handler(req)).rejects.toThrow('Product not found');
  });

  test('add_to_cart throws if not logged in', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });
    const server = createServer();
    const handler = (server as any)._requestHandlers.get(
      CallToolRequestSchema.shape.method.value
    );
    const req = { method: CallToolRequestSchema.shape.method.value, params: { name: 'add_to_cart', arguments: { productId: 1 } } };
    await expect(handler(req)).rejects.toThrow('User must be logged in');
  });
});

describe('MCP Server - route handlers', () => {
  test('POST with ListTools', async () => {
    const req = {
      headers: { get: () => undefined },
      json: () =>
        Promise.resolve({ id: '1', method: ListToolsRequestSchema.shape.method.value })
    } as unknown as NextRequest;
    const response = await POST(req);
    const json = await response.json();
    expect(json).toHaveProperty('result.tools');
    expect(Array.isArray(json.result.tools)).toBe(true);
    expect(response.headers.get('Mcp-Session-Id')).toBeDefined();
  });

  test('GET returns 405', async () => {
    const response = await GET();
    expect(response.status).toBe(405);
    const json = await response.json();
    expect(json).toEqual({ success: false, error: 'GET not implemented' });
  });
}); 