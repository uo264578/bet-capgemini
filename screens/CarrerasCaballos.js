// CarrerasCaballos.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { firebase } from '@react-native-firebase/database';

export default function CarrerasCaballos() {
  const [monto, setMonto] = useState('');
  const [caballoSeleccionado, setCaballoSeleccionado] = useState('');

  const handleApostar = () => {
    const usuarioId = firebase.auth().currentUser.uid;

    firebase.database().ref(`/apuestas/caballos/${usuarioId}`).push({
      monto,
      caballoSeleccionado,
      fecha: new Date().toString(),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página de Apuestas de Carreras de Caballos</Text>
      <Text style={styles.label}>Ingrese la información de su apuesta:</Text>
      <TextInput
        style={styles.input}
        placeholder="Monto"
        keyboardType="numeric"
        value={monto}
        onChangeText={(text) => setMonto(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Caballo seleccionado"
        value={caballoSeleccionado}
        onChangeText={(text) => setCaballoSeleccionado(text)}
      />
      <Button title="Apostar" onPress={handleApostar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
});
