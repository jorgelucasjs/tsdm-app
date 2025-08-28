
import { mockGames } from '@/api/mocks/data';
import { useTheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { JSX, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GamesStackParamList } from '../navigation/AppNavigator';

type GameDetailRouteProp = RouteProp<GamesStackParamList, 'GameDetail'>;
type ActiveTab = 'sumario' | 'escalacoes' | 'estatisticas';

const formationPositions: Record<string, Record<string, { top: string; left: string }[]>> = {
    '4-4-2': {
        'Goalkeeper': [{ top: '47%', left: '7%' }],
        'Right Back': [{ top: '82%', left: '25%' }],
        'Central Defender': [{ top: '62%', left: '25%' }, { top: '32%', left: '25%' }],
        'Left Back': [{ top: '12%', left: '25%' }],
        'Right Winger': [{ top: '82%', left: '55%' }],
        'Central Midfielder': [{ top: '62%', left: '55%' }, { top: '32%', left: '55%' }],
        'Left Winger': [{ top: '12%', left: '55%' }],
        'Forward': [{ top: '62%', left: '80%' }, { top: '32%', left: '80%' }],
    },
};

const PlayerMarker: React.FC<{ player: any, positionStyle: object, teamColor: string, styles: any }> = ({ player, positionStyle, teamColor, styles }) => (
    <View style={[styles.playerMarker, positionStyle]}>
        <View style={[styles.playerCircle, { backgroundColor: teamColor }]}>
            <Text style={styles.playerNumber}>{player.number}</Text>
        </View>
        <Text style={styles.playerName} numberOfLines={1}>{player.player.lastname || player.player.common_name}</Text>
    </View>
);

const getPlayerPositions = (squad: any[], formation: string, teamType: 'home' | 'away', colors: any, styles: any) => {
    const positions = formationPositions[formation] || {};
    const playerElements: JSX.Element[] = [];
    const positionCounters: Record<string, number> = {};

    squad.forEach(p => {
        const posName = p.position_name;
        const posCounter = positionCounters[posName] || 0;
        const posStyles = positions[posName]?.[posCounter];

        if (posStyles) {
            const finalStyle = teamType === 'away' 
                ? { top: posStyles.top, left: `${100 - parseInt(posStyles.left, 10)}%` }
                : posStyles;

            playerElements.push(
                <PlayerMarker 
                    key={p.player.id} 
                    player={p} 
                    positionStyle={finalStyle}
                    teamColor={teamType === 'home' ? colors.primary : colors.primaryDark} 
                    styles={styles}
                />
            );
            positionCounters[posName] = posCounter + 1;
        }
    });
    return playerElements;
};

const SummaryTab: React.FC<{game: any, styles: any, colors: any}> = ({ game, styles, colors }) => (
    <View style={styles.content}>
        <Text style={styles.sectionTitle}>Sumário do Jogo</Text>
        {game?.events?.map((event:any, index:any) => (
            <View key={index} style={styles.eventRow}>
                <Text style={styles.eventTime}>{event.minute}</Text>
                <View style={styles.eventIcon}>
                    {event.event === 'Golo' && <MaterialIcons name="sports-soccer" size={20} color={colors.text} />}
                    {event.event.includes('Cartão') && <View style={{ width: 12, height: 16, backgroundColor: event.event.includes('Amarelo') ? '#FFC107' : '#D32F2F', borderRadius: 2 }} />}
                </View>
                <Text style={styles.eventDetails}>{event.player} ({event.event})</Text>
            </View>
        ))}
    </View>
);

const StatsTab: React.FC<{game: any, styles: any, colors: any}> = ({ game, styles, colors }) => {
    const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

    // Helper to get team name
    const getTeamName = (type: 'home' | 'away') => {
        if (!game?.lineups) {
            return type === 'home' ? game.teamA.name : game.teamB.name;
        }
        return type === 'home' ? game.teamA.name : game.teamB.name;
    };

    // Helper to get squad
    const getSquad = (type: 'home' | 'away') => {
        if (!game?.lineups) return [];
        return type === 'home' ? game.lineups.home.squad : game.lineups.away.squad;
    };

    // Helper to get coach
    const getCoach = (type: 'home' | 'away') => {
        if (!game?.lineups) return null;
        return type === 'home' ? game.lineups.home.coach : game.lineups.away.coach;
    };

    return (
        <View style={styles.content}>
            <Text style={styles.sectionTitle}>Estatísticas</Text>
            {game?.stats && Object.entries(game.stats.teamA).map(([key, valueA]) => {
                const valueB = game.stats!.teamB[key as keyof typeof game.stats.teamB];
                const total = valueA + valueB;
                const percentageA = 10//total > 0 ? (valueA / total) * 100 : 50;
                return (
                    <View key={key} style={{marginVertical: 12}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6}}>
                            <Text style={styles.statLabel}>{"valueA"}</Text>
                            <Text style={styles.statLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                            <Text style={styles.statLabel}>{valueB}</Text>
                        </View>
                        <View style={styles.statBarContainer}>
                            <View style={[styles.statBar, { width: `${percentageA}%`, backgroundColor: colors.primary }]} />
                            <View style={[styles.statBar, { width: `${100 - percentageA}%`, backgroundColor: colors.primaryDark }]} />
                        </View>
                    </View>
                );
            })}

            {/* Team Tabs */}
            {game?.lineups && (
                <View style={{marginTop: 24}}>
                    <View style={{flexDirection: 'row', marginBottom: 12, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.border}}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: selectedTeam === 'home' ? colors.primary : colors.card,
                                paddingVertical: 10,
                                alignItems: 'center'
                            }}
                            onPress={() => setSelectedTeam('home')}
                        >
                            <Text style={{color: selectedTeam === 'home' ? '#fff' : colors.text, fontFamily: 'Inter_700Bold'}}>
                                {getTeamName('home')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: selectedTeam === 'away' ? colors.primary : colors.card,
                                paddingVertical: 10,
                                alignItems: 'center'
                            }}
                            onPress={() => setSelectedTeam('away')}
                        >
                            <Text style={{color: selectedTeam === 'away' ? '#fff' : colors.text, fontFamily: 'Inter_700Bold'}}>
                                {getTeamName('away')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.lineupListContainer}>
                        {/* {getSquad(selectedTeam).map((p, i, arr) => (
                            <TouchableOpacity
                                key={p.player.id}
                                style={[styles.playerRow, i === arr.length-1 && {borderBottomWidth: 0}, {alignItems: 'center'}]}
                                onPress={() => { setSelectedPlayer(p); setModalVisible(true); }}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.playerListNumber}>{p.number}</Text>
                                <Image
                                    source={{ uri: p.player.img }}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                        marginRight: 8,
                                        backgroundColor: '#eee',
                                    }}
                                    resizeMode="cover"
                                />
                                <Text style={styles.playerListName}>{p.player.common_name}</Text>
                            </TouchableOpacity>
                        ))} */}
                        {(() => {
                            const coach = getCoach(selectedTeam);
                            return coach ? (
                                <Text style={styles.coachText}>Treinador: {coach.name}</Text>
                            ) : null;
                        })()}
                    </View>
                    {/* Player Modal */}
                    {selectedPlayer && (
                        <Modal
                            visible={modalVisible}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    backgroundColor: colors.card,
                                    padding: 24,
                                    borderRadius: 16,
                                    width: '85%',
                                    alignItems: 'center'
                                }}>
                                    <Image
                                        source={{ uri: selectedPlayer.player.img }}
                                        style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 16, backgroundColor: '#eee' }}
                                        resizeMode="cover"
                                    />
                                    <Text style={{ fontFamily: 'Inter_900Black', fontSize: 20, color: colors.text, marginBottom: 8 }}>
                                        {selectedPlayer.player.common_name}
                                    </Text>
                                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.text, marginBottom: 4 }}>
                                        {selectedPlayer.player.firstname} {selectedPlayer.player.lastname}
                                    </Text>
                                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.text, marginBottom: 4 }}>
                                        Número: {selectedPlayer.number}
                                    </Text>
                                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.text, marginBottom: 4 }}>
                                        Posição: {selectedPlayer.position_name}
                                    </Text>
                                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.text, marginBottom: 4 }}>
                                        Nacionalidade: {selectedPlayer.player.country?.name || '-'}
                                    </Text>
                                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.text, marginBottom: 4 }}>
                                        Altura: {selectedPlayer.player.height ? selectedPlayer.player.height + ' cm' : '-'}
                                    </Text>
                                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.text, marginBottom: 12 }}>
                                        Peso: {selectedPlayer.player.weight ? selectedPlayer.player.weight + ' kg' : '-'}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={{
                                            marginTop: 8,
                                            backgroundColor: colors.primary,
                                            paddingHorizontal: 24,
                                            paddingVertical: 10,
                                            borderRadius: 8
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Fechar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    )}
                </View>
            )}
        </View>
    );
};

