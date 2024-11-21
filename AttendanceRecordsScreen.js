import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, FlatList, Text, ActivityIndicator } from 'react-native';
import { db } from './firebase'; // Your Firebase setup file
import { collection, getDocs, query } from 'firebase/firestore';
import { Calendar } from 'react-native-calendars';

export default function AttendanceScreen() {
  const [search, setSearch] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState('');
  const [calendarSelected, setCalendarSelected] = useState(false);

  // Function to format time from timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to fetch attendance records for all users on the selected date
  const fetchAttendanceRecords = async (date) => {
    try {
      setLoading(true);
      const allRecords = [];

      // Step 1: Get all employees from the 'employees' collection
      const q = query(collection(db, 'employees'));
      const employeesSnapshot = await getDocs(q);
      const employeeDocs = employeesSnapshot.docs;

      // Check if no employee documents exist
      if (employeeDocs.length === 0) {
        console.log('No employees found in employees collection.');
        setLoading(false);
        return;
      }

      // Step 2: Iterate over each employee document
      for (const employeeDoc of employeeDocs) {
        const employeeData = employeeDoc.data();
        const userId = employeeData.userId; // Assuming 'userId' exists in the employee document

        // If no userId, skip this employee
        if (!userId) {
          console.log('Skipping employee with missing userId:', employeeData);
          continue;
        }

        // Step 3: Get the attendance subcollection for this userId and date
        const dateSubcollectionRef = collection(db, 'attendance', userId, date);
        const dateSnapshot = await getDocs(dateSubcollectionRef);

        // If no attendance records for this user and date, skip to the next user
        if (dateSnapshot.empty) {
          console.log(`No records found for user ${userId} on date ${date}`);
          continue;
        }

        // Collect each attendance record
        dateSnapshot.forEach((doc) => {
          const attendanceData = doc.data();
          console.log('Record found:', attendanceData);

          allRecords.push({
            id: doc.id,
            userId,
            Username: attendanceData.Username || 'Unknown', // Fetch the Username field directly
            firstScanTime: formatTime(attendanceData.firstScanTime), // Format the time
            secondScanTime: formatTime(attendanceData.secondScanTime), // Format the time
            attendanceStatus: attendanceData.attendanceStatus,
          });
        });
      }

      setAttendanceRecords(allRecords);
      setFilteredRecords(allRecords);

      if (allRecords.length === 0) {
        console.log('No attendance records found for any users on this date.');
      } else {
        console.log(`Total records found: ${allRecords.length}`);
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle calendar date selection
  const onDayPress = (day) => {
    const selectedDate = day.dateString; // Format is 'YYYY-MM-DD'
    setFormattedDate(selectedDate);
    setCalendarSelected(true);
    fetchAttendanceRecords(selectedDate); // Fetch data for the selected date
  };

  useEffect(() => {
    if (formattedDate) {
      fetchAttendanceRecords(formattedDate); // Fetch attendance data for the selected date
    }
  }, [formattedDate]);

  useEffect(() => {
    const results = attendanceRecords.filter(record =>
      record.Username?.toLowerCase().includes(search.toLowerCase()) ||
      record.firstScanTime?.includes(search) ||
      record.secondScanTime?.includes(search) ||
      record.attendanceStatus?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRecords(results);
  }, [search, attendanceRecords]);

  const renderAttendanceItem = ({ item }) => (
    <View style={styles.recordItem}>
      <Text style={styles.recordText}>User Name: {item.Username || 'Unknown'}</Text>
      <Text style={styles.recordText}>First Scan: {item.firstScanTime || 'N/A'}</Text>
      <Text style={styles.recordText}>Second Scan: {item.secondScanTime || 'N/A'}</Text>
      <Text style={styles.recordText}>Status: {item.attendanceStatus}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          [formattedDate]: { selected: true, selectedColor: 'blue', selectedTextColor: 'white' },
        }}
        monthFormat={'yyyy MM'}
        hideExtraDays={true}
      />

      {!calendarSelected ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TextInput
            placeholder="Search Attendance"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <FlatList
            data={filteredRecords}
            renderItem={renderAttendanceItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  listContainer: {
    paddingBottom: 100,
  },
  recordItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  recordText: {
    fontSize: 16,
  },
});
