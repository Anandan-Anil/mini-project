import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';
import { auth, db } from './firebase'; // Adjust the import according to your structure
import { doc, getDoc } from 'firebase/firestore';
import { query, where, getDocs,collection } from 'firebase/firestore';

export default function QRcode() {
  const theme = useTheme();
  const [qrCodeURL, setQrCodeURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQRCode = async () => {
      const user = auth.currentUser;
  
      console.log('Current user:', user); // Debugging: Log the current user
      console.log('User ID:', user ? user.uid : 'No user'); // Log the user ID
  
      if (user) {
        try {
          console.log("in");
          
          // Query the employees collection for the document with the matching userId
          const q = query(collection(db, 'employees'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          
          console.log('Query Snapshot:', querySnapshot); // Debugging: Log the query snapshot
  
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              console.log('Document ID:', doc.id); // Log document ID
              console.log('Document data:', doc.data()); 
              setQrCodeURL(doc.data().QrCodeURL); 
            });
          } else {
            console.warn('No employee data found with the given userId.'); // Debugging: Warn if no data found
            setError('No employee data found.');
          }
        } catch (err) {
          console.error('Error fetching QR code:', err); // Debugging: Log any errors
          setError('Failed to fetch QR code.');
        } finally {
          setLoading(false);
          console.log('Loading complete.'); // Debugging: Indicate loading is complete
        }
      } else {
        console.warn('User not logged in.'); // Debugging: Warn if no user is logged in
        setError('User not logged in.');
        setLoading(false);
      }
    };
  
    fetchQRCode();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={["#C33764", "#1D2671"]} style={styles.background}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#C33764", "#1D2671"]} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Your QR Code</Text>
        <View style={styles.qrPlaceholder}>
          {qrCodeURL ? (
            <Image
              source={{ uri: qrCodeURL }}
              style={styles.qrImage}
            />
          ) : (
            <Text style={styles.errorText}>QR Code not available.</Text>
          )}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  },
  qrImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
