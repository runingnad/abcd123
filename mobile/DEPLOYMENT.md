# MedCare Mobile App - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Expo CLI: `npm install -g @expo/cli`
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation & Running
```bash
cd mobile
npm install
npm start
```

### Demo Credentials
- **Username**: `admin`
- **Password**: `admin123`

## 📱 App Features

### ✅ Fixed Issues (Latest Update)
- **App Name**: Changed from MedCare to MedCare
- **Navigation**: Fixed cramped 6-tab layout → Clean 4-tab + drawer
- **Cold Chain**: Fixed live updates for all batches (BATCH001, BATCH002, BATCH003)
- **Data Issues**: Resolved NaN values in batch 2 & 3
- **Context Management**: Proper AuthProvider/ThemeProvider with persistence
- **Error Handling**: Added ErrorBoundary and LoadingScreen

### 🎯 Core Functionality
1. **Authentication**: Secure login with session persistence
2. **Dashboard**: Real-time stats, alerts, and quick actions
3. **Cold Chain Monitoring**: Live temperature/humidity tracking with AI analysis
4. **Clinical Trials**: Batch management and blockchain verification
5. **AI Drug Verification**: Camera-based drug authentication
6. **Patient Care**: Adherence tracking and management
7. **Settings**: Theme toggle, notifications, and app preferences

### 🔧 Technical Stack
- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Drawer + Bottom Tabs)
- **UI Library**: React Native Paper (Material Design 3)
- **State Management**: React Context API
- **Storage**: AsyncStorage for persistence
- **Charts**: React Native Chart Kit
- **Icons**: Expo Vector Icons + Lucide React Native

## 🌐 API Configuration

### Development URLs
- **Android Emulator**: `http://10.0.2.2:8000`
- **iOS Simulator**: `http://localhost:8000`
- **Physical Device**: Update to your computer's IP address

### Production
Update `src/services/api.js` with your production API URL.

## 📊 Live Data Features

### Cold Chain Monitoring
- **Real-time Updates**: Every 3 seconds
- **Multi-batch Support**: BATCH001, BATCH002, BATCH003
- **Unique Baselines**: Each batch has specific temp/humidity ranges
- **AI Analysis**: Risk assessment and anomaly detection

### Dashboard
- **Live Statistics**: Inventory counts, alerts, values
- **Real-time Alerts**: Low stock, expiry, cold chain warnings
- **System Status**: Backend connectivity monitoring

## 🎨 UI/UX Improvements

### Navigation Structure
- **Bottom Tabs**: Dashboard, Clinical Trials, Cold Chain, AI Verification
- **Drawer Menu**: Patient Care, Settings, Theme Toggle, Logout
- **Custom Drawer**: User profile, app version, quick theme switch

### Theme Support
- **Light/Dark Mode**: Automatic switching with persistence
- **Material Design 3**: Modern, accessible components
- **Responsive Design**: Works on all screen sizes

## 🔒 Security Features

### Authentication
- **Session Management**: Automatic token handling
- **Secure Storage**: Encrypted local storage
- **Auto-logout**: Session expiry handling

### API Security
- **Token Injection**: Automatic auth headers
- **Error Handling**: Proper 401/403 responses
- **Timeout Management**: 15-second request timeouts

## 📱 Platform Support

### Tested Platforms
- **Android**: 6.0+ (API 23+)
- **iOS**: 12.0+
- **Web**: Modern browsers (development)

### Build Commands
```bash
# Development
npm start

# Platform-specific
npm run android
npm run ios
npm run web

# Production builds
eas build --platform android
eas build --platform ios
```

## 🐛 Troubleshooting

### Common Issues
1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **Android emulator**: Ensure 10.0.2.2:8000 is accessible
3. **iOS simulator**: Use localhost:8000 for API calls
4. **Physical device**: Update API URL to computer's IP

### Debug Mode
- Shake device or Cmd+D (iOS) / Cmd+M (Android)
- Enable remote debugging
- Use React Native Debugger

## 📈 Performance Optimizations

### Implemented
- **Lazy Loading**: Screens load on demand
- **Memory Management**: Proper cleanup of intervals/listeners
- **Data Caching**: Efficient state management
- **Image Optimization**: Proper asset handling

### Monitoring
- **Error Boundaries**: Crash protection
- **Console Logging**: Comprehensive error tracking
- **Performance Metrics**: Load time monitoring

## 🔄 Continuous Updates

### Live Data Streams
- **Cold Chain**: 3-second intervals
- **Dashboard**: 30-second refresh
- **Notifications**: Real-time alerts

### Data Management
- **Batch History**: 24-point rolling window
- **Memory Efficient**: Automatic cleanup
- **Offline Support**: Graceful degradation

## 📞 Support

### Development
- Check console logs for detailed error information
- Use React Native Debugger for state inspection
- Enable network inspection for API issues

### Production
- Monitor crash reports
- Track user analytics
- Performance monitoring

---

**MedCare Mobile v1.0** - Healthcare inventory management reimagined for mobile devices. 🏥📱
