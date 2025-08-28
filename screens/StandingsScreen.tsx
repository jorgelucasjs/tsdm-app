import Header from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import React, { useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data baseado na estrutura da API-Football
const mockStandings = {
    'Premier League': [
        { rank: 1, team: { name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' }, points: 89, played: 38, won: 28, draw: 5, lost: 5, goalsFor: 99, goalsAgainst: 26, goalsDiff: 73 },
        { rank: 2, team: { name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' }, points: 84, played: 38, won: 26, draw: 6, lost: 6, goalsFor: 88, goalsAgainst: 43, goalsDiff: 45 },
        { rank: 3, team: { name: 'Manchester United', logo: 'https://media.api-sports.io/football/teams/33.png' }, points: 75, played: 38, won: 23, draw: 6, lost: 9, goalsFor: 58, goalsAgainst: 43, goalsDiff: 15 },
        { rank: 4, team: { name: 'Newcastle', logo: 'https://media.api-sports.io/football/teams/34.png' }, points: 71, played: 38, won: 19, draw: 14, lost: 5, goalsFor: 68, goalsAgainst: 33, goalsDiff: 35 },
        { rank: 5, team: { name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' }, points: 67, played: 38, won: 19, draw: 10, lost: 9, goalsFor: 75, goalsAgainst: 47, goalsDiff: 28 },
    ],
    'La Liga': [
        { rank: 1, team: { name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' }, points: 88, played: 38, won: 28, draw: 4, lost: 6, goalsFor: 70, goalsAgainst: 20, goalsDiff: 50 },
        { rank: 2, team: { name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' }, points: 78, played: 38, won: 24, draw: 6, lost: 8, goalsFor: 75, goalsAgainst: 36, goalsDiff: 39 },
        { rank: 3, team: { name: 'Atletico Madrid', logo: 'https://media.api-sports.io/football/teams/530.png' }, points: 77, played: 38, won: 23, draw: 8, lost: 7, goalsFor: 70, goalsAgainst: 33, goalsDiff: 37 },
        { rank: 4, team: { name: 'Real Sociedad', logo: 'https://media.api-sports.io/football/teams/548.png' }, points: 71, played: 38, won: 20, draw: 11, lost: 7, goalsFor: 51, goalsAgainst: 35, goalsDiff: 16 },
        { rank: 5, team: { name: 'Villarreal', logo: 'https://media.api-sports.io/football/teams/533.png' }, points: 64, played: 38, won: 19, draw: 7, lost: 12, goalsFor: 59, goalsAgainst: 37, goalsDiff: 22 },
    ],
    'Bundesliga': [
        { rank: 1, team: { name: 'Bayern Munich', logo: 'https://media.api-sports.io/football/teams/157.png' }, points: 71, played: 34, won: 21, draw: 8, lost: 5, goalsFor: 92, goalsAgainst: 44, goalsDiff: 48 },
        { rank: 2, team: { name: 'Borussia Dortmund', logo: 'https://media.api-sports.io/football/teams/165.png' }, points: 71, played: 34, won: 22, draw: 5, lost: 7, goalsFor: 89, goalsAgainst: 52, goalsDiff: 37 },
        { rank: 3, team: { name: 'RB Leipzig', logo: 'https://media.api-sports.io/football/teams/173.png' }, points: 66, played: 34, won: 20, draw: 6, lost: 8, goalsFor: 65, goalsAgainst: 37, goalsDiff: 28 },
        { rank: 4, team: { name: 'Union Berlin', logo: 'https://media.api-sports.io/football/teams/182.png' }, points: 61, played: 34, won: 18, draw: 7, lost: 9, goalsFor: 51, goalsAgainst: 44, goalsDiff: 7 },
        { rank: 5, team: { name: 'SC Freiburg', logo: 'https://media.api-sports.io/football/teams/160.png' }, points: 59, played: 34, won: 17, draw: 8, lost: 9, goalsFor: 63, goalsAgainst: 49, goalsDiff: 14 },
    ]
};

const StandingsScreen: React.FC = () => {
    const { colors } = useTheme();
    const [selectedLeague, setSelectedLeague] = useState<string>('Premier League');
    const leagues = Object.keys(mockStandings);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        leagueSelectorContainer: {
            paddingVertical: 10,
        },
        leagueButton: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            marginHorizontal: 6,
        },
        leagueText: {
            fontSize: 14,
            fontWeight: '600',
        },
        tableContainer: {
            flex: 1,
            paddingHorizontal: 16,
        },
        tableHeader: {
            flexDirection: 'row',
            backgroundColor: colors.card,
            paddingVertical: 12,
            paddingHorizontal: 8,
            borderRadius: 8,
            marginBottom: 8,
        },
        headerText: {
            fontSize: 12,
            fontWeight: 'bold',
            color: colors.text,
            textAlign: 'center',
        },
        positionHeader: {
            width: 40,
        },
        teamHeader: {
            flex: 1,
            textAlign: 'left',
        },
        statHeader: {
            width: 35,
        },
        teamRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            paddingVertical: 12,
            paddingHorizontal: 8,
            marginBottom: 4,
            borderRadius: 8,
        },
        positionContainer: {
            width: 40,
            alignItems: 'center',
        },
        positionText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
        },
        teamContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },
        teamLogo: {
            width: 24,
            height: 24,
            marginRight: 8,
        },
        teamName: {
            fontSize: 14,
            color: colors.text,
            flex: 1,
        },
        statText: {
            width: 35,
            fontSize: 12,
            color: colors.text,
            textAlign: 'center',
        },
        pointsText: {
            fontWeight: 'bold',
            color: colors.primary,
        },
        championshipPosition: {
            backgroundColor: '#4CAF50',
        },
        europaLeaguePosition: {
            backgroundColor: '#FF9800',
        },
        relegationPosition: {
            backgroundColor: '#F44336',
        },
        positionIndicator: {
            width: 4,
            height: '100%',
            position: 'absolute',
            left: 0,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
        },
        legendContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: colors.card,
            marginHorizontal: 16,
            marginBottom: 16,
            borderRadius: 8,
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        legendColor: {
            width: 12,
            height: 12,
            borderRadius: 2,
            marginRight: 6,
        },
        legendText: {
            fontSize: 10,
            color: colors.text,
        },
    });

    const getPositionIndicatorColor = (position: number) => {
        if (position <= 4) return '#4CAF50'; // Champions League
        if (position <= 6) return '#FF9800'; // Europa League
        if (position >= 18) return '#F44336'; // Relegation
        return 'transparent';
    };

    const renderTeamRow = ({ item }: { item: any }) => (
        <View style={styles.teamRow}>
            <View style={[styles.positionIndicator, { backgroundColor: getPositionIndicatorColor(item.rank) }]} />
            <View style={styles.positionContainer}>
                <Text style={styles.positionText}>{item.rank}</Text>
            </View>
            <View style={styles.teamContainer}>
                <Image source={{ uri: item.team.logo }} style={styles.teamLogo} />
                <Text style={styles.teamName} numberOfLines={1}>{item.team.name}</Text>
            </View>
            <Text style={styles.statText}>{item.played}</Text>
            <Text style={styles.statText}>{item.won}</Text>
            <Text style={styles.statText}>{item.draw}</Text>
            <Text style={styles.statText}>{item.lost}</Text>
            <Text style={styles.statText}>{item.goalsDiff > 0 ? '+' : ''}{item.goalsDiff}</Text>
            <Text style={[styles.statText, styles.pointsText]}>{item.points}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            
            {/* League Selector */}
            <View style={styles.leagueSelectorContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
                    {leagues.map(league => (
                        <TouchableOpacity
                            key={league}
                            onPress={() => setSelectedLeague(league)}
                            style={[
                                styles.leagueButton,
                                { backgroundColor: selectedLeague === league ? colors.primary : colors.card }
                            ]}
                        >
                            <Text style={[
                                styles.leagueText,
                                { color: selectedLeague === league ? '#fff' : colors.text }
                            ]}>
                                {league}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Legend */}
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                    <Text style={styles.legendText}>Champions League</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
                    <Text style={styles.legendText}>Europa League</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
                    <Text style={styles.legendText}>Descida</Text>
                </View>
            </View>

            {/* Table */}
            <View style={styles.tableContainer}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.headerText, styles.positionHeader]}>#</Text>
                    <Text style={[styles.headerText, styles.teamHeader]}>Equipa</Text>
                    <Text style={[styles.headerText, styles.statHeader]}>J</Text>
                    <Text style={[styles.headerText, styles.statHeader]}>V</Text>
                    <Text style={[styles.headerText, styles.statHeader]}>E</Text>
                    <Text style={[styles.headerText, styles.statHeader]}>D</Text>
                    <Text style={[styles.headerText, styles.statHeader]}>DG</Text>
                    <Text style={[styles.headerText, styles.statHeader]}>Pts</Text>
                </View>

                {/* Table Rows */}
                <FlatList
                    data={mockStandings[selectedLeague as keyof typeof mockStandings]}
                    renderItem={renderTeamRow}
                    keyExtractor={(item) => item.rank.toString()}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

export default StandingsScreen;