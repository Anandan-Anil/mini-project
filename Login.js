import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase'; // Import the Firebase auth instance and db

import { collection, query, where, getDocs } from 'firebase/firestore';

// Helper functions for validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();
  const navigation = useNavigation();

  const handleLogin = async () => {
    setError(''); // Reset error message
    
    // Validate email and password
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (email === 'admin@gmail.com' && password === 'Admin@123') {
      navigation.navigate('Admin'); // Navigate directly to Admin page
      return;
    }
    

    // Firebase login
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in with:', user.uid);

      // Fetch employee/staff details from Firestore
      const employeesRef = collection(db, 'employees');
      const q = query(employeesRef, where('userId', '==', user.uid)); // Assuming 'email' is the field in your employee/staff collection
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        const userId = userDoc.userId; // Assuming 'userId' exists in the document
        const category = userDoc.category; // Category field (Employee or Staff)

        // Redirect based on category
        if (category === 'Employee') {
          // Navigate to Employee dashboard or specific screen
          navigation.navigate('User', { userId }); // Example: Employee Dashboard
        } else if (category === 'Staff') {
          // Navigate to Staff dashboard or specific screen
          navigation.navigate('Staff', { userId }); // Example: Staff Dashboard
        } else if (email === 'admin@gmail.com') {
            // Navigate to Staff dashboard or specific screen
            navigation.navigate('Admin'); // Example: Staff Dashboard
        } else {
          setError('Invalid category');
        }
      } else {
        setError('No user found with this email.');
      }

    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password.');
    }
  };

  return (
    <LinearGradient
      colors={['#FF8C00', '#FF6347']} // Gradient colors
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Title style={styles.title}>Welcome Back!</Title>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          placeholder="Enter your email"
          theme={{ colors: { text: theme.colors.primary, placeholder: theme.colors.primary } }}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          placeholder="Enter your password"
          theme={{ colors: { text: theme.colors.primary, placeholder: theme.colors.primary } }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Login
        </Button>
        <Text style={styles.registerText}>
          Don't have an account? <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>Register</Text>
        </Text>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '85%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    backgroundColor: '#6200ee',
  },
  buttonLabel: {
    fontSize: 18,
    color: '#fff',
  },
  registerText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#333',
  },
  registerLink: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});