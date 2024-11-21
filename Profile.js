import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Ensure correct path
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const theme = useTheme();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (user) {
          const q = query(collection(db, 'employees'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0].data(); // Assuming one document per user
            setProfileData(docData);
          } else {
            console.log('No document found for the user!');
          }
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchProfileData();
  }, [user]);

  if (!profileData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#C33764", "#1D2671"]} style={styles.background}>
      <View style={styles.container}>
        {profileData.profilePicURL ? (
          <Image
            source={{ uri: profileData.profilePicURL }}
            style={styles.profileImage}
          />
        ) : null}
        <Text style={styles.title}>Profile Information</Text>
        <Text style={styles.label}>Full Name:</Text>
        <Text style={styles.value}>{profileData.Username}</Text>
        <Text style={styles.label}>Contact Number:</Text>
        <Text style={styles.value}>{profileData.Contact}</Text>
        <Text style={styles.label}>Category:</Text>
        <Text style={styles.value}>{profileData.category}</Text>
        <Text style={styles.label}>Department:</Text>
        <Text style={styles.value}>{profileData.department}</Text>

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
    elevation: 5,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#333',
  },
});
