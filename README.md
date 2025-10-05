# Budgetly - Personal Budget Manager

A local-first, offline-capable personal budget manager built with Next.js 14, TypeScript, and IndexedDB.

## Features

- 🏦 **Accounts Management**: Cash, Bank, Wallet, Credit accounts
- 💰 **Transactions**: Expenses, Income, Transfers with splits
- 📊 **Budgets**: Monthly budgets with rollover support
- 📱 **Categories**: Customizable expense and income categories
- 🔄 **Recurring Rules**: Weekly/Monthly automatic transactions
- 📊 **Reports**: Month-over-month comparison and trends
- 📤 **Import/Export**: CSV file support
- 🌐 **Offline-First**: Works completely offline with background sync
- 📱 **PWA**: Installable on mobile and desktop
- ♿ **Accessible**: WCAG AA compliant with keyboard shortcuts
- 🌙 **Dark Mode**: System preference support
- 💱 **Multi-Currency**: INR default with currency switching

## Quick Start

```bash
# Clone and setup
git clone <repo-url> budgetly
cd budgetly

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Add your DATABASE_URL and other variables

# Setup database
npm run prisma:generate
npm run prisma:migrate
npm run seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Local Storage**: IndexedDB with Dexie
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Testing**: Vitest (unit) + Playwright (e2e)
- **PWA**: Service Worker + Manifest

## Architecture

### Local-First Design

- **Primary**: All data stored locally in IndexedDB
- **Secondary**: Background sync to server when online
- **Conflict Resolution**: Last-write-wins with timestamps
- **Offline Support**: Full functionality without internet

### Data Sync Flow

1. User action → IndexedDB (immediate)
2. Queue sync operation
3. Background sync to server when online
4. Mark local record as synced

## Keyboard Shortcuts

- `N` - New transaction
- `/` - Search/Filter
- `B` - Budgets page
- `A` - Accounts page

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run test         # Unit tests
npm run test:e2e     # E2E tests
npm run prisma:migrate # Database migration
npm run seed         # Seed sample data
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `DATABASE_URL` (Neon PostgreSQL)
   - `NEXTAUTH_SECRET` (if using auth)
4. Deploy

### Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SITE_NAME="Budgetly"
NODE_ENV="production"
```

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

Test coverage includes:
- Quick Add flow
- Transfer between accounts
- Budget rollover calculations
- CSV import/export
- Offline queue processing

## Contributing

1. Fork repository
2. Create feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit pull request

## License

MIT"# Budgetly" 
