# Testing The Indian Attic Authentication

## Database Connection Status
Database connection to MongoDB Atlas verified successfully.
- Cluster: cluster0.kvwjhsb.mongodb.net
- Database: the-indian-attic

## Testing Registration

1. Open http://localhost:3000/auth/register
2. Fill in the form:
   - Select role: Buyer or Artisan
   - Enter name
   - Enter email
   - Enter phone (optional)
   - Enter password (minimum 6 characters)
3. Click "Create Account"
4. You will be redirected to login page

## Testing Login

1. Open http://localhost:3000/auth/login
2. Enter your email and password
3. Click "Sign In"
4. You will be redirected to homepage

## Checking Data in MongoDB Atlas

After registration, check your MongoDB Atlas dashboard:
1. Go to https://cloud.mongodb.com
2. Navigate to your cluster
3. Click "Browse Collections"
4. Look for database: the-indian-attic
5. Check the "users" collection for your registered user

## Available Pages

- Homepage: http://localhost:3000
- Register: http://localhost:3000/auth/register
- Login: http://localhost:3000/auth/login

## Next Steps

After successful registration and login:
- Buyers will see buyer dashboard at /dashboard/buyer
- Artisans will see artisan dashboard at /dashboard/artisan (pending verification)
- Admins will see admin dashboard at /dashboard/admin
