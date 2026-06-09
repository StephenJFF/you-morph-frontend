# YouMorph Frontend

Modern fitness platform frontend built with Next.js, React, and TypeScript.

## Features

- 🏠 Landing page with feature showcase
- 📝 User authentication (signup/login)
- 💪 Personalized fitness programs
- 📊 Progress tracking dashboard
- 🎯 Program filtering and discovery
- 📱 Mobile-responsive design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Authentication**: JWT (localStorage)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view in browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
  ├── layout.tsx          # Root layout with header/footer
  ├── page.tsx            # Landing page
  ├── globals.css         # Global styles
  ├── signup/page.tsx     # Signup page
  ├── login/page.tsx      # Login page
  ├── programs/page.tsx   # Programs listing
  └── dashboard/page.tsx  # User dashboard

components/
  ├── Header.tsx          # Navigation header
  ├── Footer.tsx          # Footer component
  └── ProgramCard.tsx     # Program display card

lib/
  ├── api.ts              # Axios API client
  └── auth.ts             # Auth utilities

public/                    # Static assets
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Pages

- `/` - Landing page
- `/programs` - Browse fitness programs
- `/signup` - Create new account
- `/login` - Login to existing account
- `/dashboard` - User dashboard (requires authentication)

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
