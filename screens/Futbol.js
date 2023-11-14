import React, { useState, useEffect  } from 'react';
import { View, Text,FlatList, Button, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { firebase } from '@react-native-firebase/database';
import { app } from '../database/firebase';
import { getFirestore, collection, onSnapshot, getDocs } from 'firebase/firestore';

const firestore = getFirestore(app);
const partidosFutbolCollection = collection(firestore, 'partidosFutbol');

export default function Futbol() {
  const [partidosFutbol, setPartidosFutbol] = useState([]);
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

  
  useEffect(() => {
    const obtenerPartidosFutbol = async () => {
      try {
        const querySnapshot = await getDocs(partidosFutbolCollection);
        const partidosFutbolData = querySnapshot.docs.map((doc) => doc.data());
        console.log(partidosFutbolData);
        setPartidosFutbol(partidosFutbolData);
      } catch (error) {
        console.error('Error al leer datos de partidosFutbol:', error);
      }
    };

    obtenerPartidosFutbol();

  }, []);

  return (
    <View>
    <Text style={{ fontSize: 30, color: 'green' }}>Lista de Partidos de Futbol</Text>
    
    <FlatList
      data={partidosFutbol}
      keyExtractor={(item, index) => (item.id ? item.id : index)}
      renderItem={({ item }) => (
        <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ width:70, fontSize: 18, color: 'blue' }}>{item.Equipo1}</Text>
          <Text style={{ width: 40, fontSize: 18, color: 'blue' }}> VS </Text>
          <Text style={{ width: 100, fontSize: 18, color: 'blue' }}>{item.Equipo2}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                equipoSeleccionado === item.Equipo1 && styles.selectedButton,
                { width: 70, height: 50 },
              ]}
              onPress={() => handleApostar(item.Equipo1, item.Cuota1)}>
              <Text style={styles.buttonText}>{item.Cuota1}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                equipoSeleccionado === item.EquipoX && styles.selectedButton,
                { width: 70, height: 50 },
              ]}
              onPress={() => handleApostar(item.EquipoX, item.CuotaX)}>
              <Text style={styles.buttonText}>{item.CuotaX}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                equipoSeleccionado === item.Equipo2 && styles.selectedButton,
                { width: 70, height: 50 },
              ]}
              onPress={() => handleApostar(item.Equipo2, item.Cuota2)}>
              <Text style={styles.buttonText}>{item.Cuota2}</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      )}
    />
     {equipoSeleccionado !== '' && (
        <>
          <Text style={{ fontSize: 24 }}>Ingrese la cantidad apostada:</Text>
          <Text style={{ fontSize: 20 }}>Cuota:</Text>
          <Text style={{ fontSize: 24 }}>{cuota}</Text>
          <TextInput
            style={styles.input}
            placeholder="Cantidad"
            keyboardType="numeric"
            value={monto}
            onChangeText={(text) => setMonto(text)}
          />
          <Text style={{ fontSize: 24 }}>Posibles ganancias: {cuota * monto} €</Text>
          <Button title="Confirmar Apuesta" onPress={handleConfirmarApuesta} color="#841584"/>
        </>
      )}
  </View>
  
  );
  
};

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
    justifyContent: ' center',
    marginBottom: 5,
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
    fontSize: 20,
  },
  label: {
    fontSize: 25,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    fontSize: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  }
});


