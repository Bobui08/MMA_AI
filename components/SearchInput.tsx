import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface SearchInputProps {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = memo(
  ({ keyword, onKeywordChange }) => {
    const [localKeyword, setLocalKeyword] = useState(keyword);
    const searchTimeoutRef = useRef<number | null>(null);

    // Sync local keyword with prop when it changes externally (like clear filters)
    useEffect(() => {
      setLocalKeyword(keyword);
    }, [keyword]);

    // Debounced search handler
    const handleSearchChange = useCallback(
      (text: string) => {
        setLocalKeyword(text);

        // Clear existing timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for debounced search
        searchTimeoutRef.current = setTimeout(() => {
          onKeywordChange(text);
        }, 300); // 300ms debounce
      },
      [onKeywordChange]
    );

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }, []);

    return (
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search entries..."
          value={localKeyword}
          onChangeText={handleSearchChange}
          placeholderTextColor="#999"
        />
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if keyword prop changes
    return prevProps.keyword === nextProps.keyword;
  }
);

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
