// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
    // [Web-only]: Enables CSS support in Metro.
    isCSSEnabled: true,
});

// Configuração para resolver problemas com React Native Firebase no Expo 53
// Desabilitar package.json exports para compatibilidade com React Native Firebase
config.resolver.unstable_enablePackageExports = false;

// Add custom resolver to handle directory imports for React Native Firebase
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle @react-native-firebase/app/lib/common directory import
  if (moduleName === '@react-native-firebase/app/lib/common') {
    return {
      filePath: path.resolve(
        context.originModulePath,
        '../../../node_modules/@react-native-firebase/app/lib/common/index.js'
      ),
      type: 'sourceFile',
    };
  }
  
  // Handle other @react-native-firebase directory imports
  if (moduleName.startsWith('@react-native-firebase/') && moduleName.includes('/lib/')) {
    const parts = moduleName.split('/');
    if (parts.length >= 4 && !moduleName.endsWith('.js')) {
      const indexPath = path.resolve(
        context.originModulePath,
        `../../../node_modules/${moduleName}/index.js`
      );
      try {
        require.resolve(indexPath);
        return {
          filePath: indexPath,
          type: 'sourceFile',
        };
      } catch (e) {
        // Fall back to default resolution
      }
    }
  }
  
  // Fall back to default resolution
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;