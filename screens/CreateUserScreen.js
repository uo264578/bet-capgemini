import {View, Text, Button, TextInput, StyleSheet, ScrollView } from 'react-native';
import React, {useState, setState} from 'react';

import {firestore} from "../database/firebase";
import {addDoc, collection} from "@firebase/firestore";

const CreateUserScreen=(props)=>{
    const[state, setState]=useState({
        name:'',
        password:'',
        email:''
    })

    const saveNewUser = async () => {
        console.log(state);
        if (state.name === '') {
            alert('Usuario sin nombre');
        } else {
            const ref = collection(firestore, "users");
            try {
                const docRef = await addDoc(ref, state);
                console.log("Document written with ID: ", docRef.id);
                alert('Usuario guardado');
            } catch (err) {
                console.error("Error adding document: ", err);
            }
        }
    };
    
    

    return(
        <ScrollView>
            <View style={styles.inputGroup}>
                <Text>Crear Usuario</Text>
            </View>
            <View style={styles.inputGroup}>
                <TextInput placeholder='Nombre' onChangeText={(value)=>setState({...state,name:value})}/>
            </View>
            <View style={styles.inputGroup}>
            <TextInput placeholder='Email' onChangeText={(value)=>setState({...state,email:value})}/>
            </View>
            <View style={styles.inputGroup}>
            <TextInput placeholder='Password' onChangeText={(value)=>setState({...state,password:value})}/>
            </View>

            <View>
                <Button title="Guardar Usuario" onPress={()=>saveNewUser()}/>
            </View>

        </ScrollView>
    )

}


const styles=StyleSheet.create({
    container:{
        flex: 1, 
        padding: 35
    },
    inputGroup:{
        flex: 1, 
        padding: 0,
        marginBottom: 15,
        borderBottomWidth:1,
        borderBottomColor:'#cccccc'
    }
})

export default CreateUserScreen;