import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data para detalhes do jogador
const mockPlayerDetail = {
    id: 1,
    name: 'Erling Haaland',
    photo: 'https://media.api-sports.io/football/players/1100.png',
    number: 9,
    position: 'Avançado',
    age: 23,
    nationality: 'Noruega',
    height: '194 cm',
    weight: '88 kg',
    team: {
        name: 'Manchester City',
        logo: 'https://media.api-sports.io/football/teams/50.png'
    },
    contract: {
        start: '2022-07-01',
        end: '2027-06-30'
    },
    stats: {
        appearances: 38,
        goals: 36,
        assists: 8,
        yellowCards: 3,
        redCards: 0,
        minutesPlayed: 2890,
        rating: 8.2
    },
    careerStats: {
        totalGoals: 174,
        totalAppearances: 201,
        totalAssists: 23,
        clubsPlayed: 4
    }
};

const mockRecentMatches = [
    { id: 1, opponent: 'Arsenal', result: 'V', score: '2-1', goals: 1, assists: 0, rating: 8.5, date: '2024-01-15' },
    { id: 2, opponent: 'Liverpool', result: 'V', score: '3-0', goals: 2, assists: 1, rating: 9.2, date: '2024-01-10' },
    { id: 3, opponent: 'Chelsea', result: 'E', score: '1-1', goals: 1, assists: 0, rating: 7.8, date: '2024-01-05' },
    { id: 4, opponent: 'Tottenham', result: 'V', score: '2-0', goals: 1, assists: 0, rating: 8.1, date: '2024-01-01' },
    { id: 5, opponent: 'Newcastle', result: 'V', score: '3-1', goals: 2, assists: 0, rating: 8.9, date: '2023-12-28' },
];

interface PlayerDetailScreenProps {
    playerId?: string;
}

