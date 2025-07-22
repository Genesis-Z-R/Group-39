// app/tabs/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons,MaterialIcons,AntDesign,Octicons ,Feather,FontAwesome} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';


export default function TabsLayout() {
  const navigation = useNavigation();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home/Index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Following/Index') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          }
           else if (route.name === 'Spaces/Index') {
           iconName = focused ? "people-circle" : 'people-circle-outline';
          
          } else if (route.name ==='Answer/Index') {
            iconName = focused ? 'pencil-square': 'pencil-square-o';
            return <FontAwesome name={iconName} size={size} color={color} />
          
          } else if (route.name === 'Notifications/Index') {
            iconName = focused ? "notifications-sharp" : "notifications-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
           
        },
        tabBarStyle: {backgroundColor: "#ecf0f1",
          paddingTop: 15,
          
        },
        tabBarActiveTintColor: '#2f59dc',
        tabBarInactiveTintColor: 'gray',
        paddingVertical: 10
        
        
        
      })}
    >
      <Tabs.Screen name ="Home" options={{
        title: "Home"
      }}/>
      <Tabs.Screen name ="Following"/>
      <Tabs.Screen name ="Answer"/>
      <Tabs.Screen name ="Spaces"/>
      <Tabs.Screen name ="Notifications"/>
    </Tabs>
  );
}
