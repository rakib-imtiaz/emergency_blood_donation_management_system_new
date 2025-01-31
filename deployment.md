# Initial Admin Setup

1. Set the following environment variables:
   - INITIAL_ADMIN_EMAIL
   - INITIAL_ADMIN_PASSWORD

2. Run the setup script:
   ```bash
   npm run setup-admin
   ```

3. Login with the credentials from your environment variables

4. After first login, immediately:
   - Change the admin password
   - Set up 2FA if implemented
   - Create additional admin accounts if needed

# Security Notes

- The initial admin setup script should only be run once
- All admin creation after initial setup must go through the proper admin interface
- Regular security audits should be performed
- Monitor admin creation logs 