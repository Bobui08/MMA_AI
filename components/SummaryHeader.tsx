import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryHeaderProps {
  mostCommonMood: string;
  streak: number;
  highlightedCount: number;
  totalEntries: number;
}

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({
  mostCommonMood,
  streak,
  highlightedCount,
  totalEntries,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wellness Journey</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>{mostCommonMood}</Text>
          <Text style={styles.statLabel}>Most Common</Text>
          <Text style={styles.statSubLabel}>This Week</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
          <Text style={styles.statSubLabel}>Keep it up!</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{highlightedCount}</Text>
          <Text style={styles.statLabel}>Highlights</Text>
          <Text style={styles.statSubLabel}>Special moments</Text>
        </View>
      </View>
      
      <Text style={styles.entriesCount}>
        {totalEntries} {totalEntries === 1 ? 'entry' : 'entries'} total
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  entriesCount: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});
