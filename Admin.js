import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Admin() {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#FF8C00', '#FF6347']} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <View style={styles.iconContainer}>
          <View style={styles.iconBox}>
            <Ionicons
              name="notifications-outline"
              size={40}
              color="#fff"
              onPress={() => navigation.navigate('NotificationForm')}
            />
            <Text style={styles.iconText}>Notifications</Text>
          </View>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons
              name="account-clock-outline"
              size={40}
              color="#fff"
              onPress={() => navigation.navigate('AttendanceRecords')} // Navigate to AttendanceScreen
            />
            <Text style={styles.iconText}>Attendance</Text>
          </View>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons
              name="account-details-outline"
              size={40}
              color="#fff"
              onPress={() => navigation.navigate('EmployeeDetailsScreen')}
            />
            <Text style={styles.iconText}>View Employee</Text>
          </View>
          <View style={styles.iconBox}>
            <FontAwesome
              name="user-plus"
              size={40}
              color="#fff"
              onPress={() => navigation.navigate('AddEmployeeScreen')}
            />
            <Text style={styles.iconText}>Add Employee</Text>
          </View>
        </View>
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
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  iconBox: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
