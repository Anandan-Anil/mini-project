import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { DataTable } from 'react-native-paper'; // Using React Native Paper's DataTable for tabular view

export default function EmployeeDetailsScreen() {
  const employees = [
    { id: 1, name: 'John Doe', department: 'HR', position: 'Manager', attendance: '95%' },
    { id: 2, name: 'Jane Smith', department: 'Finance', position: 'Analyst', attendance: '90%' },
    // Add more employee data here...
  ];

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Employee Details</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>ID</DataTable.Title>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Department</DataTable.Title>
            <DataTable.Title>Position</DataTable.Title>
            <DataTable.Title numeric>Attendance</DataTable.Title>
          </DataTable.Header>

          {employees.map((employee) => (
            <DataTable.Row key={employee.id}>
              <DataTable.Cell>{employee.id}</DataTable.Cell>
              <DataTable.Cell>{employee.name}</DataTable.Cell>
              <DataTable.Cell>{employee.department}</DataTable.Cell>
              <DataTable.Cell>{employee.position}</DataTable.Cell>
              <DataTable.Cell numeric>{employee.attendance}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
