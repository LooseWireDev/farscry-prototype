import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {SearchBar} from '../../components/SearchBar';
import {Avatar} from '../../components/Avatar';
import {EmptyState} from '../../components/EmptyState';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';

type SearchResult = {
  id: string;
  name: string;
  username: string;
};

const MOCK_RESULTS: SearchResult[] = [
  {id: '10', name: 'Sarah Lin', username: 'sarahlin'},
  {id: '11', name: 'Omar Hassan', username: 'omarh'},
  {id: '12', name: 'Yuki Tanaka', username: 'yukitan'},
];

export function AddContactScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);

  function handleSearch(text: string) {
    setQuery(text);
    if (text.trim().length >= 2) {
      const q = text.toLowerCase();
      setResults(
        MOCK_RESULTS.filter(
          r => r.name.toLowerCase().includes(q) || r.username.toLowerCase().includes(q),
        ),
      );
      setSearched(true);
    } else {
      setResults([]);
      setSearched(false);
    }
  }

  function handleAdd(_user: SearchResult) {
    // TODO: wire up contact service
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={query}
          onChangeText={handleSearch}
          placeholder="Search by username"
        />
      </View>

      {!searched ? (
        <EmptyState
          title="Find people"
          message="Search by username to add them to your contacts."
        />
      ) : results.length === 0 ? (
        <EmptyState
          title="No one found"
          message={`No users matching "${query}"`}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.row}>
              <Avatar name={item.name} size={44} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.username}>@{item.username}</Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAdd(item)}
                activeOpacity={0.7}>
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.body,
    color: colors.text,
  },
  username: {
    ...typography.footnote,
    color: colors.textSecondary,
  },
  addButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  addText: {
    ...typography.subhead,
    color: colors.white,
    fontWeight: '600',
  },
});
