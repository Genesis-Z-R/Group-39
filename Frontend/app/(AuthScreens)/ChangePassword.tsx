import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../config/Firebase";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert("Validation Error", "All fields are required");
      return;
    }

    const user = auth.currentUser;

    if (!user || !user.email) {
      Alert.alert("Error", "User not logged in or email not available.");
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    setLoading(true);
    try {
      // 🔐 Step 1: Re-authenticate the user
      await reauthenticateWithCredential(user, credential);

      // 🔑 Step 2: Update password
      await updatePassword(user, newPassword);

      Alert.alert("Success", "Password updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Failed", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      <TextInput
        placeholder="Current Password"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
        style={styles.input}
      />

      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handlePasswordChange}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Password</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    color: "#007AFF",
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
  },
});
