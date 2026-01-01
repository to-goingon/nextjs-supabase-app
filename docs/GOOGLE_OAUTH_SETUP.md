# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Next.js + Supabase application.

## Prerequisites

- A Supabase project (already configured in this project)
- A Google Cloud Console account

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** user type (unless you have a Google Workspace account)
   - Fill in the required fields:
     - App name
     - User support email
     - Developer contact information
   - Add scopes (minimum required):
     - `userinfo.email`
     - `userinfo.profile`
   - Add test users if in testing mode
6. Return to **Credentials** and create OAuth client ID:
   - Application type: **Web application**
   - Name: Your app name (e.g., "My Next.js App")
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production domain (e.g., `https://yourdomain.com`)
   - Authorized redirect URIs:
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`
     - Replace `<your-project-ref>` with your actual Supabase project reference

7. Click **Create** and save your **Client ID** and **Client Secret**

## Step 2: Configure Supabase

### Using Supabase Dashboard

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** in the provider list
5. Toggle **Enable Sign in with Google**
6. Enter your Google OAuth credentials:
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console
7. Click **Save**

### Using Supabase MCP Tools (Alternative)

If you have Supabase MCP configured, you can use the following command to check or configure the Google provider programmatically.

## Step 3: Verify Configuration

### Important URLs

Your Google OAuth callback URL should be:

```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

For this project (project_ref: `hbjjytsmhgsgbecthwky`):

```
https://hbjjytsmhgsgbecthwky.supabase.co/auth/v1/callback
```

Make sure this URL is added to your Google Cloud Console's **Authorized redirect URIs**.

### Application Callback URL

After successful authentication, users will be redirected to:

```
/auth/callback
```

This route handler exchanges the OAuth code for a Supabase session and redirects to `/protected`.

## Step 4: Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to the login page: `http://localhost:3000/auth/login`

3. Click the **Continue with Google** button

4. You should be redirected to Google's OAuth consent screen

5. After granting permission, you'll be redirected back to your app and logged in

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Verify that the redirect URI in Google Cloud Console exactly matches Supabase's callback URL
   - Check for typos, extra slashes, or incorrect project reference

2. **"Access blocked: This app's request is invalid"**
   - Make sure you've configured the OAuth consent screen
   - Verify that your email is added as a test user (if in testing mode)

3. **"Unable to exchange code for session"**
   - Check that your Supabase environment variables are correct
   - Verify that the Google provider is enabled in Supabase

4. **Cookie or session issues**
   - Ensure middleware is properly configured to call `getClaims()` after client creation
   - Check that the `supabaseResponse` is returned from middleware

### Development vs Production

- **Development**: Use `http://localhost:3000` in authorized origins
- **Production**: Add your production domain to both:
  - Authorized JavaScript origins
  - Update the redirect URI if using a custom domain

## Security Considerations

1. **Never commit credentials**: Keep your Google Client Secret secure and never commit it to version control
2. **Environment variables**: Store sensitive values in `.env.local` (already gitignored)
3. **HTTPS in production**: Always use HTTPS for production OAuth flows
4. **Scope minimization**: Only request the scopes your application needs

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)

## Implementation Details

### Files Modified

1. `/components/google-oauth-button.tsx` - Google OAuth button component
2. `/components/login-form.tsx` - Updated to include Google OAuth button
3. `/components/sign-up-form.tsx` - Updated to include Google OAuth button
4. `/app/auth/callback/route.ts` - OAuth callback handler

### Authentication Flow

1. User clicks "Continue with Google"
2. `GoogleOAuthButton` component calls `supabase.auth.signInWithOAuth()`
3. User is redirected to Google's OAuth consent screen
4. After consent, Google redirects to Supabase's callback URL with an authorization code
5. Supabase exchanges the code and redirects to `/auth/callback`
6. `/auth/callback` route handler calls `exchangeCodeForSession()`
7. Session is established and user is redirected to `/protected`

### Cookie-based Sessions

This implementation uses cookie-based sessions via `@supabase/ssr`, which means:

- Sessions work across Server Components, Client Components, and Route Handlers
- No additional configuration needed for session persistence
- Middleware handles session refresh automatically
