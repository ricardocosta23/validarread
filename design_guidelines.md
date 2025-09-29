# Design Guidelines: Monday.com Webhook Processor

## Design Approach
**Selected Approach:** Design System - Carbon Design System
**Justification:** This is a utility-focused, data-heavy application for webhook processing and monitoring. Carbon Design System excels at enterprise applications with information density and clear data visualization.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Primary: 215 95% 50% (IBM Blue for actions and primary elements)
- Background (Light): 0 0% 99% 
- Background (Dark): 215 15% 12%
- Surface (Light): 0 0% 100%
- Surface (Dark): 215 15% 16%

**Status Colors:**
- Success: 142 76% 36% (for "OK" status)
- Warning: 35 100% 50% (for "NÃO READEQUAR" status)
- Error: 5 79% 57% (for failed webhooks)
- Info: 215 95% 68% (for processing status)

### B. Typography
**Font Stack:** IBM Plex Sans via Google Fonts CDN
- Headers: IBM Plex Sans, 600 weight
- Body text: IBM Plex Sans, 400 weight  
- Code/IDs: IBM Plex Mono, 400 weight
- Sizes: text-sm, text-base, text-lg, text-xl for consistent hierarchy

### C. Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Tight spacing: p-2, m-2 (component internals)
- Standard spacing: p-4, m-4 (general layout)
- Section spacing: p-6, m-6 (between major sections)
- Large spacing: p-8, m-8 (page-level margins)

### D. Component Library

**Core Components:**
- **Dashboard Header:** App title, webhook status indicator, last activity timestamp
- **Webhook Log Table:** Real-time webhook entries with columns for timestamp, board ID, status, validation outcome
- **Status Cards:** Overview metrics (total webhooks, success rate, recent failures)
- **Configuration Panel:** Board mapping settings for future expansion
- **Alert Components:** Success/error notifications for webhook processing

**Navigation:**
- Simple sidebar with Dashboard, Logs, Configuration sections
- Breadcrumb navigation for deeper views

**Forms:**
- Clean input fields with Carbon Design styling
- Validation states clearly indicated
- Configuration forms for board mappings

**Data Displays:**
- Structured tables for webhook logs
- Status badges for validation outcomes
- Code blocks for displaying webhook payloads
- Real-time activity feeds

### E. Animations
**Minimal Implementation:**
- Subtle fade-in for new webhook entries (300ms)
- Loading states for API calls
- Smooth transitions for status changes (200ms)
- No decorative animations - focus on functionality

## Key Design Principles
1. **Data Clarity:** Webhook information must be immediately scannable
2. **Status Visibility:** Clear visual distinction between "OK" and "NÃO READEQUAR" outcomes  
3. **Real-time Feedback:** Live updates when webhooks are processed
4. **Scalability:** Interface ready for multiple board configurations
5. **Reliability:** Robust error states and loading indicators

## Layout Structure
- **Primary View:** Dashboard with recent webhook activity
- **Detailed View:** Comprehensive webhook logs with filtering
- **Configuration View:** Board mapping management for future expansion
- **No hero imagery needed** - this is a pure utility interface focused on data and functionality