
import { mockVideos } from '@/api/mocks/data';
import Header from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const VideosScreen: React.FC = () => {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            //flex: 1,
            backgroundColor: colors.background,
        },
        contentContainer: {
            padding: 8,
        },
        card: {
            flex: 1,
            margin: 8,
            backgroundColor: colors.card,
            borderRadius: 12,
            overflow: 'hidden',
        },
        thumbnailContainer: {
            width: '100%',
            height: 120,
            backgroundColor: colors.border,
            justifyContent: 'center',
            alignItems: 'center',
        },
        playIconOverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        durationBadge: {
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: 4,
            paddingHorizontal: 6,
            paddingVertical: 2,
        },
        durationText: {
            color: '#FFF',
            fontFamily: 'Inter_700Bold',
            fontSize: 10,
        },
        titleContainer: {
            padding: 12,
        },
        title: {
            fontFamily: 'Inter_700Bold',
            fontSize: 14,
            color: colors.text,
            lineHeight: 20,
        },
    });

    const renderItem = ({ item }: { item: typeof mockVideos[0] }) => (
        <TouchableOpacity style={styles.card}>
            <ImageBackground source={{ uri: item.thumbnail }} style={styles.thumbnailContainer}>
                <View style={styles.playIconOverlay}>
                    <MaterialIcons name="play-circle-outline" size={48} color="#FFF" />
                </View>
                <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{item.duration}</Text>
                </View>
            </ImageBackground>
            <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <FlatList
                data={mockVideos}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default VideosScreen;
