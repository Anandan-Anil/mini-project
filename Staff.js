import React from 'react';
import { View, StyleSheet,Text } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Staff() {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={["#C33764" , "#1D2671"]} // Gradient colors matching Login.js
      style={styles.background}
    >
      <Appbar.Header style={styles.appBar}>
        <Ionicons name="person-circle-outline" size={28} color="#fff" style={styles.icon} />
        <MaterialCommunityIcons name="qrcode-scan" size={28} color="#fff" style={styles.icon} />
      </Appbar.Header>
      <View style={styles.container}>
        {/* Add your staff content here */}
        <Text style={styles.title}>Staff Dashboard</Text>
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
