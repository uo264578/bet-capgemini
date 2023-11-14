import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { app } from '../database/firebase';
import { getFirestore, collection, onSnapshot, getDocs } from 'firebase/firestore';

const firestore = getFirestore(app);
const partidosTenisCollection = collection(firestore, 'PartidosTenis');

const PartidosTenisScreen = () => {
  const [partidosTenis, setPartidosTenis] = useState([]);
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
    firebase.database().ref(`/apuestas/${usuarioId}`).push({
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
    const obtenerPartidosTenis = async () => {
      try {
        const querySnapshot = await getDocs(partidosTenisCollection);
        const partidosTenisData = querySnapshot.docs.map((doc) => doc.data());
        console.log(partidosTenisData);
        setPartidosTenis(partidosTenisData);
      } catch (error) {
        console.error('Error al leer datos de partidosTenis:', error);
      }
    };

    obtenerPartidosTenis();
    //console.log(partidosTenisCollection);
    // const unsubscribe = onSnapshot(partidosTenis, (snapshot) => {
    //   snapshot.docChanges().forEach((change) => {
    //     // Actualiza el estado con el nuevo dato en tiempo real
    //     setPartidosTenis((prevPartidosTenis) => {
    //       const updatedPartidosTenis = [...prevPartidosTenis];
    //       const changedPartido = change.doc.data();
    //       const index = updatedPartidosTenis.findIndex(
    //         (partido) => partido.id === change.doc.id
    //       );

    //       if (change.type === 'added') {
    //         // Añade el nuevo partido
    //         updatedPartidosTenis.push(changedPartido);
    //       } else if (change.type === 'modified') {
    //         // Actualiza el partido existente
    //         updatedPartidosTenis[index] = changedPartido;
    //       } else if (change.type === 'removed') {
    //         // Elimina el partido existente
    //         updatedPartidosTenis.splice(index, 1);
    //       }

    //       return updatedPartidosTenis;
    //     });
    //   });
    // });

    // return () => {
    //   unsubscribe();
    // };
  }, []);

  return (
    <View>
    <Text style={{ fontSize: 30, color: 'green' }}>Lista de apuestas de Tenis</Text>
    
    <FlatList
      data={partidosTenis}
      keyExtractor={(item, index) => (item.id ? item.id : index)}
      renderItem={({ item }) => (
        <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ width:100, fontSize: 20, color: 'blue' }}>{item.Jugador1}</Text>
          <Text style={{ width: 50, fontSize: 20, color: 'blue' }}> VS </Text>
          <Text style={{ width: 100, fontSize: 20, color: 'blue' }}>{item.Jugador2}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                equipoSeleccionado === item.Jugador1 && styles.selectedButton,
                { width: 80, height: 50 },
              ]}
              onPress={() => handleApostar(item.Jugador1, item.Cuota1)}>
              <Text style={styles.buttonText}>{item.Cuota1}</Text>
            </TouchableOpacity>
          
            <TouchableOpacity
              style={[
                styles.button,
                equipoSeleccionado === item.Jugador2 && styles.selectedButton,
                { width: 80, height: 50 },
              ]}
              a = {item.Cuota2}
              onPress={() => handleApostar(item.Jugador2, item.Cuota2)}>
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


export default PartidosTenisScreen;
