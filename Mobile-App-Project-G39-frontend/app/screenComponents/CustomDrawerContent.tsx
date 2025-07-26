// components/CustomDrawerContent.tsx
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Alert } from "react-native";
import handleLogout from '../../src/utils/authHelp';
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";

export default function CustomDrawerContent(props: any) {
  const confirmLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          handleLogout(); // actual logout function
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      {/* ✅ Custom logout item */}
      <DrawerItem
        label="Log Out"
        onPress={confirmLogout}
        icon={({ color, size }) => (
          <SimpleLineIcons name="logout" size={size} color="black" />
        )}
        labelStyle={{ color: "red" }}
      />
    </DrawerContentScrollView>
  );
}
