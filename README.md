# FakeStore MCP Project

A complete e-commerce application demonstrating the Model Context Protocol (MCP) with a Next.js frontend and MCP server backend, using the FakeStore API.

## 🚀 Live Demo

The application includes:
- **User Authentication** with FakeStore API
- **Product Browsing** by categories with sorting
- **Shopping Cart** functionality with persistence
- **MCP Server** providing all functionality through MCP tools

## 📁 Project Structure

```
fakestore-mcp/
├── src/                    # Next.js frontend application
│   ├── app/               # Next.js 13+ App Router
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── cart/         # Shopping cart components
│   │   ├── products/     # Product display components
│   │   └── ui/           # Shared UI components (shadcn/ui)
│   └── lib/              # Utilities and contexts
├── mcp-server/            # MCP server implementation
│   ├── src/              # TypeScript MCP server source
│   └── build/            # Compiled JavaScript output
└── docs/                 # Documentation
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install MCP Server Dependencies
```bash
cd mcp-server
npm install
npm run build
cd ..
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🔧 MCP Server

The MCP server provides all core functionality through standardized tools:

### Authentication Tools
- `login` - User authentication
- `logout` - Session termination

### Product Tools  
- `get_products` - Browse products with optional category filtering
- `get_categories` - List all available categories

### Cart Tools
- `add_to_cart` - Add products to shopping cart
- `remove_from_cart` - Remove products from cart
- `get_cart` - View detailed cart contents
- `clear_cart` - Empty shopping cart

### Start MCP Server
```bash
cd mcp-server
npm start
```

## 🎯 Features

### ✅ Phase 1: Complete UI Implementation
- [x] **Authentication System** - Login/logout with session management
- [x] **Product Catalog** - Category browsing with sorting and filtering
- [x] **Shopping Cart** - Add/remove items, quantity management, persistence
- [x] **Responsive Design** - Modern UI with Tailwind CSS and shadcn/ui
- [x] **Error Handling** - Comprehensive error boundaries and loading states

### ✅ Phase 2: MCP Integration
- [x] **MCP Server** - Complete server implementation with all required tools
- [x] **Tool Definitions** - Authentication, product browsing, and cart management
- [x] **API Integration** - FakeStore API integration through MCP layer
- [x] **Documentation** - Complete setup and usage instructions

## 🧪 Testing

### Demo Credentials
Use these test accounts from FakeStore API:

**Account 1:**
- Username: `mor_2314`
- Password: `83r5^_`

**Account 2:**  
- Username: `kevinryan`
- Password: `kev02937@`

### Testing Workflow
1. Start the development server: `npm run dev`
2. Open `http://localhost:3000`
3. Click "Login" and use demo credentials
4. Browse products by categories
5. Add items to cart
6. View cart and manage quantities
7. Test checkout flow

## 🏗️ Architecture

### UI-First Development Strategy
The project follows a **UI-first approach**:

1. **Phase 1**: Built complete working UI with direct FakeStore API integration
2. **Phase 2**: Added MCP server layer to wrap proven functionality
3. **Result**: Working product first, then abstraction layer

### Technology Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: MCP Server with TypeScript SDK
- **API**: FakeStore API (fakestoreapi.com)
- **State Management**: React Context + localStorage
- **Authentication**: FakeStore API tokens

## 📋 Assignment Requirements

### ✅ Core Functionality (Complete)
- [x] **Login** - User authentication functionality
- [x] **Add item to cart** - Shopping cart item addition  
- [x] **Remove item from cart** - Shopping cart item removal
- [x] **Display current cart, itemised** - Detailed cart view with breakdown
- [x] **Bonus functionality** - Category browsing, sorting, responsive design, checkout

### ✅ Deliverables (Complete)
- [x] **GitHub Repository** - Complete source code with documentation
- [x] **MCP Implementation** - Full server and client integration
- [x] **Setup Instructions** - Comprehensive installation guide

### ✅ Technical Requirements (Complete)
- [x] **Language & Libraries** - Next.js with TypeScript, MCP TypeScript SDK
- [x] **API Constraint** - Only FakeStore API usage (no other external APIs)
- [x] **Code Understanding** - Well-documented, clean implementation
- [x] **MCP Integration** - Complete Model Context Protocol implementation

## 🚀 Deployment

### Vercel Deployment (Recommended) ✅
**Ready for One-Click Deploy!**

1. **Connect to Vercel:**
   ```bash
   # Push to GitHub, then connect to Vercel
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Deploy:**
   - Connect your GitHub repo to Vercel
   - Vercel auto-detects Next.js and uses our custom build configuration
   - Deploy with **zero additional configuration needed**

3. **What Gets Deployed:**
   - ✅ Complete Next.js frontend 
   - ✅ Built-in API routes (`/api/mcp/*`) providing same functionality as MCP server
   - ✅ Serverless functions for all cart operations
   - ✅ Production-ready build

### Environment Variables
❌ **None required!** - Uses public FakeStore API endpoints

### Alternative: Local Development
```bash
npm run dev        # Start Next.js (main app)
npm run dev:mcp    # Start MCP server (for AI assistants)
```

## 📖 Development Notes

### Key Design Decisions
- **UI-First Strategy** - Build working interface before MCP abstraction
- **Component Architecture** - Modular React components with clear separation
- **State Management** - React Context for cart, localStorage for persistence  
- **Error Handling** - Comprehensive error boundaries and user feedback
- **TypeScript** - Strict typing throughout for reliability

### Code Quality
- ESLint + TypeScript for code quality
- Consistent naming conventions
- Comprehensive error handling
- Modern React patterns (hooks, context)
- Responsive design principles

## 🎬 Demo Video

*Demo video will be created showcasing:*
- User authentication flow
- Product browsing and filtering
- Cart management (add/remove/view)
- MCP server tool demonstration
- Responsive design features

---

**Project Status**: ✅ Complete - Ready for demonstration  
**MCP Implementation**: ✅ Full server and client integration  
**Deployment Ready**: ✅ Structured for Vercel deployment 