
import { useTheme } from '@/hooks/useTheme';
import FavoritesScreen from '@/screens/FavoritesScreen/FavoritesScreen';
import GameDetailScreen from '@/screens/GameDetailScreen';
import GamesScreen from '@/screens/GamesScreen';
import NewsScreen from '@/screens/NewsScreen';
import SearchScreen from '@/screens/SearchScreen';
import TeamsScreen from '@/screens/TeamsScreen';
import VideosScreen from '@/screens/VideosScreen';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { TouchableOpacity } from 'react-native';



export type RootTabParamList = {
    Início: undefined;
    Jogos: undefined;
    Pesquisa: undefined;
    Equipas: undefined;
    Tabelas: undefined;
    Notícias: undefined;
    Vídeos: undefined;
    Favoritos: undefined;
    Admin: undefined;
};

export type GamesStackParamList = {
  GamesList: undefined;
  GameDetail: { gameId: number };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const GamesStack = createStackNavigator<GamesStackParamList>();

const GamesNavigator = () => {
    const { colors } = useTheme();
    return (
        <GamesStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.card, shadowColor: 'transparent', elevation: 0 },
                headerTintColor: colors.text,
                headerTitleStyle: { fontFamily: 'Inter_700Bold' },
            }}
        >
            <GamesStack.Screen name="GamesList" component={GamesScreen} options={{ headerShown: false }} />
            <GamesStack.Screen name="GameDetail" component={GameDetailScreen} options={{ title: 'Detalhes do Jogo' }} />
        </GamesStack.Navigator>
    );
};

const AppNavigator: React.FC = () => {
    const { colors, isDark, toggleTheme } = useTheme();

    const screenOptions: BottomTabNavigationOptions = {
        headerStyle: {
            backgroundColor: colors.card,
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
        },
        headerTitleStyle: {
            color: colors.text,
            fontFamily: 'Inter_700Bold',
        },
        headerTitleAlign: 'left',
        tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: {
            fontFamily: 'Inter_500Medium',
            fontSize: 10,
        },
        headerRight: () => (
            <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
                <MaterialIcons name={isDark ? 'light-mode' : 'dark-mode'} size={24} color={colors.text} />
            </TouchableOpacity>
        ),
    };

    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={screenOptions}>
                {/* <Tab.Screen name="Início" component={HomeScreen} options={{
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} />,
                }} /> */}
                <Tab.Screen name="Jogos" component={GamesNavigator} options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="sports-soccer" color={color} size={size} />,
                }} />
                <Tab.Screen name="Pesquisa" component={SearchScreen} options={{
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="search" color={color} size={size} />,
                }} />
                <Tab.Screen name="Equipas" component={TeamsScreen} options={{
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="groups" color={color} size={size} />,
                }} />
                {/* <Tab.Screen name="Tabelas" component={StandingsScreen} options={{
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="leaderboard" color={color} size={size} />,
                    title: "Classificações"
                }} /> */}
                <Tab.Screen name="Notícias" component={NewsScreen} options={{
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="article" color={color} size={size} />,
                }} />
                <Tab.Screen name="Vídeos" component={VideosScreen} options={{
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="videocam" color={color} size={size} />,
                }} />
                <Tab.Screen name="Favoritos" component={FavoritesScreen} options={{
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="star" color={color} size={size} />,
                }} />
                {/* <Tab.Screen name="Admin" component={AdminScreen} options={{
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="admin-panel-settings" color={color} size={size} />,
                }} /> */}
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
