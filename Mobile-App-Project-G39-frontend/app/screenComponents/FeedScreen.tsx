import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SearchBar } from 'react-native-screens'
import "../../global"
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons';
// import * as Icons from "react-native-heroicons"

const FeedScreen = () => {
  return (
    <SafeAreaView style ={styles.container}>

       
            <View >
                {/*AVatar and searchbar */}
                <View style ={styles.AvatarContainer}>
                    <TouchableOpacity style ={styles.user} ></TouchableOpacity>
                    <TextInput placeholder='What do you want to ask or share?' style ={styles.search} />
                </View>

                {/*bottom icons */}
                <View style ={styles.actionRow}>
                        <TouchableOpacity  style ={styles.action} >
                        <MaterialCommunityIcons name="comment-question-outline" size={20} color="#8395a7" />
                        <Text>Ask</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style= {styles.action}>
                        <FontAwesome name="pencil-square-o" size={24} color="#8395a7" />
                        <Text className='text-red-500'>Answer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style= {styles.action} >
                        <MaterialCommunityIcons name="pencil" size={20} color="#8395a7" />
                        <Text>Post</Text>
                    </TouchableOpacity>
                </View>

                    {/*Your Weekly Digest */}
                    <View style ={styles.Digest}>
                        <View>
                            <Image/>
                        </View>

                        <View>
                            <Text style = {styles.textDig}>Your Weekly Digest</Text>
                            <Text></Text>
                        </View>
                        
                        <Text>Post</Text>
                    </View>


                </View>
           
        
        
    </SafeAreaView>
  )
}

export default FeedScreen

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#ffeaa7",
        paddingBottom:30,
        
        
        
    },
    AvatarContainer:{
        borderRadius: 30,
        width:"100%",
        height: 50,
        flexDirection: 'row',
        
    }, 
    user:{
        backgroundColor:"#d63031",
        width:40,
        height: 40,
        borderRadius:30,
        top: 8,
        marginLeft: 10
    },
    search:{
        flex:1,
        backgroundColor:'#dfe6e9',
        borderRadius: 20,
        paddingHorizontal:5,
        marginHorizontal:10,
        width: 30,
        height: 40,
        top: 10,
        padding:1
    },
    actionRow: {
        flexDirection: 'row',
        top:10,
        justifyContent: "space-around",
        
    },
    action:{
        // border:1,
        justifyContent:'center',
        flexDirection:"row",
        paddingHorizontal: 1

        
    },
    Digest:{
        top:10,
    },
    textDig:{
        fontWeight:"700",
        fontSize: 16,
        textAlign: "center",
        top:10


    }
})