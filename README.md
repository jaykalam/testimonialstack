# TestimonialStack

A testimonial and social proof management SaaS for indie makers and solo founders.

## Features

- **Testimonial Collection** - Public collection pages with customizable forms
- **Embeddable Widgets** - Multiple layouts (grid, carousel, spotlight, wall of love)
- **Milestone Tracking** - Auto-pull revenue data from Stripe/Lemon Squeezy
- **Dashboard Management** - Approve, edit, organize testimonials
- **Full Customization** - Colors, fonts, layouts without coding
- **Analytics** - Track widget impressions and clicks

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth (Email + OAuth)
- **Payments:** Lemon Squeezy
- **UI:** Tailwind CSS + shadcn/ui
- **Hosting:** Vercel (Free tier)

## Getting Started

### Prerequisites

- Node.js 18+
- Git
- GitHub account
- Supabase account
- Lemon Squeezy account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/testimonialstack.git
   cd testimonialstack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your credentials:
   - Supabase URL and API keys
   - Lemon Squeezy API key and store ID
   - App URL (http://localhost:3000 for development)

4. **Set up Supabase**
   - Create a new project in Supabase
   - Run migrations in SQL editor:
     ```bash
     # Copy contents of supabase/migrations/001_initial_schema.sql
     # and run in Supabase dashboard
     ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── collect/[slug]/    # Public collection pages
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── dashboard/         # Dashboard components
│   └── widgets/           # Widget components
├── lib/
│   ├── supabase/          # Supabase clients
│   └── lemonsqueezy/      # Payment helpers
└── types/
    └── database.ts        # TypeScript types

supabase/
└── migrations/            # Database migrations
```

## Pricing Tiers

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 3 testimonials, 1 widget |
| Starter | $19/mo | 25 testimonials, 3 widgets |
| Pro | $39/mo | Unlimited, integrations |

## Development

### Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding UI Components

```bash
npx shadcn@latest add [component-name]
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy

### Manual Deployment

```bash
npm run build
npm run start
```

## Contributing

This is a solo project. For feature requests, open an issue.

## License

MIT

## Support

For bugs and questions, reach out or check the documentation.

---

Built with ❤️ for indie makers
