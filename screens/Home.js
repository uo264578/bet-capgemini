// Home.js
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View>
      <Text>Inicio</Text>
      <Button title="Fútbol" onPress={() => navigation.navigate('Futbol')} />
      <Button title="Baloncesto" onPress={() => navigation.navigate('Baloncesto')} />
      <Button title="Tenis" onPress={() => navigation.navigate('Tenis')} />
      <Button title="Carreras de Caballos" onPress={() => navigation.navigate('CarrerasCaballos')} />
    </View>
  );
}
