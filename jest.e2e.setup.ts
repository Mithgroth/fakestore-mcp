import { NextResponse } from 'next/server';

// Use undici fetch for E2E tests
const { fetch } = require('undici');
global.fetch = fetch;

// Override NextResponse.json to avoid calling Response.json static and causing errors
// @ts-ignore
(NextResponse as any).json = (body: any, init?: any) => new NextResponse(JSON.stringify(body), init); 