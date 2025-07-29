# Troubleshooting Guide

## Issue Resolution Summary

### ✅ **Fixed Issues:**

1. **Reanimated Babel Plugin Warning**
   - **Problem**: `react-native-reanimated/plugin` was deprecated
   - **Solution**: Updated to `react-native-worklets/plugin`
   - **Files Modified**: `babel.config.js`

2. **Directory Navigation Issue**
   - **Problem**: Running `npm start` from wrong directory
   - **Solution**: Always run from `Bisa1` directory
   - **Correct Path**: `C:\Users\HP\Downloads\Group-39-main (1)\Group-39-main\Bisa1`

## How to Start the App Correctly

### **Option 1: Using the Batch Script**
```bash
# Double-click the start-app.bat file
# OR run from command line:
start-app.bat
```

### **Option 2: Manual Navigation**
```bash
# Navigate to the correct directory
cd "C:\Users\HP\Downloads\Group-39-main (1)\Group-39-main\Bisa1"

# Start the app
npm start
```

### **Option 3: Direct Command**
```bash
# Run from any location (if you have the full path)
cd "C:\Users\HP\Downloads\Group-39-main (1)\Group-39-main\Bisa1" && npm start
```

## Common Issues and Solutions

### **1. "ENOENT: no such file or directory, open 'package.json'"**
**Cause**: Running `npm start` from wrong directory
**Solution**: 
```bash
cd "C:\Users\HP\Downloads\Group-39-main (1)\Group-39-main\Bisa1"
npm start
```

### **2. Reanimated Plugin Warnings**
**Cause**: Outdated Babel plugin configuration
**Solution**: ✅ **FIXED** - Updated `babel.config.js`

### **3. Drawer Navigation Not Working**
**Cause**: Missing gesture handler setup
**Solution**: Ensure `react-native-gesture-handler` is properly installed

### **4. Firebase Connection Issues**
**Cause**: Network or configuration problems
**Solution**: Check internet connection and Firebase config

## App State Preservation

### **✅ Original Features Maintained:**
- ✅ **Authentication System**: Firebase Auth integration
- ✅ **Navigation Structure**: Tab + Stack navigation
- ✅ **Theme System**: Dark/Light mode support
- ✅ **Question Cards**: Share and Fact-check features
- ✅ **Settings Screens**: All settings functionality
- ✅ **Help & Support**: Comprehensive help system
- ✅ **Forgot Password**: Multi-step password reset
- ✅ **User Profile**: Complete profile management

### **✅ New Features Added:**
- ✅ **Drawer Navigation**: Industry-standard side drawer
- ✅ **Hamburger Menu**: Easy access to all features
- ✅ **Organized Navigation**: Logical feature grouping
- ✅ **Real-time Settings**: Toggle switches for preferences

## Verification Checklist

### **Before Starting:**
- [ ] You're in the correct directory: `Bisa1`
- [ ] All dependencies are installed: `npm install`
- [ ] Babel config is updated: `babel.config.js`
- [ ] No TypeScript errors: `npx tsc --noEmit`

### **After Starting:**
- [ ] App launches without errors
- [ ] Drawer opens when hamburger menu is tapped
- [ ] All navigation items work correctly
- [ ] Theme switching works
- [ ] Firebase authentication works
- [ ] All existing features still function

## Directory Structure

```
Group-39-main/
└── Bisa1/                    ← **CORRECT DIRECTORY**
    ├── package.json          ← **MAIN PACKAGE FILE**
    ├── babel.config.js       ← **BABEL CONFIG**
    ├── App.tsx              ← **MAIN APP FILE**
    ├── src/                 ← **SOURCE CODE**
    │   ├── components/      ← **REACT COMPONENTS**
    │   ├── screens/         ← **APP SCREENS**
    │   ├── navigation/      ← **NAVIGATION**
    │   └── utils/           ← **UTILITIES**
    └── assets/              ← **IMAGES & ASSETS**
```

## Quick Commands

### **Start the App:**
```bash
cd "C:\Users\HP\Downloads\Group-39-main (1)\Group-39-main\Bisa1"
npm start
```

### **Install Dependencies:**
```bash
cd "C:\Users\HP\Downloads\Group-39-main (1)\Group-39-main\Bisa1"
npm install
```

### **Clear Cache:**
```bash
cd "C:\Users\HP\Downloads\Group-39-main (1)\Group-39-main\Bisa1"
npx expo start --clear
```

### **Check for Errors:**
```bash
cd "C:\Users\HP\Downloads\Group-39-main (1)\Group-39-main\Bisa1"
npx tsc --noEmit
```

## Emergency Recovery

### **If App Won't Start:**
1. **Clear all caches:**
   ```bash
   npx expo start --clear
   ```

2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Reset Metro bundler:**
   ```bash
   npx expo start --reset-cache
   ```

### **If Drawer Navigation Fails:**
1. **Check gesture handler:**
   ```bash
   npm install react-native-gesture-handler
   ```

2. **Verify Reanimated:**
   ```bash
   npm install react-native-reanimated
   ```

3. **Update Babel config** (already done)

## Success Indicators

### **✅ App is Working Correctly When:**
- ✅ Expo development server starts without errors
- ✅ App loads on device/simulator
- ✅ Hamburger menu (☰) appears in top-left
- ✅ Tapping hamburger opens drawer
- ✅ All drawer items navigate correctly
- ✅ Theme switching works
- ✅ Firebase authentication functions
- ✅ All existing features remain intact

## Support

If you encounter any issues:
1. Check this troubleshooting guide
2. Verify you're in the correct directory
3. Clear cache and restart
4. Check console for specific error messages

The app's original functionality is fully preserved while adding the new drawer navigation feature! 