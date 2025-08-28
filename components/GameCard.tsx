

import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface GameCardProps {
  game: any;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const { colors } = useTheme();
  
  const statusColor = game.status === 'Ao vivo' ? colors.primary : colors.text;

  const handlePress = () => {
    // Navigate to the GameDetail screen using Expo Router
    router.push(`/game-detail?gameId=${game.id}`);
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    competition: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginRight: 6,
    },
    statusText: {
      fontFamily: 'Inter_700Bold',
      fontSize: 12,
      color: statusColor,
    },
    body: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    teamContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    teamContainerRight: {
      justifyContent: 'flex-end',
    },
    logo: {
      width: 28,
      height: 28,
      resizeMode: 'contain',
    },
    teamName: {
      fontFamily: 'Inter_700Bold',
      fontSize: 16,
      color: colors.text,
    },
    scoreContainer: {
        backgroundColor: colors.background,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    score: {
      fontFamily: 'Inter_900Black',
      fontSize: 22,
      color: colors.text,
    },
    detailsButton: {
      marginTop: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    detailsText: {
      fontFamily: 'Inter_700Bold',
      fontSize: 14,
      color: colors.primary,
      marginRight: 4,
    }
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.competition}>{game.competition}</Text>
        <View style={styles.statusContainer}>
          {game.status === 'Ao vivo' && <View style={styles.liveDot} />}
          <Text style={styles.statusText}>{game.status === 'Ao vivo' ? game.minute : game.status}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={[styles.teamContainer, styles.teamContainerRight]}>
          <Text style={styles.teamName} numberOfLines={1}>{game.teamA.name}</Text>
          <Image source={{ uri: game.teamA.logo }} style={styles.logo} />
        </View>
        <View style={styles.scoreContainer}>
            <Text style={styles.score}>{game.score}</Text>
        </View>
        <View style={styles.teamContainer}>
          <Image source={{ uri: game.teamB.logo }} style={styles.logo} />
          <Text style={styles.teamName} numberOfLines={1}>{game.teamB.name}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.detailsButton} onPress={handlePress}>
        <Text style={styles.detailsText}>Ver Detalhes</Text>
        <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default GameCard;