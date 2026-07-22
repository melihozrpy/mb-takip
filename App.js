import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const initialItems = [
  { id: '1', title: 'Uygulama GitHub reposu hazir', done: true },
  { id: '2', title: 'Kalici backend secilecek', done: false },
  { id: '3', title: 'iOS build TestFlight icin alinacak', done: false }
];

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [draft, setDraft] = useState('');

  const completedCount = useMemo(
    () => items.filter((item) => item.done).length,
    [items]
  );

  const addItem = () => {
    const title = draft.trim();
    if (!title) return;

    setItems((current) => [
      { id: `${Date.now()}`, title, done: false },
      ...current
    ]);
    setDraft('');
  };

  const toggleItem = (id) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>MB Takip</Text>
          <Text style={styles.title}>Takip listesi</Text>
          <Text style={styles.subtitle}>
            Lovable veya local server baglantisi olmadan calisan Expo baslangici.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{items.length}</Text>
            <Text style={styles.statLabel}>Toplam</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>Tamam</Text>
          </View>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Yeni takip maddesi"
            placeholderTextColor="#64748b"
            returnKeyType="done"
            onSubmitEditing={addItem}
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            onPress={addItem}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Ekle</Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {items.map((item) => (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.done }}
              key={item.id}
              onPress={() => toggleItem(item.id)}
              style={styles.item}
            >
              <View style={[styles.check, item.done && styles.checkDone]}>
                <Text style={styles.checkText}>{item.done ? 'OK' : ''}</Text>
              </View>
              <Text style={[styles.itemText, item.done && styles.itemDone]}>
                {item.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 36
  },
  header: {
    paddingTop: 18,
    paddingBottom: 22
  },
  kicker: {
    color: '#5eead4',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18
  },
  statBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    flex: 1,
    padding: 16
  },
  statValue: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '800'
  },
  statLabel: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    color: '#0f172a',
    flex: 1,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#14b8a6',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18
  },
  addButtonText: {
    color: '#042f2e',
    fontSize: 15,
    fontWeight: '800'
  },
  list: {
    gap: 10
  },
  item: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    minHeight: 58,
    padding: 14
  },
  check: {
    alignItems: 'center',
    borderColor: '#94a3b8',
    borderRadius: 6,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    width: 28
  },
  checkDone: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6'
  },
  checkText: {
    color: '#042f2e',
    fontSize: 10,
    fontWeight: '900'
  },
  itemText: {
    color: '#0f172a',
    flex: 1,
    fontSize: 16,
    fontWeight: '700'
  },
  itemDone: {
    color: '#64748b',
    textDecorationLine: 'line-through'
  }
});
