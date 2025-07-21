// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert ,Image} from 'react-native';
// import { useRouter } from 'expo-router';

// export default function EditProfileModal() {
//   const router = useRouter();

//   // Local state for form fields
//   const [name, setName] = useState('John Doe');
//   const [bio, setBio] = useState('Full Stack Developer');
//   const [email, setEmail] = useState('john@example.com');

//   const handleSave = () => {
//     // ✅ In a real app, you'd update backend or local state here
//     Alert.alert('Profile Updated', 'Your profile details have been saved.');

//     router.back();  // Close the modal and go back to Profile screen
//   };

//   return (
//     <View style={styles.container}>
//         <Image source = {require('../../assets/kobby.jpeg')}
//         style = {styles.avatar}
//         />
//       {/* Name Field */}
//       <View style = {styles.Field}>

//       <Text style={styles.label}>Name</Text>
//       <TextInput
//         value={name}
//         onChangeText={setName}
//         placeholder="Enter your name"
//         style={styles.input}
//       />
//       </View>

//       {/* Bio Field */}
//       <View style = {styles.Field}>

//       <Text style={styles.label}>Bio</Text>
//       <TextInput
//         value={bio}
//         onChangeText={setBio}
//         placeholder="Enter your bio"
//         style={[styles.input, { height: 80,marginLeft:20 }]}
//         multiline
//       />
//     </View>

//       {/* Email Field */}
//       <View style = {styles.Field}>
//         <Text style={styles.label}>Email</Text>
//          <TextInput
//             value={email}
//             onChangeText={setEmail}
//             placeholder="Enter your email"
//             keyboardType="email-address"
//             style={styles.input}
//         />
//       </View>

//       {/* Save Button */}
//       <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//         <Text style={styles.saveButtonText}>Save Changes</Text>
//       </TouchableOpacity>

//       {/* Cancel Button */}
//       <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
//         <Text style={styles.cancelButtonText}>Cancel</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//     alignItems:'center',
//     justifyContent: 'center',
//   },
//   Field:{
//     flexDirection:'row',
//     gap:15,
//     marginBottom:20
    
//   },
//   avatar:{
//     width : 200,
//     height: 200,
//     borderRadius: 300,
//     marginBottom: 30
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 15,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 10,
//     marginTop: 5,
//     width:"80%"
//   },
//   saveButton: {
//     backgroundColor: 'rgba(255, 82, 82,1.0)',
//     padding: 15,
//     borderRadius: 8,
//     marginTop: 30,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   cancelButton: {
//     padding: 12,
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: '#007AFF',
//     fontSize: 16,
//   },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfile() {
  const router = useRouter();

  // Dummy data / form state
  const [name, setName] = useState('John Doe');
  const [bio, setBio] = useState('Full Stack Developer');
  const [email, setEmail] = useState('john@example.com');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Denied', 'Enable media permissions to upload photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Replace with your Spring Boot API
      // const res = await fetch('https://your-backend.com/api/user/update', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, bio, profilePic }),
      // });
      // const data = await res.json();

      await new Promise(resolve => setTimeout(resolve, 1500)); // Fake network delay
      Alert.alert('Profile Updated', 'Your changes have been saved.');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Edit Profile</Text>

      <TouchableOpacity style={styles.avatarWrapper} onPress={handleImagePick}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="camera" size={28} color="#999" />
            <Text style={styles.uploadText}>Upload</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Enter full name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          multiline
          style={[styles.input, styles.textArea]}
          placeholder="Tell us about yourself"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          placeholder="you@example.com"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatarWrapper: {
    marginBottom: 30,
    position: 'relative'
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#10ac84',
    backgroundColor: '#f1f1f1',
  },
  avatarPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  uploadText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#ff5252',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
