---
kind: external_dependency
name: Expo SDK (React Native)
slug: expo
category: external_dependency
category_hints:
    - vendor_identity
scope:
    - '**'
source_files:
    - mobile-app/package.json
    - mobile-app/.env.example
    - README.md
---

Development framework and build toolchain powering the mobile app. Uses Expo ~54 with React Native 0.81. The app is launched via `npx expo start` and tested on physical devices through the Expo Go app. Environment variable EXPO_PUBLIC_API_URL configures the backend base URL per device/emulator.