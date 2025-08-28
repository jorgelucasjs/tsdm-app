import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameCard from '../components/GameCard';

// Mock data para detalhes da equipa
const mockTeamDetail = {
    id: 1,
    name: 'Manchester City',
    logo: 'https://media.api-sports.io/football/teams/50.png',
    country: 'Inglaterra',
    league: 'Premier League',
    founded: 1880,
    venue: 'Etihad Stadium',
    capacity: 55017,
    coach: 'Pep Guardiola',
    description: 'Manchester City Football Club é um clube de futebol inglês sediado em Manchester.',
    stats: {
        position: 1,
        points: 89,
        played: 38,
        won: 28,
        draw: 5,
        lost: 5,
        goalsFor: 99,
        goalsAgainst: 26,
        goalsDiff: 73
    }
};

const mockSquad = [
    { id: 1, name: 'Ederson', position: 'Guarda-Redes', number: 31, age: 30, nationality: 'Brasil', photo: 'https://media.api-sports.io/football/players/617.png' },
    { id: 2, name: 'Kyle Walker', position: 'Defesa', number: 2, age: 33, nationality: 'Inglaterra', photo: 'https://media.api-sports.io/football/players/618.png' },
    { id: 3, name: 'Ruben Dias', position: 'Defesa', number: 3, age: 26, nationality: 'Portugal', photo: 'https://media.api-sports.io/football/players/619.png' },
    { id: 4, name: 'John Stones', position: 'Defesa', number: 5, age: 29, nationality: 'Inglaterra', photo: 'https://media.api-sports.io/football/players/620.png' },
    { id: 5, name: 'Kevin De Bruyne', position: 'Médio', number: 17, age: 32, nationality: 'Bélgica', photo: 'https://media.api-sports.io/football/players/621.png' },
    { id: 6, name: 'Bernardo Silva', position: 'Médio', number: 20, age: 29, nationality: 'Portugal', photo: 'https://media.api-sports.io/football/players/622.png' },
    { id: 7, name: 'Erling Haaland', position: 'Avançado', number: 9, age: 23, nationality: 'Noruega', photo: 'https://media.api-sports.io/football/players/623.png' },
    { id: 8, name: 'Phil Foden', position: 'Médio', number: 47, age: 23, nationality: 'Inglaterra', photo: 'https://media.api-sports.io/football/players/624.png' },
];

const mockRecentGames = [
    {
        id: 1,
        teamA: { name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' },
        teamB: { name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' },
        score: '2 - 1',
        status: 'Terminado',
        competition: 'Premier League',
        minute: '90+3'
    },
    {
        id: 2,
        teamA: { name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' },
        teamB: { name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' },
        score: '0 - 3',
        status: 'Terminado',
        competition: 'Premier League',
        minute: '90'
    },
    {
        id: 3,
        teamA: { name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' },
        teamB: { name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png' },
        score: '1 - 1',
        status: 'Terminado',
        competition: 'Premier League',
        minute: '90+2'
    },
];

interface TeamDetailScreenProps {
    teamId?: string;
}

const TeamDetailScreen: React.FC<TeamDetailScreenProps> = ({ teamId }) => {
    const { colors } = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'squad' | 'games'>('overview');

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
        teamHeader: {
            alignItems: 'center',
            paddingTop: 60,
            paddingHorizontal: 20,
        },
        teamLogo: {
            width: 80,
            height: 80,
            marginBottom: 12,
        },
        teamName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: 4,
        },
        teamInfo: {
            fontSize: 16,
            color: '#fff',
            opacity: 0.9,
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
        playerCard: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 12,
            marginBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
        },
        playerPhoto: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 12,
        },
        playerInfo: {
            flex: 1,
        },
        playerName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
        },
        playerPosition: {
            fontSize: 12,
            color: colors.text,
            opacity: 0.7,
        },
        playerNumber: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.primary,
            marginRight: 8,
        },
        playerDetails: {
            alignItems: 'flex-end',
        },
        playerAge: {
            fontSize: 12,
            color: colors.text,
            opacity: 0.7,
        },
        playerNationality: {
            fontSize: 12,
            color: colors.text,
            opacity: 0.7,
        },
    });

    const renderOverview = () => (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Estatísticas da Temporada</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{mockTeamDetail.stats.position}º</Text>
                    <Text style={styles.statLabel}>Posição</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{mockTeamDetail.stats.points}</Text>
                    <Text style={styles.statLabel}>Pontos</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{mockTeamDetail.stats.won}</Text>
                    <Text style={styles.statLabel}>Vitórias</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{mockTeamDetail.stats.goalsFor}</Text>
                    <Text style={styles.statLabel}>Golos Marcados</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Informações do Clube</Text>
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fundado</Text>
                    <Text style={styles.infoValue}>{mockTeamDetail.founded}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Estádio</Text>
                    <Text style={styles.infoValue}>{mockTeamDetail.venue}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Capacidade</Text>
                    <Text style={styles.infoValue}>{mockTeamDetail.capacity.toLocaleString()}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Treinador</Text>
                    <Text style={styles.infoValue}>{mockTeamDetail.coach}</Text>
                </View>
            </View>
        </ScrollView>
    );

    const renderSquad = () => (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Plantel</Text>
            {mockSquad.map(player => (
                <TouchableOpacity 
                    key={player.id} 
                    style={styles.playerCard}
                    onPress={() => router.push(`/player-detail?playerId=${player.id}`)}
                >
                    <Text style={styles.playerNumber}>{player.number}</Text>
                    <Image source={{ uri: player.photo }} style={styles.playerPhoto} />
                    <View style={styles.playerInfo}>
                        <Text style={styles.playerName}>{player.name}</Text>
                        <Text style={styles.playerPosition}>{player.position}</Text>
                    </View>
                    <View style={styles.playerDetails}>
                        <Text style={styles.playerAge}>{player.age} anos</Text>
                        <Text style={styles.playerNationality}>{player.nationality}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderGames = () => (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Jogos Recentes</Text>
            {mockRecentGames.map(game => (
                <GameCard key={game.id} game={game} />
            ))}
        </ScrollView>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverview();
            case 'squad':
                return renderSquad();
            case 'games':
                return renderGames();
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
                
                <View style={styles.teamHeader}>
                    <Image source={{ uri: mockTeamDetail.logo }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>{mockTeamDetail.name}</Text>
                    <Text style={styles.teamInfo}>{mockTeamDetail.league} • {mockTeamDetail.country}</Text>
                </View>
            </View>

            <View style={styles.tabsContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
                    onPress={() => setActiveTab('overview')}
                >
                    <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Visão Geral</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'squad' && styles.activeTab]}
                    onPress={() => setActiveTab('squad')}
                >
                    <Text style={[styles.tabText, activeTab === 'squad' && styles.activeTabText]}>Plantel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'games' && styles.activeTab]}
                    onPress={() => setActiveTab('games')}
                >
                    <Text style={[styles.tabText, activeTab === 'games' && styles.activeTabText]}>Jogos</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                {renderContent()}
            </View>
        </SafeAreaView>
    );
};

export default TeamDetailScreen;