// Importa los módulos necesarios
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

// Define la función LoginScreen
const LoginScreen = ({ navigation }) => {
  // Estados para el correo electrónico y la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Función para manejar el inicio de sesión
  const handleSignIn = async () => {
    const auth = getAuth();
    try {
      // Inicia sesión con el correo electrónico y la contraseña
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
      // Inicio de sesión exitoso, puedes hacer algo aquí si lo necesitas
      console.log('Inicio de sesión exitoso');
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      // Manejar el error, mostrar un mensaje al usuario, etc.
    }
  };

  return (
    <View>
      <Text>Correo Electrónico:</Text>
      <TextInput
        placeholder="Ingrese su correo electrónico"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <Text>Contraseña:</Text>
      <TextInput
        placeholder="Ingrese su contraseña"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      <Button title="Iniciar Sesión" onPress={handleSignIn} />

      <Button title="Ir a Registrarse" onPress={() => navigation.navigate('CreateUser')} />
    </View>
  );
};

export default LoginScreen;
