import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { db, auth } from '../services/firebaseConfig'; // Importando db e auth do firebaseConfig
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore'; // Funções do Firestore

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    const messagesRef = collection(db, 'messages'); 
    const q = query(messagesRef, orderBy('timestamp', 'desc')); // Organizando por timestamp

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });

    return unsubscribe; // Limpeza do listener
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        await addDoc(collection(db, 'messages'), { // Use addDoc para adicionar um novo documento
          text: message,
          user: auth.currentUser.email,
          timestamp: new Date(),
        });
        setMessage(''); // Limpa o campo de mensagem
      } catch (error) {
        console.error("Erro ao enviar a mensagem: ", error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.user}>{item.user}</Text>
      <Text style={styles.message}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        inverted
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua mensagem..."
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.button} onPress={sendMessage}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    marginBottom: 10,
  },
  user: {
    fontWeight: 'bold',
  },
  message: {
    marginLeft: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
