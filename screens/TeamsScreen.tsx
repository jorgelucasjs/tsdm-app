
import { mockTeams } from '@/api/mocks/data';
import Header from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TeamsScreen: React.FC = () => {
    const { colors } = useTheme();
    const router = useRouter();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
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
            padding: 16,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
        },
        logo: {
            width: 60,
            height: 60,
            resizeMode: 'contain',
            marginBottom: 12,
        },
        teamName: {
            fontFamily: 'Inter_700Bold',
            fontSize: 14,
            color: colors.text,
            textAlign: 'center',
        },
        competition: {
            fontFamily: 'Inter_400Regular',
            fontSize: 12,
            color: colors.text,
            opacity: 0.7,
            marginTop: 4,
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 12,
        },
        buttonText: {
            fontFamily: 'Inter_700Bold',
            color: colors.primary,
            fontSize: 12,
            marginRight: 4,
        }
    });

    const renderItem = ({ item }: { item: typeof mockTeams[0] }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push(`/team-detail?teamId=${item.id}`)}
        >
            <Image source={{ uri: item.logo }} style={styles.logo} />
            <Text style={styles.teamName}>{item.name}</Text>
            <Text style={styles.competition}>{item.competition}</Text>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Ver Equipa</Text>
                <MaterialIcons name="arrow-forward" size={14} color={colors.primary} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
             <Header />
            <FlatList
                data={mockTeams}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default TeamsScreen;
