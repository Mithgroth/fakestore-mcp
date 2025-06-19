import fetchMock from 'jest-fetch-mock';
import { NextResponse } from 'next/server';

fetchMock.enableMocks();

// Override NextResponse.json to avoid calling Response.json static and causing errors
// @ts-ignore
(NextResponse as any).json = (body: any, init?: any) => new NextResponse(JSON.stringify(body), init); 