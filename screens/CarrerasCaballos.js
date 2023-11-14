import React, { useState, useEffect  } from 'react';
import { View, Text,FlatList, Button, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { firebase } from '@react-native-firebase/database';
import { app } from '../database/firebase';
import { getFirestore, collection, onSnapshot, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons'; 
import Home from './Home';
import Baloncesto from './Baloncesto';
import Tenis from './Tenis';
import Futbol from './Futbol';
import { createStackNavigator } from '@react-navigation/stack';

const firestore = getFirestore(app);
const CarrerasCaballosCollection = collection(firestore, 'CarrerasCaballos');
const Stack = createStackNavigator();

export default function CarrerasCaballos(navigation) {
  const [carrerasCaballos, setCarrerasCaballos] = useState([]);
  const [monto, setMonto] = useState('');
  const [cuota, setCuota] = useState('');
  const [caballoSeleccionado, setCaballoSeleccionado] = useState('');

  
  const handleApostar = (caballo,c) => {
    setCaballoSeleccionado(caballo);
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
      ganador: caballoSeleccionado,
      ganancia: parsedMonto * cuota,
      idUsuario: usuarioId,
    };
  
    // Empujar los datos de la nueva apuesta a Firebase
    push(apuestasRef, nuevaApuesta)
      .then(() => {
        // Reiniciar el estado después de la apuesta
        setMonto('');
        setCuota('');
        setCaballoSeleccionado('');
        // Agregar aquí cualquier otra lógica después de realizar la apuesta
      })
      .catch((error) => {
        console.error('Error al crear la apuesta:', error);
      });
  };

  useEffect(() => {
    const obtenerCaballo = async () => {
      try {
        const querySnapshot = await getDocs(CarrerasCaballosCollection);
        const carrerasCaballosData = querySnapshot.docs.map((doc) => doc.data());
        console.log(carrerasCaballosData);
        setCarrerasCaballos(carrerasCaballosData);
      } catch (error) {
        console.error('Error al leer datos de partidosTenis:', error);
      }
    };

    obtenerCaballo();
  }, []);

  return (
    <View>
    <Text style={{ fontSize: 30, color: 'green' }}>Lista de caballos a correr
    <Ionicons name="md-tennisball" size={35} color="#FFBB00" />
    </Text>
    
    <FlatList
      data={carrerasCaballos}
      keyExtractor={(item, index) => (item.id ? item.id : index)}
      renderItem={({ item }) => (
        <View key={item.id} style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={{ width:100, fontSize: 20, color: 'blue' }}>{item.NombreCaballo1}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                caballoSeleccionado === item.NombreCaballo1 && styles.selectedButton,
                { width: 80, height: 30 },
              ]}
              onPress={() => handleApostar(item.NombreCaballo1, item.Cuota1)}>
              <Text style={styles.buttonText}>{item.Cuota1}</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ width:100, fontSize: 20, color: 'blue' }}>{item.NombreCaballo2}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                caballoSeleccionado === item.NombreCaballo2 && styles.selectedButton,
                { width: 80, height: 30 },
              ]}
              onPress={() => handleApostar(item.NombreCaballo2, item.Cuota2)}>
              <Text style={styles.buttonText}>{item.Cuota1}</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ width:100, fontSize: 20, color: 'blue' }}>{item.NombreCaballo3}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                caballoSeleccionado === item.NombreCaballo3 && styles.selectedButton,
                { width: 80, height: 30 },
              ]}
              onPress={() => handleApostar(item.NombreCaballo3, item.Cuota3)}>
              <Text style={styles.buttonText}>{item.Cuota1}</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ width:100, fontSize: 20, color: 'blue' }}>{item.NombreCaballo4}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                caballoSeleccionado === item.NombreCaballo4 && styles.selectedButton,
                { width: 80, height: 30 },
              ]}
              onPress={() => handleApostar(item.NombreCaballo4, item.Cuota4)}>
              <Text style={styles.buttonText}>{item.Cuota1}</Text>
            </TouchableOpacity>
          </View>
         
          
        </View>
        
      )}
    />
     {caballoSeleccionado !== '' && (
        <>
          <Text style={{ fontSize: 20 }}>Ganador: {caballoSeleccionado}</Text>
          <Text style={{ fontSize: 18 }}>Cuota:</Text>
          <Text style={{ fontSize: 20 }}>{cuota}</Text>
          <Text style={{ fontSize: 20 }}>Ingrese la cantidad apostada:</Text>
          <TextInput
            style={styles.input}
            placeholder="Cantidad"
            keyboardType="numeric"
            value={monto}
            onChangeText={(text) => setMonto(text)} 
          /> 
          <Text style={{ fontSize: 20 }}>Posibles ganancias: {cuota * monto} €</Text>
          <Button title="Confirmar Apuesta" onPress={handleConfirmarApuesta} color="#841584"/>
        </>
      )}
      <View style={styles.bottomContainerAbajo}>
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
        <Button title="Baloncesto" onPress={() => navigation.navigate('Baloncesto')} />
        <Button title="Futbol" onPress={() => navigation.navigate('Futbol')} />
        <Button title="Tenis" onPress={() => navigation.navigate('Tenis')} />
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
