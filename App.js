import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Register from './Register';
import User from './User';
import Staff from './Staff';
import Profile from './Profile';
import QRcode from './QRcode';
import NotificationsPage from './NotificationsPage';
import Admin from './Admin';
import NotificationForm from './NotificationForm';
import AttendanceScreen from './AttendanceScreen';
import EmployeeDetailsScreen from './EmployeeDetailsScreen';
import AddEmployeeScreen from './AddEmployeeScreen'; // Import EmployeeDetailsScreen
import QRScannerScreen from './Scan';
import AttendanceRecordsScreen from './AttendanceRecordsScreen'; 
import Staffpro from './Staffpro';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="User" component={User} options={{ headerShown: false }} />
        <Stack.Screen name="Staff" component={Staff} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="QRcode" component={QRcode} options={{ headerShown: false }} />
        <Stack.Screen name="NotificationsPage" component={NotificationsPage} options={{ headerShown: false }} />
        <Stack.Screen name="Admin" component={Admin} options={{ headerShown: false }} />
        <Stack.Screen name="NotificationForm" component={NotificationForm} options={{ headerShown: false }} />
        <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmployeeDetailsScreen" component={EmployeeDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddEmployeeScreen" component={AddEmployeeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="scan" component={QRScannerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AttendanceRecords" component={AttendanceRecordsScreen}   options={{ headerShown: false }}/>
        <Stack.Screen name="Staffpro" component={Staffpro}   options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
