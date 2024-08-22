import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Register from './Register';
import User from './User';
import Staff from './Staff';
import Profile from './Profile';
import QRcode from './QRcode';
import NotificationsPage from './NotificationsPage'; // If you already have a User component

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
