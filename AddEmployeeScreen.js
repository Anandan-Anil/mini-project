import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { db, storage } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import ViewShot from 'react-native-view-shot';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

export default function AddEmployeeScreen() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('Employee'); // New state for category
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const viewShotRef = useRef(null);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateContactNumber = (contactNumber) => /^\d{10}$/.test(contactNumber);
  const validatePassword = (password) => /^(?=.*[!@#$%^&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleAddEmployee = async () => {
    setError('');
    setSuccess('');

    if (!name) {
      setError('Name is required.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validateContactNumber(contactNumber)) {
      setError('Contact number must be 10 digits.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and include a special character.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      let profilePicURL = '';
      if (profilePic) {
        const profilePicRef = ref(storage, `profile_pics/${userId}.jpg`);
        const imgBlob = await (await fetch(profilePic)).blob();
        await uploadBytes(profilePicRef, imgBlob);
        profilePicURL = await getDownloadURL(profilePicRef);
      }

      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        const base64Code = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const fileUri = FileSystem.cacheDirectory + `${name}.png`;
        await FileSystem.writeAsStringAsync(fileUri, base64Code, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const storageRef = ref(storage, `qrcodes/${name}.png`);
        const imgBlob = await (await fetch(fileUri)).blob();
        await uploadBytes(storageRef, imgBlob);

        const qrCodeURL = await getDownloadURL(storageRef);

        // Add employee data to Firestore with category, department, and profile picture
        await addDoc(collection(db, 'employees'), {
          Username: name,
          Email: email,
          Contact: contactNumber,
          Password: password,
          QrCodeURL: qrCodeURL,
          category: category, // Add category
          department: department,
          userId: userId,
          profilePicURL: profilePicURL,
        });

        setSuccess('Employee added successfully!');
        setName('');
        setEmail('');
        setContactNumber('');
        setPassword('');
        setDepartment('');
        setProfilePic(null);
        setCategory('Employee'); // Reset category state
      } else {
        setError("QR code view reference is not available.");
      }
    } catch (error) {
      setError("Failed to save or upload data: " + error.message);
    }
  };

  return (
    <LinearGradient colors={['#FF8C00', '#FF6347']} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add Employee</Text>

        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          placeholder="Enter employee name"
          theme={{ colors: { text: theme.colors.primary, placeholder: theme.colors.primary } }}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          placeholder="Enter employee email"
          keyboardType="email-address"
          theme={{ colors: { text: theme.colors.primary, placeholder: theme.colors.primary } }}
        />

        <TextInput
          label="Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          style={styles.input}
          mode="outlined"
          placeholder="Enter contact number"
          keyboardType="phone-pad"
          theme={{ colors: { text: theme.colors.primary, placeholder: theme.colors.primary } }}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode="outlined"
          placeholder="Enter password"
          secureTextEntry
          theme={{ colors: { text: theme.colors.primary, placeholder: theme.colors.primary } }}
        />

        <TextInput
          label="Department"
          value={department}
          onChangeText={setDepartment}
          style={styles.input}
          mode="outlined"
          placeholder="Enter department"
          theme={{ colors: { text: theme.colors.primary, placeholder: theme.colors.primary } }}
        />

        {/* Category Input */}
        <TextInput
          label="Category"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
          mode="outlined"
          placeholder="Enter employee category (e.g., Employee, Staff)"
          theme={{ colors: { text: theme.colors.primary, placeholder: theme.colors.primary } }}
        />

        {/* Profile Picture Picker */}
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <Text style={styles.imagePickerText}>Pick Profile Picture</Text>
          )}
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <Button
          mode="contained"
          onPress={handleAddEmployee}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Add Employee
        </Button>

        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
          <QRCode value={name || 'DefaultText'} size={256} />
        </ViewShot>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#fff', textAlign: 'center' },
  input: { width: '100%', marginBottom: 15, backgroundColor: 'transparent' },
  button: { marginVertical: 10, paddingVertical: 5, backgroundColor: '#6200ee', width: '100%' },
  buttonLabel: { fontSize: 18, color: '#fff' },
  imagePicker: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  profilePic: { width: '100%', height: '100%', borderRadius: 5 },
  imagePickerText: { color: '#888' },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
  successText: { color: 'green', textAlign: 'center', marginBottom: 10 },
});
