import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // Ensure correct path

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const theme = useTheme();
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const docId = 'Hyb5h0TVgS6oiNLQKh5u'; // Document ID
        const docRef = doc(db, 'users', docId); // Firestore reference
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchProfileData();
  }, []);

  if (!profileData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  console.log('Profile Picture URL:', profileData.pic);


  return (
    <LinearGradient
      colors={["#C33764", "#1D2671"]}
      style={styles.background}
    >
      <View style={styles.container}>
        {profileData.pic ? (
          <Image
          source={{ uri: profileData.pic|| 'https://beforeigosolutions.com/wp-content/uploads/2021/12/dummy-profile-pic-300x300-1.png' }}
          style={styles.profileImage}
        />        
        ) : null}
        <Text style={styles.title}>Profile Information</Text>
        <Text style={styles.label}>Full Name:</Text>
        <Text style={styles.value}>{profileData.name}</Text>

        <Text style={styles.label}>Register Number:</Text>
        <Text style={styles.value}>{profileData.register}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{profileData.address}</Text>

        <Text style={styles.label}>Department:</Text>
        <Text style={styles.value}>{profileData.department}</Text>

        <Text style={styles.label}>Semester:</Text>
        <Text style={styles.value}>{profileData.semester}</Text>
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