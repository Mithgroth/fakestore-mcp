import { POST, GET, sessions } from './route';
import { NextRequest } from 'next/server';

// Helper to create NextRequest-like objects for testing
function makeRequest(jsonBody: any, sessionId?: string): NextRequest {
  return {
    headers: {
      get: (key: string) => key === 'Mcp-Session-Id' ? sessionId : undefined
    },
    json: async () => jsonBody
  } as NextRequest;
}

describe('MCP Server - E2E Tests with Real API', () => {
  let sessionId: string;

  beforeEach(() => {
    sessions.clear();
    sessionId = '';
  });

  test('E2E get products and categories with real API', async () => {
    // 1. Get all products
    const getProductsReq = makeRequest({
      id: 1,
      method: 'tools/call',
      params: {
        name: 'get_products',
        arguments: { limit: 5 }
      }
    });

    const getProductsRes = await POST(getProductsReq);
    const getProductsJson = await getProductsRes.json();
    const productsContent = JSON.parse(getProductsJson.result.content[0].text);
    
    expect(productsContent.success).toBe(true);
    expect(productsContent.products).toBeInstanceOf(Array);
    expect(productsContent.products.length).toBeLessThanOrEqual(5);
    expect(productsContent.count).toBe(productsContent.products.length);

    // 2. Get categories
    const getCategoriesReq = makeRequest({
      id: 2,
      method: 'tools/call',
      params: {
        name: 'get_categories',
        arguments: {}
      }
    });

    const getCategoriesRes = await POST(getCategoriesReq);
    const getCategoriesJson = await getCategoriesRes.json();
    const categoriesContent = JSON.parse(getCategoriesJson.result.content[0].text);
    
    expect(categoriesContent.success).toBe(true);
    expect(categoriesContent.categories).toBeInstanceOf(Array);
    expect(categoriesContent.categories.length).toBeGreaterThan(0);

    // 3. Get products by category
    const category = categoriesContent.categories[0];
    const getProductsByCategoryReq = makeRequest({
      id: 3,
      method: 'tools/call',
      params: {
        name: 'get_products',
        arguments: { category }
      }
    });

    const getProductsByCategoryRes = await POST(getProductsByCategoryReq);
    const getProductsByCategoryJson = await getProductsByCategoryRes.json();
    const categoryProductsContent = JSON.parse(getProductsByCategoryJson.result.content[0].text);
    
    expect(categoryProductsContent.success).toBe(true);
    expect(categoryProductsContent.products).toBeInstanceOf(Array);
    expect(categoryProductsContent.products.length).toBeGreaterThan(0);
  });

  test('E2E get single product with real API', async () => {
    const getProductReq = makeRequest({
      id: 1,
      method: 'tools/call',
      params: {
        name: 'get_product',
        arguments: { productId: 1 }
      }
    });

    const getProductRes = await POST(getProductReq);
    const getProductJson = await getProductRes.json();
    const productContent = JSON.parse(getProductJson.result.content[0].text);
    
    expect(productContent.success).toBe(true);
    expect(productContent.product).toMatchObject({
      id: 1,
      title: expect.any(String),
      price: expect.any(Number),
      description: expect.any(String),
      category: expect.any(String),
      image: expect.any(String),
      rating: expect.objectContaining({
        rate: expect.any(Number),
        count: expect.any(Number)
      })
    });
  });

  test('E2E list tools', async () => {
    const listToolsReq = makeRequest({
      id: 1,
      method: 'tools/list'
    });

    const listToolsRes = await POST(listToolsReq);
    const listToolsJson = await listToolsRes.json();
    
    expect(Array.isArray(listToolsJson.result.tools)).toBe(true);
    expect(listToolsJson.result.tools.length).toBe(10); // All our tools
    
    const toolNames = listToolsJson.result.tools.map((tool: any) => tool.name);
    expect(toolNames).toContain('login');
    expect(toolNames).toContain('logout');
    expect(toolNames).toContain('get_products');
    expect(toolNames).toContain('get_product');
    expect(toolNames).toContain('get_categories');
    expect(toolNames).toContain('get_users');
    expect(toolNames).toContain('add_to_cart');
    expect(toolNames).toContain('remove_from_cart');
    expect(toolNames).toContain('get_cart');
    expect(toolNames).toContain('clear_cart');
  });
}); 