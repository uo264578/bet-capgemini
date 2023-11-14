import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { app } from '../database/firebase';
import { getFirestore, collection, onSnapshot, getDocs } from 'firebase/firestore';
import { getDatabase, ref, push } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons'; 
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const firestore = getFirestore(app);
const partidosBaloncestoCollection = collection(firestore, 'PartidosBaloncesto');

const PartidosBaloncestoScreen = ({ navigation }) => {
  const [partidosBaloncesto, setPartidosBaloncesto] = useState([]);
  const [monto, setMonto] = useState('');
  const [cuota, setCuota] = useState('');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('');

  const handleApostar = (equipo,c) => {
    setEquipoSeleccionado(equipo);
    setCuota(c);
  };

  const handleConfirmarApuesta = () => {
    const usuarioId = firebase.auth().currentUser.uid;
    const db = getDatabase();
  
    // Validar la cantidad apostada
    const parsedMonto = parseFloat(monto);
    if (isNaN(parsedMonto) || parsedMonto <= 0) {
      Alert.alert('Cantidad inválida', 'Ingrese una cantidad válida para apostar.');
      return;
    }
  
    // Referencia a la tabla de apuestas
    const apuestasRef = ref(db, `/apuesta`);
  
    // Crear un nuevo registro de apuesta
    const nuevaApuesta = {
      monto: parsedMonto,
      cuota: parseFloat(cuota),
      fecha: new Date().toString(),
      ganador: equipoSeleccionado,
      ganancia: parsedMonto * cuota,
      idUsuario: usuarioId,
    };
  
    // Empujar los datos de la nueva apuesta a Firebase
    push(apuestasRef, nuevaApuesta)
      .then(() => {
        // Reiniciar el estado después de la apuesta
        setMonto('');
        setCuota('');
        setEquipoSeleccionado('');
      })
      .catch((error) => {
        console.error('Error al crear la apuesta:', error);
      });
  };

  useEffect(() => {
    const obtenerPartidosBaloncesto = async () => {
      try {
        const querySnapshot = await getDocs(partidosBaloncestoCollection);
        const partidosBaloncestoData = querySnapshot.docs.map((doc) => doc.data());
        console.log(partidosBaloncestoData);
        setPartidosBaloncesto(partidosBaloncestoData);
      } catch (error) {
        console.error('Error al leer datos de partidosBaloncesto:', error);
      }
    };

    obtenerPartidosBaloncesto();
    
  }, []);

  return (
    <View>
    
    <Text style={{ fontSize: 30, color: 'green' }}>Lista de apuestas de Baloncesto
    <Ionicons name="md-basketball" size={40} color="orange" style={styles.icon} />
    </Text>
    
    <FlatList
      data={partidosBaloncesto}
      keyExtractor={(item, index) => (item.id ? item.id : index)}
      renderItem={({ item }) => (
        <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ width:100, fontSize: 20, color: 'blue' }}>{item.Equipo1}</Text>
          <Text style={{ width: 50, fontSize: 20, color: 'blue' }}> VS </Text>
          <Text style={{ width: 100, fontSize: 20, color: 'blue' }}>{item.Equipo2}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                equipoSeleccionado === item.Equipo1 && styles.selectedButton,
                { width: 80, height: 50 },
              ]}
              onPress={() => handleApostar(item.Equipo1, item.Cuota1)}>
              <Text style={styles.buttonText}>{item.Cuota1}</Text>
            </TouchableOpacity>
          
            <TouchableOpacity
              style={[
                styles.button,
                equipoSeleccionado === item.Equipo2 && styles.selectedButton,
                { width: 80, height: 50 },
              ]}
              a = {item.Cuota2}
              onPress={() => handleApostar(item.Equipo2, item.Cuota2)}>
              <Text style={styles.buttonText}>{item.Cuota2}</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      )}
    />
     {equipoSeleccionado !== '' && (
        <>
          <Text style={{ fontSize: 24 }}>Ganador: {equipoSeleccionado}</Text>
          <Text style={{ fontSize: 20 }}>Cuota:</Text>
          <Text style={{ fontSize: 24 }}>{cuota}</Text>
          <Text style={{ fontSize: 24 }}>Ingrese la cantidad apostada:</Text>
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
      <View style={styles.bottomContainerAbajo}>
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
        <Button title="Tenis" onPress={() => navigation.navigate('Tenis')} />
        <Button title="Futbol" onPress={() => navigation.navigate('Futbol')} />
        <Button title="Carreras de Caballos" onPress={() => navigation.navigate('CarrerasCaballos')} />
      </View>
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
  },
  bottomContainerAbajo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
  },
});


export default PartidosBaloncestoScreen;
