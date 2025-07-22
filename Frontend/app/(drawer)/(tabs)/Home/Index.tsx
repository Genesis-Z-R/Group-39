import "../../../../global"
import { Text, View , StyleSheet} from 'react-native'
import Header from '../../../screenComponents/Header'
import Mockfeed from '../../../screenComponents/Mockfeed'
import { useNavigation } from "expo-router"


const Index = () => {
  const navigation= useNavigation();
  return (
    <View style= {styles.container}>
      <Header title="Home" navigation={navigation} />
      <Mockfeed/>
    
    </View >
    
  )
}

export default Index
const styles = StyleSheet.create({
  container:{
    flex:1
  }
})