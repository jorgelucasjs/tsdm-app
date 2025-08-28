
import { mockCompetitions, mockSearchResults, mockSearchSuggestions } from '@/api/mocks/data';
import { useTheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import GameCard from '../components/GameCard';
import NewsCard from '../components/NewsCard';

type FilterType = 'game' | 'news' | 'team' | 'player';

const SearchScreen: React.FC = () => {
    const { colors } = useTheme();
    const [query, setQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    
    const initialFilters = { competitions: [] as string[], types: [] as FilterType[] };
    const [activeFilters, setActiveFilters] = useState(initialFilters);
    const [tempFilters, setTempFilters] = useState(initialFilters);

    const suggestions = useMemo(() => {
        if (!query) return [];
        return mockSearchSuggestions
            .filter(s => s.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 15);
    }, [query]);

    const handleSearchSubmit = (text: string) => {
        setQuery(text);
        setSubmittedQuery(text);
    };
    
    const filteredResults = useMemo(() => {
        if (!submittedQuery) return [];

        let results = mockSearchResults.filter(item => {
            const data = item.data;
            let searchableText = '';
            if (item.type === 'game') searchableText = `${(data as any).teamA.name} ${(data as any).teamB.name} ${(data as any).competition}`;
            else if (item.type === 'news') searchableText = (data as any).title;
            else if (item.type === 'team') searchableText = `${(data as any).name} ${(data as any).competition}`;
            else if (item.type === 'player') searchableText = (data as any).name;
            return searchableText.toLowerCase().includes(submittedQuery.toLowerCase());
        });

        if (activeFilters.types.length > 0) {
            results = results.filter(item => activeFilters.types.includes(item.type as FilterType));
        }

        if (activeFilters.competitions.length > 0) {
            results = results.filter(item => {
                const data = item.data;
                if (item.type === 'game') return activeFilters.competitions.includes((data as any).competition);
                if (item.type === 'team') return activeFilters.competitions.includes((data as any).competition);
                return false;
            });
        }

        return results.slice(0, 15);
    }, [submittedQuery, activeFilters]);

    const openFilterModal = () => {
        setTempFilters(activeFilters);
        setFilterModalVisible(true);
    };

    const applyFilters = () => {
        setActiveFilters(tempFilters);
        setFilterModalVisible(false);
    };
    
    const toggleFilter = (type: 'competitions' | 'types', value: string) => {
        setTempFilters(prev => {
            const current = prev[type] as string[];
            const newValues = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [type]: newValues };
        });
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        searchContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
        searchInput: { flex: 1, height: 40, backgroundColor: colors.background, borderRadius: 8, paddingHorizontal: 12, fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.text, marginLeft: 8 },
        filterButton: { padding: 8, marginLeft: 8 },
        suggestionItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
        suggestionText: { fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.text },
        listContainer: { paddingHorizontal: 16, paddingTop: 16 },
        resultItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: 12, borderRadius: 8, marginBottom: 12 },
        resultLogo: { width: 40, height: 40, resizeMode: 'contain', marginRight: 12 },
        playerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
        resultTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: colors.text },
        resultType: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.text, opacity: 0.7, textTransform: 'capitalize' },
        modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
        modalContent: { height: '75%', backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16 },
        modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
        modalTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: colors.text },
        filterSectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: colors.text, marginTop: 20, marginBottom: 10 },
        filterOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
        filterLabel: { fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.text, marginLeft: 12 },
        applyButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
        applyButtonText: { color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 16 },
        emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
        emptyText: { fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.text, opacity: 0.7, textAlign: 'center', marginTop: 16 },
    });

    const renderResultItem = ({ item }: { item: any }) => {
        switch (item.type) {
            case 'game': return <GameCard game={item.data as any} />;
            case 'news': return <View style={{ paddingBottom: 12 }}><NewsCard news={item.data as any} fullWidth /></View>;
            case 'team':
                const team = item.data as any;
                return (
                    <TouchableOpacity style={styles.resultItem}>
                        <Image source={{ uri: team.logo }} style={styles.resultLogo} />
                        <View>
                            <Text style={styles.resultTitle}>{team.name}</Text>
                            <Text style={styles.resultType}>Equipa • {team.competition}</Text>
                        </View>
                    </TouchableOpacity>
                );
            case 'player':
                const player = item.data as any;
                return (
                    <TouchableOpacity style={styles.resultItem}>
                        <View style={styles.playerAvatar}><MaterialIcons name="person" size={24} color={colors.text} /></View>
                        <View>
                            <Text style={styles.resultTitle}>{player.name}</Text>
                            <Text style={styles.resultType}>Jogador • {player.position}</Text>
                        </View>
                    </TouchableOpacity>
                );
            default: return null;
        }
    };

    const FilterModal = () => (
        <Modal transparent visible={isFilterModalVisible} animationType="slide" onRequestClose={() => setFilterModalVisible(false)}>
            <SafeAreaView style={styles.modalContainer} onTouchEnd={() => setFilterModalVisible(false)}>
                <View style={styles.modalContent} onTouchEnd={(e) => e.stopPropagation()}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filtros de Pesquisa</Text>
                        <TouchableOpacity onPress={() => setFilterModalVisible(false)}><MaterialIcons name="close" size={24} color={colors.text} /></TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.filterSectionTitle}>Tipo de Conteúdo</Text>
                        {(['game', 'news', 'team', 'player'] as const).map(type => (
                            <TouchableOpacity key={type} style={styles.filterOption} onPress={() => toggleFilter('types', type)}>
                                <MaterialIcons name={tempFilters.types.includes(type) ? 'check-box' : 'check-box-outline-blank'} size={24} color={colors.primary} />
                                <Text style={styles.filterLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                            </TouchableOpacity>
                        ))}

                        <Text style={styles.filterSectionTitle}>Competições</Text>
                        {mockCompetitions.slice(0, 15).map(comp => (
                             <TouchableOpacity key={comp} style={styles.filterOption} onPress={() => toggleFilter('competitions', comp)}>
                                <MaterialIcons name={tempFilters.competitions.includes(comp) ? 'check-box' : 'check-box-outline-blank'} size={24} color={colors.primary} />
                                <Text style={styles.filterLabel}>{comp}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                        <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={24} color={colors.text} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar equipas, jogadores..."
                    placeholderTextColor={colors.text + '80'}
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={(e) => handleSearchSubmit(e.nativeEvent.text)}
                    returnKeyType="search"
                    onFocus={() => setSubmittedQuery('')}
                />
                <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
                    <MaterialIcons name="filter-list" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>
            
            {submittedQuery ? (
                <FlatList
                    data={filteredResults}
                    renderItem={renderResultItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                             <MaterialIcons name="search-off" size={64} color={colors.text} style={{ opacity: 0.5 }} />
                             <Text style={styles.emptyText}>Nenhum resultado encontrado para "{submittedQuery}". Tente uma pesquisa diferente ou ajuste os filtros.</Text>
                        </View>
                    )}
                />
            ) : query ? (
                 <FlatList
                    data={suggestions}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSearchSubmit(item)}>
                            <Text style={styles.suggestionText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                 <View style={styles.emptyContainer}>
                     <MaterialIcons name="search" size={64} color={colors.text} style={{ opacity: 0.5 }} />
                     <Text style={styles.emptyText}>Pesquise por jogos, notícias, equipas ou jogadores.</Text>
                </View>
            )}

            <FilterModal />
        </SafeAreaView>
    );
};

export default SearchScreen;
