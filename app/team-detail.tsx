import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import TeamDetailScreen from '../screens/TeamDetailScreen';

const TeamDetail: React.FC = () => {
    const { teamId } = useLocalSearchParams<{ teamId: string }>();
    
    return <TeamDetailScreen teamId={teamId} />;
};

export default TeamDetail;