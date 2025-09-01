# 🏥 MedChain Mobile - Healthcare Inventory Management App

A comprehensive React Native mobile application for MedChain - a blockchain-powered healthcare inventory management system with integrated clinical trial supply tracking and cold-chain monitoring capabilities.

## ✅ Recent Updates & Fixes

**Major Mobile App Overhaul (Latest)**
- ✅ **Fixed Navigation Issues** - Replaced cramped 6-tab navigation with clean 4-tab + drawer structure
- ✅ **Context Management** - Proper AuthProvider and ThemeProvider with persistent storage
- ✅ **Error Handling** - Added ErrorBoundary and LoadingScreen components
- ✅ **Mobile API Config** - Platform-specific URLs for Android emulator support
- ✅ **Enhanced UI/UX** - Custom drawer with user profile and theme toggle
- ✅ **Better Flow** - Streamlined navigation reduces user confusion

## 🌟 Features

### 🔐 Authentication
- **Secure Login System** with dummy credentials (admin/admin123)
- **Session Management** with automatic logout
- **Biometric Authentication** support (fingerprint/face ID)

### 📊 Dashboard
- **Real-time Statistics** - Total items, low stock alerts, inventory value
- **Quick Actions** - Direct navigation to Clinical Trials and Cold Chain
- **Recent Alerts** - Live notifications for critical events
- **System Status** - Backend connectivity and service health

### 🧪 Clinical Trials Management
- **Drug Batch Logging** - Complete batch information entry
- **Blockchain Verification** - Approved shipments tracking
- **Regulator Approval** - Role-based approval system
- **Batch Status** - Pending and approved states
- **Audit Trail** - Complete transaction history

### 🌡️ Cold-Chain Monitoring
- **Live Temperature & Humidity** - Real-time IoT sensor data
- **Interactive Charts** - Beautiful line charts with dual Y-axis
- **AI Risk Analysis** - ML-powered risk assessment
- **Status Indicators** - SAFE, WARNING, CRITICAL states
- **Real-time Updates** - Data refreshes every 3 seconds

### 🔔 Smart Notifications
- **Push Notifications** - Critical event alerts
- **Low Stock Warnings** - Automated inventory alerts
- **Expiry Notifications** - Proactive expiry management
- **Cold Chain Alerts** - Temperature and humidity warnings

### 🎨 User Experience
- **Light/Dark Mode** - Automatic theme switching
- **Mobile-First Design** - Optimized for touch interfaces
- **Responsive Layout** - Works on all screen sizes
- **Intuitive Navigation** - Bottom tab navigation
- **Modern UI Components** - Material Design with React Native Paper

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd medchain-mobile
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start the development server**
```bash
npm start
# or
yarn start
```

4. **Run on device/simulator**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication state
│   └── ThemeContext.js # Theme management
├── screens/            # App screens
│   ├── LoginScreen.js      # Login interface
│   ├── DashboardScreen.js  # Main dashboard
│   ├── ClinicalTrialsScreen.js # Clinical trials management
│   ├── ColdChainScreen.js  # Cold chain monitoring
│   └── SettingsScreen.js   # App settings
├── services/           # API and external services
│   └── api.js         # Backend API integration
└── utils/              # Utility functions
```

## 🔌 Backend Integration

The mobile app connects to the existing MedChain backend APIs:

- **Clinical Trials API** - `/trials` endpoints
- **Cold Chain API** - `/coldchain` endpoints with ML predictions
- **Inventory API** - `/inventory` endpoints
- **Blockchain API** - `/blockchain` endpoints
- **WebSocket** - Real-time data streaming

### API Configuration
Update the `API_BASE_URL` in `src/services/api.js` to point to your backend server.

## 🎯 Key Components

### Authentication System
- Secure login with credential validation
- Session persistence across app restarts
- Automatic logout on session expiry

### Real-time Monitoring
- Live temperature and humidity data
- IoT sensor simulation (3-second intervals)
- WebSocket integration for live updates

### ML Integration
- Risk prediction using backend ML models
- Temperature and humidity risk assessment
- Confidence scoring and recommendations

### Blockchain Features
- Batch approval workflow
- Regulator authentication
- Transaction history tracking

## 🎨 Customization

### Theme Configuration
- Light and dark mode support
- Custom color schemes
- Material Design components

### Styling
- Responsive design patterns
- Platform-specific adaptations
- Custom component styling

## 📦 Building for Production

### Expo Build
```bash
# Install EAS CLI
npm install -g @eas-cli

# Configure EAS
eas build:configure

# Build for platforms
eas build --platform ios
eas build --platform android
```

### Standalone Build
```bash
# Eject from Expo
expo eject

# Build native apps
npx react-native run-ios
npx react-native run-android
```

## 🔧 Development

### Code Style
- ESLint configuration
- Prettier formatting
- React Native best practices

### Testing
- Component testing with Jest
- Integration testing
- E2E testing with Detox

### Debugging
- React Native Debugger
- Flipper integration
- Console logging

## 📊 Performance

### Optimization Techniques
- Lazy loading of screens
- Image optimization
- Memory management
- Network request caching

### Monitoring
- Performance metrics
- Error tracking
- User analytics

## 🔒 Security

### Data Protection
- Secure API communication
- Local data encryption
- Biometric authentication
- Session management

### Privacy
- GDPR compliance
- Data anonymization
- User consent management

## 🌐 Platform Support

- **iOS** - iOS 12.0+
- **Android** - Android 6.0+ (API 23+)
- **Web** - Modern browsers

## 📈 Analytics & Monitoring

- User behavior tracking
- Performance metrics
- Error reporting
- Usage statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: [MedChain Docs](https://docs.medchain.com)
- **Issues**: [GitHub Issues](https://github.com/medchain/mobile/issues)
- **Email**: support@medchain.com
- **Discord**: [MedChain Community](https://discord.gg/medchain)

## 🙏 Acknowledgments

- React Native team for the amazing framework
- Expo team for the development tools
- React Native Paper for the UI components
- The healthcare community for inspiration

---

**MedChain Mobile** - Revolutionizing healthcare inventory management, one batch at a time. 🏥⚡
