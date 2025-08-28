
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface NewsCardProps {
  news: any;
  fullWidth?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, fullWidth = false }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
      width: fullWidth ? '100%' : 280,
      marginRight: fullWidth ? 0 : 16,
    },
    thumbnail: {
      width: '100%',
      height: 150,
      backgroundColor: colors.border,
    },
    content: {
      padding: 12,
    },
    category: {
      fontFamily: 'Inter_700Bold',
      fontSize: 10,
      color: colors.primary,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    title: {
      fontFamily: 'Inter_700Bold',
      fontSize: 16,
      color: colors.text,
      lineHeight: 22,
      marginBottom: 6,
    },
    date: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.text,
      opacity: 0.6,
    },
  });

  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: news.thumbnail }} style={styles.thumbnail} />
      <View style={styles.content}>
        <Text style={styles.category}>{news.category}</Text>
        <Text style={styles.title} numberOfLines={2}>{news.title}</Text>
        <Text style={styles.date}>{news.date}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NewsCard;
