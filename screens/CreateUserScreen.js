import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

const CreateUserScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSignUp = async () => {
      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Registro exitoso, puedes hacer algo aquí si lo necesitas
        console.log('Usuario registrado con éxito:', userCredential.user.uid);
      } catch (error) {
        console.error('Error al registrar usuario:', error.message);
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
  
        <Button title="Registrarse" onPress={handleSignUp} />
  
        <Button title="Ir a Iniciar Sesión" onPress={() => navigation.navigate('Login')} />
      </View>
    );
  };
  
  export default CreateUserScreen;
  