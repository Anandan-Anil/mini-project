import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { db } from './firebase'; // Import your Firebase setup
import { collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    if (scannedData === data) {
      // Prevent scanning the same code multiple times
      return;
    }

    setScannedData(data);
    console.log('Scanned data:', data); // Debugging: Log the scanned data

    try {
      // Query the employees collection to find the employee by username
      const employeeQuery = query(collection(db, 'employees'), where('Username', '==', data));
      const employeeSnapshot = await getDocs(employeeQuery);

      if (!employeeSnapshot.empty) {
        employeeSnapshot.forEach(async (docSnapshot) => {
          const employee = docSnapshot.data();
          console.log('Found employee:', employee); // Debugging: Log found employee
          setEmployeeData(employee);

          // Get today's date in YYYY-MM-DD format
          const today = new Date().toISOString().split('T')[0];
          const attendanceCollectionRef = collection(db, 'attendance', employee.userId, today); // Create collection for today's attendance

          // Check if there's an existing attendance record for today
          const attendanceQuery = query(attendanceCollectionRef);
          const attendanceSnapshot = await getDocs(attendanceQuery);

          const currentTime = new Date().toISOString();

          if (!attendanceSnapshot.empty) {
            // Update the existing attendance record
            attendanceSnapshot.forEach(async (attendanceDoc) => {
              const attendanceRef = attendanceDoc.ref; // Get the document reference directly

              // Update the second scan time, attendance status, and add Username
              await updateDoc(attendanceRef, {
                secondScanTime: currentTime,
                attendanceStatus: determineAttendanceStatus(currentTime),
                Username: employee.Username, // Add Username to the attendance record
              });
              console.log('Attendance data updated successfully.'); // Debugging: Log success
            });
          } else {
            // Create a new attendance record with Username
            await addDoc(attendanceCollectionRef, {
              userId: employee.userId,
              Username: employee.Username, // Include Username when creating a new record
              firstScanTime: currentTime, // Current time for the first scan
              secondScanTime: null, // No second scan yet
              attendanceStatus: 'Off', // Default status
              createdAt: currentTime,
            });
            console.log('Attendance data stored successfully.'); // Debugging: Log success
          }
        });
      } else {
        setError('Employee not found.');
        console.warn('Employee not found.'); // Debugging: Warn if employee not found
      }
    } catch (err) {
      setError('Error fetching employee data.');
      console.error('Error fetching employee data:', err); // Debugging: Log any errors
    }
  };

  const determineAttendanceStatus = (scanTime) => {
    const hours = new Date(scanTime).getHours();
    const minutes = new Date(scanTime).getMinutes();

    // Check if the second scan time is before or after 11:59 AM
    if (hours < 12 || (hours === 12 && minutes === 0)) {
      return 'Half'; // Mark as half if before 12 PM
    } else {
      return 'Full'; // Mark as full if after 12 PM
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan QR Code</Text>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {employeeData && (
        <View>
          <Text>Employee: {employeeData.Username}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
  },
});
