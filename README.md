# Amrutam Super App

Production-ready Ayurvedic super app — Consultation, Shop, and Health Records — built with React Native CLI + TypeScript.

## Stack
- React Native 0.86 (bare CLI), TypeScript
- React Navigation (native-stack + bottom-tabs)
- TanStack Query (server state, offline cache persistence)
- Zustand + MMKV (client state: cart, wishlist, held slots)
- FlashList (virtualized lists — 5k doctors / 20k products / 10k records)
- react-native-keychain (secure token storage)
- Detox + Jest + React Testing Library + MSW (testing)

## Getting 
cd AmrutamSuperApp
```

---

## Install Dependencies

```bash
npm install
```

---

## Android Setup

Start an Android Emulator or connect a physical device.

Run:

```bash
npx react-native run-android
```

---

## iOS Setup

Install CocoaPods:

```bash
cd ios
pod install
cd ..
```

Run:

```bash
npx react-native run-ios
```

---

# 📦 Build Release APK

```bash
cd android
gradlew assembleRelease
```

APK Location

```
android/app/build/outputs/apk/release/app-release.apk
```

---

# 📦 Build Release AAB

```bash
cd android
gradlew bundleRelease
```

AAB Location

```
android/app/build/outputs/bundle/release/
```

---

# 🧪 Testing

Run unit tests

```bash
npm test
```

Run Detox tests

```bash
detox test
```

---

# 📱 Main Modules

- Authentication
- Home Dashboard
- Doctor Consultation
- Product Store
- Cart
- Wishlist
- Orders
- Health Records
- Profile
- Settings

---

# 🔒 Security

- Secure token storage using Keychain
- MMKV encrypted storage
- HTTPS API communication
- Session management
- Authentication persistence

---

# 📈 Performance Optimizations

- FlashList for large datasets
- Lazy loading
- Image optimization
- Query caching
- Offline persistence
- Optimized re-renders
- Background synchronization

---

# 📋 Scripts

```bash
npm start               # Start Metro
npm run android         # Run Android
npm run ios             # Run iOS
npm test                # Run Tests
npm run lint            # Lint Project
```

---

# 👨‍💻 Author

**Rishi Kumar**
