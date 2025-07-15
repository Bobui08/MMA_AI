import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MoodEntry } from '../types';

interface MoodCardProps {
  entry: MoodEntry;
  onToggleHighlight: (id: number) => void;
}

export const MoodCard: React.FC<MoodCardProps> = ({ entry, onToggleHighlight }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateText = (text: string, maxLines: number = 2) => {
    const words = text.split(' ');
    const wordsPerLine = 8; // Approximate words per line
    const maxWords = maxLines * wordsPerLine;
    
    if (words.length <= maxWords) {
      return text;
    }
    
    return words.slice(0, maxWords).join(' ') + '...';
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.moodAndDate}>
          <Text style={styles.moodEmoji}>{entry.mood}</Text>
          <Text style={styles.date}>{formatDate(entry.date)}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => onToggleHighlight(entry.id)}
          style={styles.starButton}
        >
          <Text style={[styles.star, entry.highlighted && styles.starHighlighted]}>
            ⭐
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>{truncateText(entry.text)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodAndDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 20,
    opacity: 0.3,
  },
  starHighlighted: {
    opacity: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
});
