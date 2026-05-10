# Capacitor native build notes

The PWA at `pickyeat.com` is the canonical experience. Capacitor wraps it into native iOS and Android binaries for App Store / Play Store distribution. Phase 5 deliverable per `design/launch-plan.md`.

## Prerequisites

**macOS** (required for iOS — Xcode is Mac-only).

- Xcode 15+ from the Mac App Store (free, ~5GB)
- Apple Developer Program account — ₹8,000/year — needed to submit to App Store
- Android Studio Hedgehog or later (free) — needed for Android build
- Google Play Developer account — ₹2,000 one-time — needed to submit to Play Store

## Setup, one-time

```bash
cd app/frontend
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npm install @capacitor/splash-screen @capacitor/status-bar @capacitor/geolocation @capacitor/camera
```

Then:

```bash
npx cap add ios
npx cap add android
npx cap sync
```

This creates `ios/` and `android/` folders inside `app/frontend/` with the native shells.

## Required iOS Info.plist additions

Open `ios/App/App/Info.plist` and add inside the top-level `<dict>`:

```xml
<key>NSCameraUsageDescription</key>
<string>pickyeat uses your camera to scan restaurant menus.</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>pickyeat uses your location to detect the restaurant you're at.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>pickyeat lets you upload photos of dishes you've ordered.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>pickyeat may save dish photos you upload.</string>
```

Without these strings, Apple rejects the submission at review.

## Required Android permissions

Open `android/app/src/main/AndroidManifest.xml` and ensure these are present (Capacitor adds most automatically):

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.INTERNET" />
```

## Daily dev loop

After the one-time setup, the daily cycle is:

```bash
npm run build        # rebuild Next.js
npx cap sync         # copy web assets into ios/ and android/
npx cap open ios     # opens Xcode for testing on simulator or device
npx cap open android # opens Android Studio for testing
```

Submission to stores is a separate process — handled in Xcode (Product → Archive → Distribute) and Android Studio (Build → Generate Signed Bundle).

## Native vs PWA decision

The Capacitor shell *loads pickyeat.com directly* (set in `capacitor.config.ts → server.url`). This means:

- Native users get the latest version on every app open. No "update available" prompts.
- You can fix a bug on Vercel without resubmitting to the App Store.
- The native shell only needs to be resubmitted when you add a Capacitor plugin or change the icon / launch screen.

The downside: the native binary is essentially a wrapper for a webview that loads a remote URL. Apple has approved this pattern in 2024-2025 reviews for productivity apps. If reviewers push back, the fallback is to switch `server.url` to `null` and ship the static export bundled inside the binary — but that breaks the "always-fresh" property.

## Splash screen + icon

Place 1024×1024 PNGs in:

- `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024@1x.png`
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`

Or use `@capacitor/assets`:

```bash
npm install --save-dev @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor "#F26B3A" --splashBackgroundColor "#FFF8EE"
```

Source PNG goes at `app/frontend/resources/icon.png` (1024×1024) and the script regenerates all sizes for both platforms.
