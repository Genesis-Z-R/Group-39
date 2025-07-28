import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity
} from 'react-native';
import React from 'react';
import {
  Ionicons,
  MaterialCommunityIcons
} from '@expo/vector-icons';

// Update: Now receiving `navigation` as prop
const Header = ({
  title,
  navigation
}: {
  title: string;
  navigation: any;
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.TitleContainer}>
          {/* Avatar now opens the drawer */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => navigation.openDrawer()}
          >
            <Image
              source={require('../../assets/John.jpeg')}
              style={[styles.avatar, { borderColor: '#ecf0f1', borderWidth: 2 }]}
            />
          </TouchableOpacity>

          <Text style={styles.Title}>{title}</Text>
        </View>

        <View style={styles.headerButtonsContainer}>
          <TouchableOpacity style={styles.headerButtons}>
            <Ionicons
              name="search"
              size={24}
              color="black"
              style={styles.avatar}
               onPress={() => navigation.navigate('Search')}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerButtons}>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={24}
              color="black"
              onPress={() => navigation.navigate('CreateModal')}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight || 20,
    backgroundColor: '#758682ff'
  },
  headerContainer: {
    position: 'static',
    backgroundColor: '#dcdde1',
    flexDirection: 'row',
    width: '100%',
    height: 60,
    justifyContent: 'space-between'
  },
  TitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 2,
    top: 29,
    left: 5
  },
  avatarContainer: {
    width: 26,
    height: 26,
    paddingHorizontal: 1,
    
  },
  avatar: {
    width: 30,
    height: 30,
    
    borderColor: '#7f8c8d',
    borderRadius: 100
  },
  Title: {
    fontWeight: 'bold',
    fontSize: 20,
    bottom: 1,
    color: '#e74c3c',
    justifyContent: 'center', 
    left: 10
  },
  headerButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    top: 25,
    marginLeft: 60
  },
  headerButtons: {
    width: 30,
    height: 30,
    padding: 5,
    marginLeft: 5
  }
});


