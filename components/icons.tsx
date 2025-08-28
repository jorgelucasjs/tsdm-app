
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const SoccerBallIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", style }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 2L12 22" />
    <Path d="M2.5 9.5L21.5 9.5" />
    <Path d="M2.5 14.5L21.5 14.5" />
    <Path d="M9.5 2.5L9.5 21.5" />
    <Path d="M14.5 2.5L14.5 21.5" />
  </Svg>
);

export const SunIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", style }) => (
    <Svg height={size} width={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Circle cx="12" cy="12" r="5"/><Path d="M12 1v2"/><Path d="M12 21v2"/><Path d="m4.22 4.22 1.42 1.42"/><Path d="m18.36 18.36 1.42 1.42"/><Path d="M1 12h2"/><Path d="M21 12h2"/><Path d="m4.22 19.78 1.42-1.42"/><Path d="m18.36 5.64 1.42-1.42"/>
    </Svg>
);

export const MoonIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", style }) => (
    <Svg height={size} width={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </Svg>
);

export const ChevronUpIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", style }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><Path d="m18 15-6-6-6 6"/></Svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", style }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><Path d="m6 9 6 6 6-6"/></Svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", style }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><Path d="M5 12h14"/><Path d="m12 5 7 7-7 7"/></Svg>
);

export const BellIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", style }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
    <Path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </Svg>
);
