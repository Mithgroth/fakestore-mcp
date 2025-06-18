'use client'

import React from 'react'

export function Footer() {
  return (
    <footer className="mt-24 pt-12 pb-8 border-t">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">FakeStore MCP Demo</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          A demonstration of Model Context Protocol (MCP) integration with the FakeStore API, 
          showcasing modern e-commerce functionality.
        </p>
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <span>Built with Next.js</span>
          <span>•</span>
          <span>Powered by FakeStore API</span>
          <span>•</span>
          <span>MCP Integration</span>
        </div>
      </div>
    </footer>
  )
} 