// RegistroUsuario.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { firebase } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function RegistroUsuario() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');

  const navigation = useNavigation();

  const handleRegistro = async () => {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

      // Agregamos el nombre de usuario a la base de datos de Firebase
      await firebase.database().ref(`/usuarios/${userCredential.user.uid}`).set({
        nombreUsuario,
        email,
      });

      console.log('Usuario registrado con éxito', userCredential.user.uid);
      
      // Navegamos a la ventana Home después del registro
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error al registrar usuario', error.message);
    }
  };

  return (
    <View>
      <Text>Registro de Usuario</Text>
      <TextInput placeholder="Nombre de usuario" onChangeText={setNombreUsuario} />
      <TextInput placeholder="Correo electrónico" onChangeText={setEmail} />
      <TextInput placeholder="Contraseña" secureTextEntry onChangeText={setPassword} />
      <Button title="Registrar" onPress={handleRegistro} />
    </View>
  );
}
