import React, { useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


import { mockFavorites, mockSettings } from '@/api/mocks/data';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FavoritesScreen: React.FC = () => {
    const { colors } = useTheme();
    const [favorites, setFavorites] = useState<any[]>(mockFavorites);
    const [settings, setSettings] = useState<Record<string, boolean>>(
        // mockSettings.reduce((acc, setting) => {
        //     acc[setting.id] = setting.enabled;
        //     return acc;
        // }, {} as Record<string, boolean>)
    );

    const handleRemoveFavorite = (id: number) => {
        setFavorites(prev => prev.filter(fav => fav.id !== id));
    };

    const handleToggleSetting = (id: string) => {
       // setSettings(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const styles = StyleSheet.create({
        container: {
            //flex: 1,
            backgroundColor: colors.background,
        },
        scrollContainer: {
            padding: 16,
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontFamily: 'Inter_900Black',
            fontSize: 24,
            color: colors.text,
            marginBottom: 16,
        },
        card: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
        },
        favoriteItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        favoriteLogo: {
            width: 32,
            height: 32,
            resizeMode: 'contain',
            marginRight: 16,
        },
        favoriteName: {
            flex: 1,
            fontFamily: 'Inter_700Bold',
            fontSize: 16,
            color: colors.text,
        },
        removeButton: {
            padding: 8,
        },
        settingItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        settingLabel: {
            fontFamily: 'Inter_500Medium',
            fontSize: 16,
            color: colors.text,
        },
        emptyListContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
        },
        emptyListText: {
            fontFamily: 'Inter_500Medium',
            fontSize: 16,
            color: colors.text,
            opacity: 0.7,
            marginTop: 8,
            textAlign: 'center',
        },
    });

    const renderFavoriteItem = ({ item, index }: { item: any, index: number }) => (
        <View style={[styles.favoriteItem, index === favorites.length - 1 && { borderBottomWidth: 0 }]}>
            <Image source={{ uri: item.logo }} style={styles.favoriteLogo} />
            <Text style={styles.favoriteName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)} style={styles.removeButton}>
                <MaterialIcons name="remove-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Meus Favoritos</Text>
                    <View style={styles.card}>
                        <FlatList
                            {...{
                                data: favorites,
                                renderItem: renderFavoriteItem,
                                keyExtractor: (item: any) => item.id.toString(),
                                scrollEnabled: false,
                                ListEmptyComponent: (
                                    <View style={styles.emptyListContainer}>
                                        <MaterialIcons name="star-border" size={48} color={colors.text} style={{ opacity: 0.5 }} />
                                        <Text style={styles.emptyListText}>Ainda não tem favoritos.{'\n'}Adicione equipas e jogadores!</Text>
                                    </View>
                                )
                            } as any}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Configurações</Text>
                    <View style={styles.card}>
                        {mockSettings.map((setting, index) => (
                            <View key={setting.id} style={[styles.settingItem, index === mockSettings.length - 1 && { borderBottomWidth: 0 }]}>
                                <Text style={styles.settingLabel}>{setting.label}</Text>
                                {/* <Switch
                                    trackColor={{ false: '#767577', true: colors.primary }}
                                    thumbColor={settings[setting.id] ? colors.primaryDark : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => handleToggleSetting(setting.id)}
                                    value={settings[setting.id]}
                                /> */}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

    );
};

export default FavoritesScreen;