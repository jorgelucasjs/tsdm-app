import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors, lightColors, darkColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView } from 'react-native';

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const currentColors = isDark ? darkColors : lightColors;
	
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: currentColors.background }}>
			
			<Tabs
				initialRouteName="index"
				screenOptions={{
					tabBarActiveTintColor: currentColors.primary,
					tabBarInactiveTintColor: isDark ? '#9BA1A6' : '#687076',
					headerShown: false,
					tabBarButton: HapticTab,
					tabBarBackground: TabBarBackground,
	//				animationEnabled: false,
					tabBarStyle: {
						backgroundColor: currentColors.card,
						borderTopColor: currentColors.border,
						borderTopWidth: 1,
						...Platform.select({
							ios: {
								// Use a transparent background on iOS to show the blur effect
								position: 'absolute',
							},
							default: {},
						}),
					},
				}}>
				<Tabs.Screen
					name="index"
					options={{
						tabBarShowLabel: false,
						 tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={28} color={color} />,
					}}
				/>
				<Tabs.Screen
					name="games"
					options={{
						tabBarShowLabel: false,
						 tabBarIcon: ({ color }) => <Ionicons name="game-controller-outline" size={28} color={color} />,
					}}
				/>
				<Tabs.Screen
					name="teams"
					options={{
						tabBarShowLabel: false,
						tabBarIcon: ({ color }) => <AntDesign name="team" size={28} color={color} />,
					}}
				/>
				<Tabs.Screen
					name="standings"
					options={{
						tabBarShowLabel: false,
						tabBarIcon: ({ color }) => <Ionicons name="trophy-outline" size={28} color={color} />,
					}}
				/>

				<Tabs.Screen
					name="videos"
					options={{
						tabBarShowLabel: false,
						tabBarIcon: ({ color }) => <Entypo name="video" size={28} color={color} />,
					}}
				/>
				<Tabs.Screen
					name="news"
					options={{
						tabBarShowLabel: false,
						tabBarIcon: ({ color }) => <Ionicons name="newspaper-outline" size={28} color={color} />,
					}}
				/>
			</Tabs>
		</SafeAreaView>
	);
}

