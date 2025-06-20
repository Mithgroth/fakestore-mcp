'use client'

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Info, ShoppingBag, Users, Star, TrendingUp } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export function DemoInfoDialog() {
  const { user } = useAuth()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="fixed bottom-4 right-4 z-50 shadow-lg">
          <Info className="h-4 w-4 mr-2" />
          Demo Info
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>FakeStore MCP Demo</DialogTitle>
          <DialogDescription>
            Model Context Protocol powered shopping experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <ShoppingBag className="h-6 w-6 mb-2 text-primary" />
                <CardTitle className="text-base">Shopping Cart</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Add and remove items from your cart with real-time updates
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Users className="h-6 w-6 mb-2 text-primary" />
                <CardTitle className="text-base">User Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Secure login system powered by FakeStore API
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Star className="h-6 w-6 mb-2 text-primary" />
                <CardTitle className="text-base">Product Catalog</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Browse through a variety of products with detailed information
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <TrendingUp className="h-6 w-6 mb-2 text-primary" />
                <CardTitle className="text-base">MCP Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Powered by Model Context Protocol for enhanced functionality
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Demo Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Demo Information</CardTitle>
              <CardDescription>
                This is a demonstration application showcasing MCP integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-sm">Available Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>User authentication with FakeStore API</li>
                  <li>Product browsing and search</li>
                  <li>Shopping cart management</li>
                  <li>Responsive design with ShadCN/ui</li>
                  <li>Model Context Protocol integration</li>
                </ul>
              </div>
              
              {!user && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm font-medium mb-2">Test Login Credentials:</p>
                  <p className="text-sm text-muted-foreground">
                    Username: <code className="bg-white px-1 rounded">mor_2314</code><br />
                    Password: <code className="bg-white px-1 rounded">83r5^_</code>
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium mb-2">Technology Stack:</p>
                <p className="text-sm text-muted-foreground">
                  Next.js 15, TypeScript, ShadCN/ui, Tailwind CSS, FakeStore API, MCP TypeScript SDK
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
} 