# Fix for NextAuth Secret Error

The error "Must pass 'secret' if not set to JWT getToken()" occurs when NEXTAUTH_SECRET is not properly configured.

## Solution

I've updated the middleware to pass the secret explicitly. Now you need to verify your .env.local file has this content:

```env
MONGODB_URI=mongodb+srv://ayeza123:ayeza123@cluster0.kvwjhsb.mongodb.net/the-indian-attic?retryWrites=true&w=majority&appName=Cluster0

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=indian-attic-secret-key-change-in-production-2024

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Steps to Fix

1. Open your `.env.local` file in the project root
2. Make sure it contains the NEXTAUTH_SECRET line exactly as shown above
3. Save the file
4. Restart the dev server (Ctrl+C and run `npm run dev` again)
5. Try logging in again

## If the error persists

The dev server should automatically reload when you save .env.local. If it doesn't:
1. Stop the dev server (Ctrl+C in terminal)
2. Run `npm run dev` again
3. Try logging in

The login should now work correctly.