const LineupsTab: React.FC<{game: any, styles: any, colors: any}> = ({ game, styles, colors }) => {
    if (!game?.lineups) {
        return (
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Escalações</Text>
                <Text style={styles.placeholderText}>Escalações não disponíveis para este jogo.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Escalações Iniciais</Text>
            <View style={styles.pitchContainer}>
                <View style={[styles.pitchLine, styles.centerCircle]} />
                <View style={[styles.pitchLine, styles.centerLine]} />
                {getPlayerPositions(game.lineups.home.squad, game.lineups.home.formation, 'home', colors, styles)}
                {getPlayerPositions(game.lineups.away.squad, game.lineups.away.formation, 'away', colors, styles)}
            </View>
        </ScrollView>
    );
};

const GameDetailScreen: React.FC = () => {
    const { colors } = useTheme();
    const route = useRoute<GameDetailRouteProp>();
    const { gameId } = route.params;
    const [activeTab, setActiveTab] = useState<ActiveTab>('sumario');

    const game: any | undefined = mockGames[0];
     //const game: Game | undefined = useMemo(() => mockGames.find(g => g.id === gameId), [gameId]);

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        header: { padding: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
        headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        teamDisplay: { flex: 1, alignItems: 'center', gap: 8 },
        teamLogo: { width: 50, height: 50 },
        teamName: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.text, textAlign: 'center' },
        scoreContainer: { alignItems: 'center', marginHorizontal: 16 },
        scoreText: { fontFamily: 'Inter_900Black', fontSize: 36, color: colors.text },
        statusText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.text, opacity: 0.8 },
        competitionText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.text, textAlign: 'center', marginTop: 12, opacity: 0.6 },
        tabContainer: { flexDirection: 'row', backgroundColor: colors.card, paddingHorizontal: 16 },
        tabButton: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
        activeTabButton: { borderBottomColor: colors.primary },
        tabText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.text, opacity: 0.6 },
        activeTabText: { opacity: 1 },
        content: { padding: 16 },
        sectionTitle: { fontFamily: 'Inter_900Black', fontSize: 20, color: colors.text, marginBottom: 12 },
        eventRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
        eventTime: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.text, width: 50 },
        eventIcon: { width: 30, alignItems: 'center' },
        eventDetails: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.text },
        statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
        statLabel: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.text },
        statBarContainer: { flexDirection: 'row', flex: 1, height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: colors.border, marginHorizontal: 16 },
        statBar: { height: '100%' },
        pitchContainer: { backgroundColor: '#3A7D44', borderRadius: 12, height: 600, position: 'relative', overflow: 'hidden', marginBottom: 16 },
        pitchLine: { position: 'absolute', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1 },
        centerCircle: { width: 120, height: 120, borderRadius: 60, top: '50%', left: '50%', transform: [{translateX: -60}, {translateY: -60}], zIndex: 0 },
        centerLine: { height: '100%', width: 0, top: 0, left: '50%' },
        playerMarker: { position: 'absolute', alignItems: 'center', gap: 4, width: 60 },
        playerCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)' },
        playerNumber: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#FFF' },
        playerName: { fontFamily: 'Inter_500Medium', fontSize: 10, color: '#FFF', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 4, borderRadius: 4 },
        lineupListContainer: { backgroundColor: colors.card, padding: 16, borderRadius: 12 },
        coachText: { fontFamily: 'Inter_700Bold', color: colors.text, opacity: 0.7, marginTop: 8 },
        playerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
        playerListNumber: { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.text, width: 30 },
        playerListName: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.text },
        placeholderText: { color: colors.text, textAlign: 'center', fontFamily: 'Inter_500Medium', opacity: 0.7, paddingVertical: 20 }
    });

    if (!game) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.teamDisplay}>
                        <Image source={{ uri: game.teamA.logo }} style={styles.teamLogo} resizeMode="contain" />
                        <Text style={styles.teamName}>{game.teamA.name}</Text>
                    </View>
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>{game.score}</Text>
                        <Text style={styles.statusText}>{game.status === 'Ao vivo' ? game.minute : game.status}</Text>
                    </View>
                    <View style={styles.teamDisplay}>
                        <Image source={{ uri: game.teamB.logo }} style={styles.teamLogo} resizeMode="contain" />
                        <Text style={styles.teamName}>{game.teamB.name}</Text>
                    </View>
                </View>
                <Text style={styles.competitionText}>{game.competition}</Text>
            </View>

            <View style={styles.tabContainer}>
                {(['sumario', 'escalacoes', 'estatisticas'] as ActiveTab[]).map(tab => (
                    <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}>
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {activeTab === 'sumario' && <SummaryTab game={game} styles={styles} colors={colors} />}
            {activeTab === 'estatisticas' && <StatsTab game={game} styles={styles} colors={colors} />}
            {activeTab === 'escalacoes' && <LineupsTab game={game} styles={styles} colors={colors} />}
        </ScrollView>
    );
};

export default GameDetailScreen;
