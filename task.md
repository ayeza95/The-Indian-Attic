# The Indian Attic - Implementation Task List

## Planning Phase
- [x] Create comprehensive implementation plan
- [x] Get user approval on technical architecture
- [/] Finalize data models and API structure

## Project Setup
- [/] Initialize Next.js 14+ project with TypeScript
- [ ] Configure MongoDB Atlas connection
- [ ] Set up authentication system (NextAuth.js)
- [ ] Configure environment variables
- [ ] Set up project structure and folder organization

## Database Schema & Models
- [ ] Create User model (NRI/Buyer, Artisan/Seller, Admin roles)
- [ ] Create State and District models (geographical hierarchy)
- [ ] Create Product model (with cultural metadata)
- [ ] Create Order model (with international logistics)
- [ ] Create Review model (authenticity-focused)
- [ ] Create SwadesiBox subscription model
- [ ] Create Message/Communication model
- [ ] Create Craft Preservation tracking model

## Authentication & Authorization
- [ ] Implement NextAuth.js with MongoDB adapter
- [ ] Create role-based access control (RBAC)
- [ ] Build registration flows for all three user types
- [ ] Implement artisan verification workflow
- [ ] Create admin approval system

## Core API Routes
- [ ] Authentication APIs (login, register, verify)
- [ ] State and District APIs (hierarchical data)
- [ ] Product CRUD APIs (with cultural metadata)
- [ ] Cart and Order APIs
- [ ] Review and Rating APIs
- [ ] Messaging/Communication APIs
- [ ] SwadesiBox subscription APIs
- [ ] Admin moderation APIs
- [ ] International logistics calculation APIs

## Frontend - District-First Discovery
- [ ] Create homepage with state exploration
- [ ] Build state detail page with districts
- [ ] Build district detail page with traditional products
- [ ] Implement district-based navigation system
- [ ] Create interactive map visualization (optional enhancement)

## Frontend - Product Pages
- [ ] Design story-first product detail page
- [ ] Display cultural usage and context
- [ ] Show artisan lineage and authenticity tags
- [ ] Implement Craft Preservation Status indicator
- [ ] Add "Locally Famous, Globally Rare" badge
- [ ] Create custom order/pre-order forms
- [ ] Implement buyer-seller messaging interface

## Frontend - Commerce Features
- [ ] Build shopping cart with bulk discounts
- [ ] Create checkout flow with international logistics
- [ ] Implement gifting options with wrapping
- [ ] Add artisan tip functionality
- [ ] Create endangered craft donation system
- [ ] Build order tracking and history

## Frontend - User Dashboards
- [ ] NRI/Buyer dashboard (orders, messages, preferences)
- [ ] Artisan/Seller dashboard (products, orders, analytics)
- [ ] Admin dashboard (verification, moderation, analytics)

## Frontend - SwadesiBox Subscription
- [ ] Create subscription landing page
- [ ] Build quarterly box customization
- [ ] Implement subscription management
- [ ] Design story card templates for products

## Frontend - Personalization
- [ ] Create user preference collection flow
- [ ] Implement recommendation engine
- [ ] Build festival-based suggestions
- [ ] Create origin-state based personalization

## Design System
- [ ] Create warm, heritage-focused color palette
- [ ] Design typography system (modern yet respectful)
- [ ] Build reusable UI components
- [ ] Implement responsive layouts
- [ ] Create cultural imagery and iconography

## Testing & Verification
- [ ] Test all authentication flows
- [ ] Verify district-based navigation
- [ ] Test product creation and ordering
- [ ] Verify international logistics calculations
- [ ] Test messaging system
- [ ] Verify role-based access control
- [ ] Test SwadesiBox subscription flow

## Documentation
- [ ] Create walkthrough documentation
- [ ] Document API endpoints
- [ ] Create user guides for each role
