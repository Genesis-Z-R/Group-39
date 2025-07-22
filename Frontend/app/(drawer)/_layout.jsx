// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Drawer } from 'expo-router/drawer';


// export default function Layout() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Drawer
//       screenOptions={{
//         header: () =>null , // we'll use our own header component in child screens
//       }}
//     />
//     </GestureHandlerRootView>
//   );
// }

import { Drawer } from 'expo-router/drawer';
import { Ionicons, MaterialIcons,SimpleLineIcons } from '@expo/vector-icons';
import CustomDrawerContent from 'app/screenComponents/CustomDrawerContent';
export default function DrawerLayout() {
  return (
    <Drawer
       drawerContent={(props) => <CustomDrawerContent {...props} />} 
      screenOptions={
      { headerShown: false,
        drawerType: "back",
        overlayColor: "#rgba(184, 135, 93, 0.4)",

          drawerStyle: {
          backgroundColor: 'rgba(234, 243, 233, 0)',                // Drawer background
          width: 280,
        },
       drawerActiveTintColor: 'rgba(179, 57, 57,1.0)',         // Active color
        drawerInactiveTintColor: '#555',
        drawerLabelStyle: { fontSize: 16 },
        
      }
       
        
      }>

      <Drawer.Screen name="(tabs)" 
      options={
        { drawerLabel: 'Home',
           drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }
      
      } />
      <Drawer.Screen name="Profile/Profile" 
      options={{ drawerLabel: 'Profile',
        drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
       }} />
      <Drawer.Screen name="Settings/Settings"
       options={{ drawerLabel: 'Settings',
        drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }} />
      <Drawer.Screen name="Help/Help"
       options={{ drawerLabel: 'Help',
        drawerIcon: ({ color, size }) =>  <MaterialIcons name="help-outline" size={size} color={color} />,
        }} />
      
    </Drawer>
  );
}

