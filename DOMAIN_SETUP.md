# Setting Up App Clips Domain

## Configuration

Configure your domain for App Clip invocation:
- Associated domains: `appclips:yourdomain.com`
- Start URL: Configured in `AppConfig.swift`
- App Clip invocation URLs: `https://yourdomain.com/?to=...`

## Required Setup

### 1. Create Apple App Site Association (AASA) File

Create this file on your web server:
```
https://yourdomain.com/.well-known/apple-app-site-association
```

**Important:** The file must:
- Be served over HTTPS
- Have `Content-Type: application/json` header
- Be accessible without redirects (no 301/302)
- Return 200 status code

### 2. AASA File Content

```json
{
  "appclips": {
    "apps": [
      "TEAM_ID.YOUR_BUNDLE_ID.Clip"
    ]
  }
}
```

**Replace:**
- `TEAM_ID` with your Apple Developer Team ID
- `YOUR_BUNDLE_ID` with your app's bundle identifier (e.g., `com.cyango.webxrios`)

**Find Team ID** in [Apple Developer Portal](https://developer.apple.com/account) → Membership:
- It's a 10-character alphanumeric string (e.g., `ABC123DEF4`)

### 3. Example Server Configuration

**Nginx:**
```nginx
location /.well-known/apple-app-site-association {
    default_type application/json;
    add_header Content-Type application/json;
}
```

**Apache (.htaccess):**
```apache
<Files "apple-app-site-association">
    Header set Content-Type "application/json"
</Files>
```

**Vercel/Netlify:**
Create `public/.well-known/apple-app-site-association` with the JSON content.

### 4. Verify AASA File

Test that it's accessible:
```bash
curl https://yourdomain.com/.well-known/apple-app-site-association
```

Should return JSON with `Content-Type: application/json` header.

### 5. App Clip Invocation URLs

Your App Clip will be invoked from URLs like:
```
https://yourdomain.com/?to=https://example.com/webxr-app
```

The app will:
1. Detect the App Clip invocation
2. Extract the `?to=` parameter
3. Load the target URL in the WebView

### 6. Testing

1. Deploy the AASA file to your domain
2. Build and install the app on a device
3. Visit `https://yourdomain.com/?to=https://threejs.org/examples/webxr_ar_cones.html`
4. iOS should show an App Clip card
5. Tap to launch your App Clip

## Troubleshooting

- **App Clip card doesn't appear**: Check AASA file is accessible and has correct Team ID
- **Wrong Content-Type**: Ensure server returns `application/json`
- **Redirects**: AASA file must be directly accessible (no redirects)
- **HTTPS required**: Must use HTTPS, not HTTP
