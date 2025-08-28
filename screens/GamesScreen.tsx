
import { mockGames } from '@/api/mocks/data';
import Header from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameCard from '../components/GameCard';


const GamesScreen: React.FC = () => {
    const { colors } = useTheme();
    const [selectedDate, setSelectedDate] = useState<string>('Hoje');
    const [selectedCompetition, setSelectedCompetition] = useState<string>('Todas');
    const [selectedCountry, setSelectedCountry] = useState<string>('Todos');
    const [searchTeam, setSearchTeam] = useState<string>('');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    
    const dates = ['Ontem', 'Hoje', 'Amanhã', 'Esta semana'];
    const competitions = ['Todas', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1', 'Champions League'];
    const countries = ['Todos', 'Inglaterra', 'Espanha', 'Alemanha', 'Itália', 'França', 'Portugal', 'Brasil'];

    // Filter games based on selected filters
    const filteredGames = mockGames.filter(game => {
        const matchesCompetition = selectedCompetition === 'Todas' || game.competition === selectedCompetition;
        const matchesCountry = selectedCountry === 'Todos' || game.country === selectedCountry;
        const matchesTeam = searchTeam === '' || 
            game.homeTeam.toLowerCase().includes(searchTeam.toLowerCase()) ||
            game.awayTeam.toLowerCase().includes(searchTeam.toLowerCase());
        
        return matchesCompetition && matchesCountry && matchesTeam;
    });

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        filtersButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
        },
        filtersButtonText: {
            color: colors.text,
            marginRight: 4,
            fontSize: 14,
        },
        dateSelectorContainer: {
            paddingVertical: 10,
        },
        dateButton: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            marginHorizontal: 6,
        },
        dateText: {
            fontSize: 14,
            fontWeight: '600',
        },
        listContentContainer: {
            paddingHorizontal: 16,
            paddingBottom: 16,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 20,
            maxHeight: '80%',
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.card,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
        },
        closeButton: {
            padding: 4,
        },
        filterSection: {
            paddingHorizontal: 20,
            paddingVertical: 16,
        },
        filterTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 12,
        },
        filterOptions: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        filterOption: {
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.card,
        },
        filterOptionSelected: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        filterOptionText: {
            fontSize: 14,
            color: colors.text,
        },
        filterOptionTextSelected: {
            color: '#fff',
        },
        searchContainer: {
            paddingHorizontal: 20,
            paddingVertical: 16,
        },
        searchInput: {
            backgroundColor: colors.card,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: colors.text,
        },
        resultsCount: {
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        resultsText: {
            fontSize: 14,
            color: colors.text,
            opacity: 0.7,
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            
            {/* Filters Button */}
            <View style={styles.headerContainer}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>Jogos</Text>
                <TouchableOpacity 
                    style={styles.filtersButton}
                    onPress={() => setShowFilters(true)}
                >
                    <Text style={styles.filtersButtonText}>Filtros</Text>
                    <Ionicons name="filter" size={16} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* Date Selector */}
            <View style={styles.dateSelectorContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
                    {dates.map(date => (
                        <TouchableOpacity
                            key={date}
                            onPress={() => setSelectedDate(date)}
                            style={[
                                styles.dateButton,
                                { backgroundColor: selectedDate === date ? colors.primary : colors.card }
                            ]}
                        >
                            <Text style={[
                                styles.dateText,
                                { color: selectedDate === date ? '#fff' : colors.text }
                            ]}>
                                {date}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Results Count */}
            <View style={styles.resultsCount}>
                <Text style={styles.resultsText}>
                    {filteredGames.length} jogo{filteredGames.length !== 1 ? 's' : ''} encontrado{filteredGames.length !== 1 ? 's' : ''}
                </Text>
            </View>

            {/* Games List */}
            <FlatList
                data={filteredGames}
                renderItem={({ item }) => <GameCard game={item} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContentContainer}
                showsVerticalScrollIndicator={false}
            />

            {/* Filters Modal */}
            <Modal
                visible={showFilters}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFilters(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filtros</Text>
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={() => setShowFilters(false)}
                            >
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            {/* Search Team */}
                            <View style={styles.searchContainer}>
                                <Text style={styles.filterTitle}>Pesquisar Equipa</Text>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Digite o nome da equipa..."
                                    placeholderTextColor={colors.text + '80'}
                                    value={searchTeam}
                                    onChangeText={setSearchTeam}
                                />
                            </View>

                            {/* Competition Filter */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterTitle}>Competição</Text>
                                <View style={styles.filterOptions}>
                                    {competitions.map(competition => (
                                        <TouchableOpacity
                                            key={competition}
                                            style={[
                                                styles.filterOption,
                                                selectedCompetition === competition && styles.filterOptionSelected
                                            ]}
                                            onPress={() => setSelectedCompetition(competition)}
                                        >
                                            <Text style={[
                                                styles.filterOptionText,
                                                selectedCompetition === competition && styles.filterOptionTextSelected
                                            ]}>
                                                {competition}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Country Filter */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterTitle}>País</Text>
                                <View style={styles.filterOptions}>
                                    {countries.map(country => (
                                        <TouchableOpacity
                                            key={country}
                                            style={[
                                                styles.filterOption,
                                                selectedCountry === country && styles.filterOptionSelected
                                            ]}
                                            onPress={() => setSelectedCountry(country)}
                                        >
                                            <Text style={[
                                                styles.filterOptionText,
                                                selectedCountry === country && styles.filterOptionTextSelected
                                            ]}>
                                                {country}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default GamesScreen;
