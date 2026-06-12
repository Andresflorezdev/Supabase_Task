# Task Management App

A modern task management application built with Next.js, Supabase, and shadcn/ui. This app allows users to create, manage, and organize tasks with filtering capabilities, user authentication, and profile management.

## Features

- **User Authentication**: Sign up, sign in, and password recovery with email authentication
- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter tasks by search text, status (todo, in-progress, review, done), and priority (low, medium, high)
- **User Profile**: View and edit user profile with avatar support
- **Responsive Design**: Fully responsive UI built with Tailwind CSS
- **Modern UI Components**: Built with shadcn/ui for a polished user experience
- **Infinite Scroll**: Efficient pagination for large task lists

## Tech Stack

- **Framework**: Next.js 16.2.7 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast
- **Package Manager**: pnpm

## Prerequisites

Before running this project locally, ensure you have:

- Node.js 18+ installed
- pnpm installed (or npm/yarn)
- A Supabase account and project
- Git installed (optional, for cloning)

## Supabase Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and sign up/log in
   - Create a new project
   - Wait for the project to be ready (usually takes 2-3 minutes)

2. **Run SQL Setup**:
   - In your Supabase dashboard, go to the SQL Editor
   - Run the SQL script from `sb-auth-profiles.sql` to set up the profiles table
   - This creates the necessary database schema for user profiles

3. **Get Supabase Credentials**:
   - Go to Project Settings → API
   - Copy the following values:
     - Project URL
     - anon public key
     - service_role secret (for server-side operations)

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the placeholder values with your actual Supabase credentials.

## Installation

1. **Clone the repository**:
```bash
git clone <your-repository-url>
cd task-supabase
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env.local` (if available)
   - Add your Supabase credentials as shown above

4. **Run the development server**:
```bash
pnpm dev
```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
task-supabase/
├── actions/              # Server actions for database operations
│   ├── auth/            # Authentication actions
│   └── task/            # Task management actions
├── app/                 # Next.js app directory
│   ├── dashboard/       # Dashboard page and components
│   ├── profile/         # Profile page and components
│   ├── update-password/ # Password update page
│   └── page.tsx         # Landing page
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   ├── ui/             # shadcn/ui components
│   ├── Searchbar.tsx   # Search input component
│   └── TaskCard.tsx    # Task display component
├── context/            # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   ├── supabase/       # Supabase client configurations
│   └── utils.ts        # General utilities
├── interfaces/         # TypeScript interfaces
└── public/             # Static assets
```

## Database Schema

The application uses the following main tables:

- **profiles**: Extended user information (name, avatar_url, phone)
- **tasks**: Task records with title, description, status, priority, etc.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Authentication Flow

1. **Sign Up**: Users can create an account with email and password
2. **Sign In**: Existing users can log in with their credentials
3. **Password Recovery**: Users can reset their password via email
4. **Profile Management**: Users can update their profile information and avatar

## Task Management Features

- **Create Tasks**: Add new tasks with title, description, status, and priority
- **Edit Tasks**: Modify existing task details
- **Delete Tasks**: Remove tasks with confirmation dialog
- **Filter Tasks**: Filter by search text, status, and priority
- **Pagination**: Infinite scroll for efficient task loading


## Troubleshooting

### Common Issues

1. **Supabase Connection Errors**:
   - Verify your environment variables are correct
   - Check that your Supabase project is active
   - Ensure your IP is not blocked (if using IP restrictions)

2. **Authentication Issues**:
   - Make sure email confirmation is enabled/disabled in Supabase settings
   - Check that the profiles table exists in your database
   - Verify the SQL setup script was run successfully

3. **Build Errors**:
   - Clear the `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && pnpm install`
   - Check for TypeScript errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository.
