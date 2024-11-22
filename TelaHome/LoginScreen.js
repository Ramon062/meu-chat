import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  const handleLogin = async () => {
    setLoading(true);

    // Verifica se os campos não estão vazios
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      // Tenta fazer login com email e senha
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);

      // O login foi bem-sucedido, vamos navegar para o ChatScreen
      const otherUserEmail = 'user1@example.com'; // Define o outro usuário
      navigation.navigate('ChatScreen', { userEmail: email, otherUserEmail });
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/user-not-found') {
        Alert.alert("Erro", "Usuário não encontrado.");
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert("Erro", "Senha incorreta.");
      } else {
        Alert.alert("Erro", "Ocorreu um erro. Tente novamente.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Carregando..." : "Entrar"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
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

export default LoginScreen;
