# Admin Account Setup Guide

## Overview

This document explains how to create and manage administrator accounts for the Mlimi Anyamuke platform. Admin accounts have elevated privileges and should only be created by the developer or lead administrator.

## Creating Admin Accounts

### Method 1: Using the Admin Creation Script (Recommended)

The platform includes a secure script for creating admin accounts. This is the recommended method for production environments.

#### Steps:

1. **Navigate to the backend directory:**
   ```bash
   cd /home/kiziotech/Pictures/MAI/backend
   ```

2. **Run the admin creation script:**
   ```bash
   node scripts/create-admin.js
   ```

3. **Follow the prompts:**
   - Enter a username (minimum 3 characters)
   - Enter a password (minimum 6 characters)
   - Confirm the password

4. **Verify creation:**
   The script will display a confirmation message with the admin's details.

#### Example:

```bash
$ node scripts/create-admin.js

===========================================
  Mlimi Anyamuke - Admin Account Creator  
===========================================

✓ Database connection established

Enter admin username (min 3 characters): adminuser
Enter admin password (min 6 characters): ********
Confirm password: ********

Hashing password...
Creating admin account...

✓ Admin account created successfully!
===========================================
  Username: adminuser
  Role: admin
  ID: 2
===========================================
```

### Method 2: Default Admin Account (Development Only)

For development purposes, a default admin account is automatically created when the server starts for the first time:

- **Username:** `admin`
- **Password:** `admin123`

> **⚠️ SECURITY WARNING:**  
> Change the default admin password immediately in production environments. Delete this account and create a new one using the admin creation script.

## Logging In as Admin

1. Navigate to the login page: `http://your-domain.com/login`
2. Enter your admin credentials
3. Click "Login"
4. You will be redirected to the admin dashboard at `/dashboard`

## Resetting Admin Passwords

If you need to reset an admin password:

1. **Connect to the database directly** (using pgAdmin, psql, or your database tool)

2. **Hash a new password** using bcrypt:
   ```javascript
   const bcrypt = require('bcryptjs');
   const newPassword = 'your-new-password';
   const hashedPassword = await bcrypt.hash(newPassword, 10);
   console.log(hashedPassword);
   ```

3. **Update the user record:**
   ```sql
   UPDATE "Users" 
   SET password = '$2a$10$...' -- your hashed password here
   WHERE username = 'admin_username';
   ```

Alternatively, create a new admin account using the script and delete the old one.

## Security Best Practices

### Password Requirements

- Minimum 6 characters (enforced by the system)
- **Recommended:** Use at least 12 characters with a mix of:
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters

### Admin Account Management

1. **Limit admin accounts:** Only create admin accounts for trusted personnel
2. **Regular audits:** Periodically review the list of admin accounts
3. **Remove inactive admins:** Delete accounts that are no longer needed
4. **Use strong passwords:** Never use default or easily guessable passwords
5. **Secure the backend:** Ensure the backend server and database are properly secured

### Environment Variables

For added security, configure the JWT secret in your `.env` file:

```env
JWT_SECRET=your_very_long_and_random_secret_key_here
PORT=5000
```

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Checking Existing Admin Accounts

To list all admin accounts in the database:

```sql
SELECT id, username, role, "createdAt" 
FROM "Users" 
WHERE role = 'admin';
```

## Deleting Admin Accounts

### Using SQL:

```sql
DELETE FROM "Users" WHERE username = 'admin_username';
```

### Programmatically:

Create a script similar to `create-admin.js` that prompts for a username and deletes the account.

## Troubleshooting

### "Username already exists" error

The username is taken. Choose a different username or delete the existing account if it's no longer needed.

### "Database connection failed" error

- Ensure the database server is running
- Check your database credentials in the `.env` file or `config/database.js`
- Verify network connectivity to the database

### Unable to log in with admin credentials

1. Verify the username and password are correct
2. Check that the user's role is set to 'admin' in the database
3. Ensure the JWT secret is consistent across server restarts

## Support

For additional assistance with admin account management, contact the development team or refer to the main project documentation.
