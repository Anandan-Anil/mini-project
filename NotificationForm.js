import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from './firebase'; // Import Firebase Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods

export default function NotificationForm({ navigation }) {
  const [heading, setHeading] = useState('');
  const [message, setMessage] = useState('');
  const theme = useTheme();

  const handleSendNotification = async () => {
    // Check if the required fields are filled
    if (!heading || !message) {
      alert('Please fill in both fields');
      return;
    }

    // Save notification to Firestore
    try {
      const notificationRef = collection(db, 'notifications'); // Reference to the 'notifications' collection
      await addDoc(notificationRef, {
        heading: heading,
        message: message,
        timestamp: new Date(), // You can store the timestamp of when the notification is sent
      });
      
      console.log('Notification sent:', { heading, message });

      // Clear fields after sending
      setHeading('');
      setMessage('');

      // Navigate back to the Admin page (or show a success feedback)
      navigation.goBack(); // Optionally navigate back to the Admin page
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('There was an error sending the notification.');
    }
  };

  return (
    <LinearGradient
      colors={['#FF8C00', '#FF6347']} // Gradient colors
      style={styles.background}
    >
      <View style={styles.container}>
        <Title style={styles.title}>Send Notification</Title>
        <TextInput
          label="Heading"
          value={heading}
          onChangeText={setHeading}
          style={styles.input}
          mode="outlined"
          placeholder="Enter notification heading"
          theme={{ colors: { text: theme.colors.primary, placeholder: theme.colors.primary } }}
        />
        <TextInput
          label="Message"
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          mode="outlined"
          multiline={true}
          numberOfLines={4}
          placeholder="Enter notification message"
          theme={{ colors: { text: theme.colors.primary, placeholder: theme.colors.primary } }}
        />
        <Button
          mode="contained"
          onPress={handleSendNotification}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Send Notification
        </Button>
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
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  button: {
    marginVertical: 10,
    paddingVertical: 5,
    backgroundColor: '#6200ee', // You can change the button color here
  },
  buttonLabel: {
    fontSize: 18,
    color: '#fff',
  },
});