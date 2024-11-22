import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../services/firebaseConfig';
import { collection, addDoc, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged} from 'firebase/auth'

const ChatScreen = ({ route }) => {
  const { userEmail, otherUserEmail } = route.params; // Recebe os e-mails do usuário autenticado e do outro usuário
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Atualiza o estado com o usuário autenticado
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Monitorando as mensagens no Firestore
    if (user && otherUserEmail) {
      const chatId = [user.email, otherUserEmail].sort().join('_');
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, where('chatId', '==', chatId), orderBy('timestamp', 'desc'));

      const unsubscribeMessages = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(doc => doc.data()));
      });

      return () => {
        unsubscribeAuth();
        unsubscribeMessages();
      };
    }
  }, [user, otherUserEmail]);

  const sendMessage = async () => {
    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado para enviar mensagens.");
      return;
    }

    if (message.trim()) {
      try {
        const chatId = [user.email, otherUserEmail].sort().join('_');
        await addDoc(collection(db, 'messages'), {
          text: message,
          user: user.email,
          timestamp: new Date(),
          chatId: chatId,
        });
        setMessage('');
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
      <Text>Conversando com: {otherUserEmail}</Text>
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
