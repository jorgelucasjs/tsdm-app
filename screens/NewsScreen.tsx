
import { mockNews } from '@/api/mocks/data';
import Header from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewsCard from '../components/NewsCard';


const categories = ['Todas', 'Jogos', 'Transferências', 'Entrevistas', 'Opiniões'];

const NewsScreen: React.FC = () => {
    const { colors } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState('Todas');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        categoriesContainer: {
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        categoriesScroll: {
            flexDirection: 'row',
            gap: 12,
        },
        categoryButton: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
        },
        activeCategoryButton: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        categoryText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
        },
        activeCategoryText: {
            color: '#fff',
        },
        contentContainer: {
            padding: 16,
        },
        separator: {
            height: 16,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 32,
        },
        emptyText: {
            fontSize: 16,
            color: colors.text,
            opacity: 0.6,
            textAlign: 'center',
            marginTop: 16,
        },
    });

    // Filter news based on selected category
    const filteredNews = selectedCategory === 'Todas' 
        ? mockNews 
        : mockNews.filter(news => news.category === selectedCategory);

    return (
        <SafeAreaView style={styles.container}>
            <Header  />
            
            {/* Categories */}
            <View style={styles.categoriesContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesScroll}
                >
                    {categories.map(category => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category && styles.activeCategoryButton
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === category && styles.activeCategoryText
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* News List */}
            {filteredNews.length > 0 ? (
                <FlatList
                    data={filteredNews}
                    renderItem={({ item }) => <NewsCard news={item} fullWidth />}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.contentContainer}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="newspaper-outline" size={64} color={colors.text} opacity={0.3} />
                    <Text style={styles.emptyText}>
                        Não há notícias disponíveis para a categoria "{selectedCategory}"
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default NewsScreen;
