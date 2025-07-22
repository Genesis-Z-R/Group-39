// import React, { useState } from 'react';
// import { View, Text, FlatList, Dimensions, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
// // import LottieView from 'lottie-react-native';
// import { useRouter } from 'expo-router';

// const { width } = Dimensions.get('window');

// const slides = [
//   { id: '1', title: 'Discover New Ideas', description: 'Explore trending questions and answers.',  },
//   { id: '2', title: 'Share Your Thoughts', description: 'Post your own questions and answers.',  },
//   { id: '3', title: 'Engage with Community', description: 'Like, comment, and connect with others.', },
// ];

// export default function OnboardingCarousel() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const colorScheme = useColorScheme();
//   const router = useRouter();

//   const handleScroll = (event: any) => {
//     const index = Math.round(event.nativeEvent.contentOffset.x / width);
//     setCurrentIndex(index);
//   };

//   return (
//     <View style={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
//       <FlatList
//         data={slides}
//         horizontal
//         pagingEnabled
//         onScroll={handleScroll}
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.slide}>
//             {/* <LottieView source={item.animation} autoPlay loop style={{ width: 300, height: 300 }} /> */}
//             <Text style={[styles.title, colorScheme === 'dark' && styles.darkText]}>{item.title}</Text>
//             <Text style={[styles.description, colorScheme === 'dark' && styles.darkText]}>{item.description}</Text>
//           </View>
//         )}
//       />

//       <View style={styles.pagination}>
//         {slides.map((_, index) => (
//           <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
//         ))}
//       </View>

//       {currentIndex === slides.length - 1 && (
//         <TouchableOpacity style={styles.startButton} onPress={() => router.push('/(auth)')}>
//           <Text style={styles.startButtonText}>Start Exploring</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   darkContainer: { backgroundColor: '#121212' },
//   slide: { width, justifyContent: 'center', alignItems: 'center', padding: 20 },
//   title: { fontSize: 24, fontWeight: 'bold', color: '#000', textAlign: 'center' },
//   description: { fontSize: 16, color: '#333', textAlign: 'center', marginTop: 10 },
//   darkText: { color: '#fff' },
//   pagination: { flexDirection: 'row', position: 'absolute', bottom: 100 },
//   dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#999', marginHorizontal: 5 },
//   activeDot: { backgroundColor: '#7209b7' },
//   startButton: { position: 'absolute', bottom: 40, backgroundColor: '#7209b7', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
//   startButtonText: { color: '#fff', fontSize: 16 },
// });
