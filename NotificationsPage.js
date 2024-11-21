import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';
import { db } from './firebase'; // Import Firebase Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]); // State to store fetched notifications
  const [error, setError] = useState(''); // State to store error message
  const theme = useTheme();

  // Fetch notifications from Firestore when component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationsRef = collection(db, 'notifications'); // Reference to the 'notifications' collection
        const querySnapshot = await getDocs(notificationsRef); // Fetch all documents in the collection
        const notificationsList = querySnapshot.docs.map(doc => ({
          id: doc.id, // Use Firestore document ID as key
          ...doc.data(), // Extract data from document
        }));
        setNotifications(notificationsList); // Set fetched notifications to state
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications. Please try again later.'); // Set error message if fetching fails
      }
    };

    fetchNotifications(); // Call the function to fetch notifications
  }, []); // Empty dependency array ensures it runs once when the component mounts

  return (
    <LinearGradient
      colors={['#C33764', '#1D2671']} // Gradient colors for background
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
        
        {/* Display error message if there's an error */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <FlatList
          data={notifications} // Use the state containing notifications
          keyExtractor={(item) => item.id} // Use Firestore document ID as the key
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              {/* Display heading if it exists */}
              <Text style={styles.notificationHeading}>{item.heading || 'No heading available'}</Text>
              {/* Display message */}
              <Text style={styles.notificationText}>{item.message || 'No message available'}</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent background for the form
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
  notificationHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5, // Space between heading and message
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
