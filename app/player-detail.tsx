import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import PlayerDetailScreen from '../screens/PlayerDetailScreen';

const PlayerDetail: React.FC = () => {
    const { playerId } = useLocalSearchParams<{ playerId: string }>();
    
    return <PlayerDetailScreen playerId={playerId} />;
};

export default PlayerDetail;