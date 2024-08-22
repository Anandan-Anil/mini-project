import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';

const notifications = [
  { id: '1', message: 'Your profile has been updated successfully.' },
  { id: '2', message: 'New message from admin.' },
  { id: '3', message: 'Reminder: Submit your assignment by tomorrow.' },
  // Add more notifications here
];

export default function NotificationsPage() {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={["#C33764", "#1D2671"]}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              <Text style={styles.notificationText}>{item.message}</Text>
            </View>
          )}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
});
