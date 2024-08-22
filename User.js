import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function User() {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={["#C33764", "#1D2671"]}
      style={styles.background}
    >
      <Appbar.Header style={styles.appBar}>
        <Ionicons 
          name="person-circle-outline" 
          size={28} 
          color="#fff" 
          style={styles.icon} 
          onPress={() => navigation.navigate('Profile')} // Navigate to Profile on press
        />
        <MaterialIcons 
          name="badge" 
          size={28} 
          color="#fff" 
          style={styles.icon} 
          onPress={() => navigation.navigate('QRcode')} // Navigate to QR Code page on press
        />
        <Ionicons 
          name="notifications-outline" 
          size={28} 
          color="#fff" 
          style={styles.icon} 
          onPress={() => navigation.navigate('NotificationsPage')} // Navigate to Notifications on press
        />
      </Appbar.Header>
      <View style={styles.container}>
        <Text style={styles.title}>User Dashboard</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  appBar: {
    backgroundColor: 'purple',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
