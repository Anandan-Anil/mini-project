import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from './firebase'; // Import the auth object
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Helper functions for validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleRegister = () => {
    setError(''); // Reset error message
    setLoading(true);

    // Validate email and password
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and include a special character.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    // Register user with Firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Registered successfully, you can navigate to the home screen or other actions
        console.log('User registered:', userCredential.user);
        navigation.navigate('Login'); // Adjust the navigation target as needed
      })
      .catch((error) => {
        // Handle registration errors
        console.error('Registration error:', error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <LinearGradient
      colors={['#FF8C00', '#FF6347']} // Gradient colors
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Title style={styles.title}>Create an Account</Title>
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
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          placeholder="Confirm your password"
          theme={{ colors: { text: theme.colors.primary, placeholder: theme.colors.primary } }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>Login</Text>
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
  loginText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#333',
  },
  loginLink: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
