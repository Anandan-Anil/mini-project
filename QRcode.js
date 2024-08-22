import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';

export default function QRcode() {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={["#C33764", "#1D2671"]}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Your QR Code</Text>
        <View style={styles.qrPlaceholder}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.svg.png' }} // Replace with the actual image URL
            style={styles.qrImage}
          />
          
        </View>
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    borderColor: '#333',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    position: 'relative',
  },
  qrImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  qrText: {
    color: '#333',
    fontSize: 16,
    position: 'absolute',
    bottom: 10,
    textAlign: 'center',
  },
});