const PlayerDetailScreen: React.FC<PlayerDetailScreenProps> = ({ playerId }) => {
    const { colors } = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'matches'>('overview');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        headerContainer: {
            backgroundColor: colors.primary,
            paddingBottom: 20,
        },
        backButton: {
            position: 'absolute',
            top: 50,
            left: 16,
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 20,
            padding: 8,
        },
        playerHeader: {
            alignItems: 'center',
            paddingTop: 60,
            paddingHorizontal: 20,
        },
        playerPhoto: {
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 12,
            borderWidth: 3,
            borderColor: '#fff',
        },
        playerName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: 4,
        },
        playerInfo: {
            fontSize: 16,
            color: '#fff',
            opacity: 0.9,
            textAlign: 'center',
        },
        numberBadge: {
            position: 'absolute',
            top: 70,
            right: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
        },
        numberText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#fff',
        },
        tabsContainer: {
            flexDirection: 'row',
            backgroundColor: colors.card,
            marginHorizontal: 16,
            marginTop: -10,
            borderRadius: 12,
            padding: 4,
        },
        tab: {
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            borderRadius: 8,
        },
        activeTab: {
            backgroundColor: colors.primary,
        },
        tabText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
        },
        activeTabText: {
            color: '#fff',
        },
        contentContainer: {
            flex: 1,
            padding: 16,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 12,
        },
        infoCard: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.background,
        },
        infoLabel: {
            fontSize: 14,
            color: colors.text,
            opacity: 0.7,
        },
        infoValue: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
        },
        statsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20,
        },
        statCard: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            flex: 1,
            minWidth: '45%',
            alignItems: 'center',
        },
        statValue: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.primary,
        },
        statLabel: {
            fontSize: 12,
            color: colors.text,
            opacity: 0.7,
            marginTop: 4,
            textAlign: 'center',
        },
        matchCard: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
        },
        resultBadge: {
            width: 30,
            height: 30,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        resultText: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#fff',
        },
        matchInfo: {
            flex: 1,
        },
        opponent: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
        },
        matchScore: {
            fontSize: 12,
            color: colors.text,
            opacity: 0.7,
        },
        matchStats: {
            alignItems: 'flex-end',
        },
        matchStatRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 2,
        },
        matchStatText: {
            fontSize: 12,
            color: colors.text,
            marginLeft: 4,
        },
        rating: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.primary,
        },
        teamContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
        },
        teamLogo: {
            width: 40,
            height: 40,
            marginRight: 12,
        },
        teamName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
        },
    });

    const getResultColor = (result: string) => {
        switch (result) {
            case 'V':
                return '#4CAF50';
            case 'E':
                return '#FF9800';
            case 'D':
                return '#F44336';
            default:
                return colors.text;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
        });
    };

    const renderOverview = () => (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.teamContainer}>
                <Image source={{ uri: mockPlayerDetail.team.logo }} style={styles.teamLogo} />
                <Text style={styles.teamName}>{mockPlayerDetail.team.name}</Text>
            </View>

            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Idade</Text>
                    <Text style={styles.infoValue}>{mockPlayerDetail.age} anos</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nacionalidade</Text>
                    <Text style={styles.infoValue}>{mockPlayerDetail.nationality}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Altura</Text>
                    <Text style={styles.infoValue}>{mockPlayerDetail.height}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Peso</Text>
                    <Text style={styles.infoValue}>{mockPlayerDetail.weight}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Posição</Text>
                    <Text style={styles.infoValue}>{mockPlayerDetail.position}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Contrato</Text>
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Início</Text>
                    <Text style={styles.infoValue}>{new Date(mockPlayerDetail.contract.start).toLocaleDateString('pt-PT')}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fim</Text>
                    <Text style={styles.infoValue}>{new Date(mockPlayerDetail.contract.end).toLocaleDateString('pt-PT')}</Text>
                </View>
            </View>
        </ScrollView>
    );

    const renderStats = () => (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Estatísticas da Temporada</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{mockPlayerDetail.stats.appearances}</Text>
                    <Text style={styles.statLabel}>Jogos</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{mockPlayerDetail.stats.goals}</Text>
                    <Text style={styles.statLabel}>Golos</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{mockPlayerDetail.stats.assists}</Text>
                    <Text style={styles.statLabel}>Assistências</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{mockPlayerDetail.stats.rating}</Text>
                    <Text style={styles.statLabel}>Avaliação Média</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{mockPlayerDetail.stats.yellowCards}</Text>
                    <Text style={styles.statLabel}>Cartões Amarelos</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{Math.round(mockPlayerDetail.stats.minutesPlayed / 60)}</Text>
                    <Text style={styles.statLabel}>Minutos Jogados</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Estatísticas de Carreira</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{mockPlayerDetail.careerStats.totalGoals}</Text>
                    <Text style={styles.statLabel}>Golos Totais</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{mockPlayerDetail.careerStats.totalAppearances}</Text>
                    <Text style={styles.statLabel}>Jogos Totais</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{mockPlayerDetail.careerStats.totalAssists}</Text>
                    <Text style={styles.statLabel}>Assistências Totais</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{mockPlayerDetail.careerStats.clubsPlayed}</Text>
                    <Text style={styles.statLabel}>Clubes</Text>
                </View>
            </View>
        </ScrollView>
    );

    const renderMatches = () => (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Últimos Jogos</Text>
            {mockRecentMatches.map(match => (
                <View key={match.id} style={styles.matchCard}>
                    <View style={[styles.resultBadge, { backgroundColor: getResultColor(match.result) }]}>
                        <Text style={styles.resultText}>{match.result}</Text>
                    </View>
                    <View style={styles.matchInfo}>
                        <Text style={styles.opponent}>vs {match.opponent}</Text>
                        <Text style={styles.matchScore}>{match.score} • {formatDate(match.date)}</Text>
                    </View>
                    <View style={styles.matchStats}>
                        <View style={styles.matchStatRow}>
                            <Ionicons name="football" size={12} color={colors.primary} />
                            <Text style={styles.matchStatText}>{match.goals}</Text>
                            <Ionicons name="hand-right" size={12} color={colors.primary} style={{ marginLeft: 8 }} />
                            <Text style={styles.matchStatText}>{match.assists}</Text>
                        </View>
                        <Text style={styles.rating}>{match.rating}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverview();
            case 'stats':
                return renderStats();
            case 'matches':
                return renderMatches();
            default:
                return renderOverview();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                
                <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>#{mockPlayerDetail.number}</Text>
                </View>
                
                <View style={styles.playerHeader}>
                    <Image source={{ uri: mockPlayerDetail.photo }} style={styles.playerPhoto} />
                    <Text style={styles.playerName}>{mockPlayerDetail.name}</Text>
                    <Text style={styles.playerInfo}>{mockPlayerDetail.position} • {mockPlayerDetail.nationality}</Text>
                </View>
            </View>

            <View style={styles.tabsContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
                    onPress={() => setActiveTab('overview')}
                >
                    <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
                    onPress={() => setActiveTab('stats')}
                >
                    <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>Estatísticas</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'matches' && styles.activeTab]}
                    onPress={() => setActiveTab('matches')}
                >
                    <Text style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}>Jogos</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                {renderContent()}
            </View>
        </SafeAreaView>
    );
};

export default PlayerDetailScreen;