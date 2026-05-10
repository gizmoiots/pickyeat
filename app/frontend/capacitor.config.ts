import type { CapacitorConfig } from "@capacitor/cli";

// Capacitor wraps the PWA into native iOS + Android binaries for store submission.
// Phase 5 of design/launch-plan.md.
//
// Usage (from app/frontend on a Mac with Xcode + Android Studio installed):
//   npm install @capacitor/core @capacitor/cli
//   npm install @capacitor/ios @capacitor/android
//   npx cap init                # only once, accepts these defaults
//   npm run build               # generates .next
//   npx cap add ios
//   npx cap add android
//   npx cap sync
//   npx cap open ios            # launches Xcode for App Store submission
//   npx cap open android        # launches Android Studio for Play Store submission

const config: CapacitorConfig = {
  appId: "com.pickyeat.app",
  appName: "pickyeat",
  webDir: ".next",
  server: {
    // In production, the native shell points at the live PWA so updates
    // ship without resubmitting to the store.
    url: "https://pickyeat.com",
    cleartext: false
  },
  ios: {
    contentInset: "automatic",
    backgroundColor: "#FFF8EE"
  },
  android: {
    backgroundColor: "#FFF8EE",
    allowMixedContent: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#FFF8EE",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashImmersive: false,
      iosSpinnerStyle: "small"
    },
    Camera: {
      // Camera access for menu scan — handled by getUserMedia in the PWA,
      // Capacitor relays the permission prompt natively.
    },
    Geolocation: {
      // GPS for restaurant detection on app open.
    }
  }
};

export default config;
