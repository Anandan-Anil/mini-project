import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from './firebase'; // Import auth and db from your firebase.js
import { collection, query, where, getDocs } from 'firebase/firestore'; 

export default function StaffPro() {
  const theme = useTheme();
  const [userData, setUserData] = useState(null); // State to hold user data
  const [loading, setLoading] = useState(true);   // Loading state
  const [error, setError] = useState(null);       // Error state

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser; // Get the logged-in user

      if (!currentUser) {
        setError('No user is logged in');
        setLoading(false);
        return;
      }

      try {
        // Query Firestore for an employee with the same email as the logged-in user
        const q = query(
          collection(db, 'employees'),
          where('Email', '==', currentUser.email) // Match email with logged-in user's email
        );

        const querySnapshot = await getDocs(q); // Execute the query

        if (!querySnapshot.empty) {
          const employeeData = querySnapshot.docs[0].data(); // Get the first matching document
          setUserData(employeeData);
        } else {
          setError('No matching employee data found');
        }
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={['#FF8C00', '#FF6347']} style={styles.background}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#FF8C00', '#FF6347']} style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FF8C00', '#FF6347']} style={styles.background}>
      <View style={styles.container}>
        {userData && (
          <View style={styles.profileContainer}>
            <Avatar.Image 
              size={150} // Increased profile picture size
              source={{ uri: userData.profilePicURL || 'https://via.placeholder.com/150' }} // Default if no picture
            />
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Name:</Text>
                <Text style={styles.tableValue}>{userData.Username}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Gmail ID:</Text>
                <Text style={styles.tableValue}>{userData.Email}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Department:</Text>
                <Text style={styles.tableValue}>{userData.department}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Category:</Text>
                <Text style={styles.tableValue}>{userData.category}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30, // Increased padding
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 30, // Added more spacing
  },
  table: {
    marginTop: 20, // Added space between profile and table
    width: '100%',
    paddingHorizontal: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '100%',
  },
  tableLabel: {
    fontSize: 24, // Increased font size for label
    fontWeight: 'bold',
    color: '#fff',
  },
  tableValue: {
    fontSize: 24, // Increased font size for value
    color: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 24, // Increased font size for error message
    textAlign: 'center',
  },
});
