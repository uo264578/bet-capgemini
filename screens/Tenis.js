import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { app } from '../database/firebase';
import { getFirestore, collection, onSnapshot, getDocs } from 'firebase/firestore';

const firestore = getFirestore(app);
const partidosTenisCollection = collection(firestore, 'PartidosTenis');

const PartidosTenisScreen = () => {
  const [partidosTenis, setPartidosTenis] = useState([]);

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
    console.log(partidosTenisCollection);
    const unsubscribe = onSnapshot(partidosTenisCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        // Actualiza el estado con el nuevo dato en tiempo real
        setPartidosTenis((prevPartidosTenis) => {
          const updatedPartidosTenis = [...prevPartidosTenis];
          const changedPartido = change.doc.data();
          const index = updatedPartidosTenis.findIndex(
            (partido) => partido.id === change.doc.id
          );

          if (change.type === 'added') {
            // Añade el nuevo partido
            updatedPartidosTenis.push(changedPartido);
          } else if (change.type === 'modified') {
            // Actualiza el partido existente
            updatedPartidosTenis[index] = changedPartido;
          } else if (change.type === 'removed') {
            // Elimina el partido existente
            updatedPartidosTenis.splice(index, 1);
          }

          return updatedPartidosTenis;
        });
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View>
      <Text>Lista de Partidos de Tenis</Text>
      <FlatList
        data={partidosTenis}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
        <View key={item.id}>
          <Text>Jugador 1: {item.id}</Text>
          <Text>Jugador 2: {item.jugador2}</Text>
          <Text>Cuota 1: {item.cuota1}</Text>
          <Text>Cuota 2: {item.cuota2}</Text>
          <Text>Fecha: {item.fecha}</Text>
          <Text>--------------------------</Text>
        </View>
  )}
/>


    </View>
  );
};

export default PartidosTenisScreen;
