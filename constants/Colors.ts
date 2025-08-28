/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};


const primaryLight = '#D32F2F';
const primaryDark = '#EF5350';

export const lightColors = {
  primary: primaryLight,
  background: '#FFFFFF',
  card: '#F5F5F5',
  text: '#212121',
  border: '#E0E0E0',
  activeTab: '#FFCDD2',
  primaryDark: primaryDark, // keeping this for potential gradients
};

export const darkColors = {
  primary: primaryDark,
  background: '#121212',
  card: '#1E1E1E',
  text: '#E0E0E0',
  border: '#272727',
  activeTab: '#D81B60',
  primaryLight: primaryLight, // keeping this for potential gradients
  primaryDark: primaryDark,
};