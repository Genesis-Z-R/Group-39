import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// 🔁 Dummy FAQs (replace with Sanity or Firebase later)
const DUMMY_FAQS = [
  {
    id: 'faq1',
    question: 'How do I ask a question?',
    answer: 'Go to the Home screen and tap the "+" icon to submit a question.'
  },
  {
    id: 'faq2',
    question: 'Can I edit my answer after posting?',
    answer: 'Yes. Go to your answer, tap the three dots, and choose "Edit".'
  },
  {
    id: 'faq3',
    question: 'How do I report inappropriate content?',
    answer: 'Tap the flag icon on the post you want to report.'
  }
];

export default function HelpScreen() {
  const [faqs, setFaqs] = useState(DUMMY_FAQS);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 📡 Replace this with your API integration
    /*
    const fetchFAQs = async () => {
      const data = await client.fetch(`*[_type == "faq"]{_id, question, answer}`);
      setFaqs(data);
    }
    fetchFAQs();
    */
  }, []);

  const handleSubmitMessage = () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your issue or message.');
      return;
    }

    // 📡 Submit message to backend or Firebase
    /*
    await addDoc(collection(db, "helpMessages"), {
      message,
      createdAt: new Date()
    });
    */

    Alert.alert('Submitted', 'Your message has been sent to support.');
    setMessage('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>

      {/* 📚 FAQ Section */}
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      {faqs.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.faqItem}
          onPress={() => setSelectedFaq(item.id === selectedFaq ? null : item.id)}
        >
          <View style={styles.faqHeader}>
            <Text style={styles.faqQuestion}>{item.question}</Text>
            <Ionicons
              name={selectedFaq === item.id ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#333"
            />
          </View>
          {selectedFaq === item.id && (
            <Text style={styles.faqAnswer}>{item.answer}</Text>
          )}
        </TouchableOpacity>
      ))}

      {/* 📬 Contact Options */}
      <Text style={styles.sectionTitle}>Contact Us</Text>
      <View style={styles.contactBox}>
        <View style={styles.contactRow}>
          <MaterialIcons name="email" size={20} color="#555" />
          <Text style={styles.contactText}> support@vestora.app</Text>
        </View>
        <View style={styles.contactRow}>
          <MaterialIcons name="phone" size={20} color="#555" />
          <Text style={styles.contactText}> +233 50 123 4567</Text>
        </View>
      </View>

      {/* 📝 Submit an Issue */}
      <Text style={styles.sectionTitle}>Send us a message</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Describe your issue or suggestion..."
        multiline
        numberOfLines={4}
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitMessage}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 50,
    backgroundColor: '#fff',
    flex: 1
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 10,
  },
  faqItem: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontWeight: '500',
    fontSize: 15,
  },
  faqAnswer: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
  },
  contactBox: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 8,
  },
  textArea: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  submitBtn: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
});
