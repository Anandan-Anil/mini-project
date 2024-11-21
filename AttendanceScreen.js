import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DataTable, Text } from 'react-native-paper';

export default function AttendanceScreen() {
  // Sample data for attendance records
  const attendanceData = [
    { date: '2024-09-01', status: 'Present' },
    { date: '2024-09-02', status: 'Absent' },
    { date: '2024-09-03', status: 'Present' },
    { date: '2024-09-04', status: 'Present' },
    { date: '2024-09-05', status: 'Absent' },
    // Add more records as needed
  ];

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Attendance Records</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Date</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
          </DataTable.Header>

          {attendanceData.map((record, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{record.date}</DataTable.Cell>
              <DataTable.Cell>{record.status}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});
