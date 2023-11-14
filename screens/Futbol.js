import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { firebase } from '@react-native-firebase/database';

export default function Futbol() {
  const [monto, setMonto] = useState('');
  const [cuota, setCuota] = useState('');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('');

  const handleApostar = (equipo,c) => {
    setEquipoSeleccionado(equipo);
    setCuota(c);
  };

  const handleConfirmarApuesta = () => {
    const usuarioId = firebase.auth().currentUser.uid;

    // Validar la cantidad apostada
    const parsedMonto = parseFloat(monto);
    if (isNaN(parsedMonto) || parsedMonto <= 0) {
      Alert.alert('Cantidad inválida', 'Ingrese una cantidad válida para apostar.');
      return;
    }

    // Realizar la apuesta usando la cantidad, cuota y otros detalles
    firebase.database().ref(`/apuestas/futbol/${usuarioId}`).push({
      monto: parsedMonto,
      cuota: parseFloat(cuota),
      fecha: new Date().toString(),
      ganador: equipoSeleccionado,
      ganancia: parsedMonto * cuota, // Ganancia es igual a la cantidad apostada en este caso
      idUsuario: usuarioId,
    });

    // Reiniciar el estado después de la apuesta
    setMonto('');
    setCuota('');
    setEquipoSeleccionado('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página de Apuestas de Fútbol</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, equipoSeleccionado === 'Equipo1' && styles.selectedButton]}
          onPress={() => handleApostar('Equipo1',1.7)}
        >
          <Text style={styles.buttonText}>Equipo 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, equipoSeleccionado === 'Empate' && styles.selectedButton]}
          onPress={() => handleApostar('Empate', 2.5)}
        >
          <Text style={styles.buttonText}>Empate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, equipoSeleccionado === 'Equipo2' && styles.selectedButton]}
          onPress={() => handleApostar('Equipo2', 3.5)}
        >
          <Text style={styles.buttonText}>Equipo 2</Text>
        </TouchableOpacity>
      </View>
      {equipoSeleccionado !== '' && (
        <>
          <Text style={styles.label}>Ingrese la cantidad apostada:</Text>
          <Text style={styles.label}>Cuota:</Text>
          <Text style={styles.label}>{cuota}</Text>
          <TextInput
            style={styles.input}
            placeholder="Cantidad"
            keyboardType="numeric"
            value={monto}
            onChangeText={(text) => setMonto(text)}
          />
          <Button title="Confirmar Apuesta" onPress={handleConfirmarApuesta} />
        </>
      )}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: 'darkblue',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
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
