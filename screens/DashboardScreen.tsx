import { mockGames, mockNews } from '@/api/mocks/data';
import Header from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameCard from '../components/GameCard';
import NewsCard from '../components/NewsCard';


const DashboardScreen: React.FC = () => {
    const { colors } = useTheme();

    // Filtrar jogos ao vivo e próximos jogos
    const liveGames = mockGames.filter(game => game.status === 'live').slice(0, 3);
    const upcomingGames = mockGames.filter(game => game.status === 'upcoming').slice(0, 3);
    const recentNews = mockNews.slice(0, 4);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContainer: {
            paddingBottom: 20,
        },
        sectionContainer: {
            marginVertical: 16,
            paddingHorizontal: 16,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
        },
        seeAllButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        seeAllText: {
            fontSize: 14,
            color: colors.primary,
            marginRight: 4,
        },
        welcomeContainer: {
            backgroundColor: colors.primary,
            margin: 16,
            padding: 20,
            borderRadius: 12,
        },
        welcomeText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: 8,
        },
        welcomeSubtext: {
            fontSize: 16,
            color: '#fff',
            opacity: 0.9,
        },
        statsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: colors.card,
            margin: 16,
            padding: 16,
            borderRadius: 12,
        },
        statItem: {
            alignItems: 'center',
        },
        statNumber: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.primary,
        },
        statLabel: {
            fontSize: 12,
            color: colors.text,
            opacity: 0.7,
            marginTop: 4,
        },
        liveIndicator: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ff4444',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            marginBottom: 8,
        },
        liveText: {
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
            marginLeft: 4,
        },
        emptyContainer: {
            alignItems: 'center',
            padding: 20,
        },
        emptyText: {
            color: colors.text,
            opacity: 0.6,
            fontSize: 14,
        },
    });

    const renderLiveGame = ({ item }: { item: any }) => (
        <View style={{ marginRight: 12, width: 280 }}>
            <GameCard game={item} />
        </View>
    );

    const renderNewsItem = ({ item }: { item: any }) => (
        <View style={{ marginRight: 12, width: 250 }}>
            <NewsCard news={item} />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Welcome Section */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Bem-vindo ao TSDM</Text>
                    <Text style={styles.welcomeSubtext}>Acompanhe o melhor do futebol mundial</Text>
                </View>

                {/* Stats Section */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{liveGames.length}</Text>
                        <Text style={styles.statLabel}>Jogos ao Vivo</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{upcomingGames.length}</Text>
                        <Text style={styles.statLabel}>Próximos Jogos</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{recentNews.length}</Text>
                        <Text style={styles.statLabel}>Notícias Hoje</Text>
                    </View>
                </View>

                {/* Live Games Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <View style={styles.liveIndicator}>
                                <View style={{ width: 8, height: 8, backgroundColor: '#fff', borderRadius: 4 }} />
                                <Text style={styles.liveText}>AO VIVO</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Jogos em Direto</Text>
                        </View>
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={styles.seeAllText}>Ver Todos</Text>
                            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    {liveGames.length > 0 ? (
                        <FlatList
                            data={liveGames}
                            renderItem={renderLiveGame}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhum jogo ao vivo no momento</Text>
                        </View>
                    )}
                </View>

                {/* Upcoming Games Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Próximos Jogos</Text>
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={styles.seeAllText}>Ver Todos</Text>
                            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    {upcomingGames.length > 0 ? (
                        <FlatList
                            data={upcomingGames}
                            renderItem={renderLiveGame}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhum jogo próximo</Text>
                        </View>
                    )}
                </View>

                {/* News Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Últimas Notícias</Text>
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={styles.seeAllText}>Ver Todas</Text>
                            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    {recentNews.length > 0 ? (
                        <FlatList
                            data={recentNews}
                            renderItem={renderNewsItem}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhuma notícia disponível</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DashboardScreen;