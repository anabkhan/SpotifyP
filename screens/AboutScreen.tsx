import React from 'react';
import { AsyncStorage, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

const AboutScreen = () => {

    const deleteAllData = async () => {
        await AsyncStorage.clear();
    }

    return (
        <View style={{height: '100%', width: '100%', justifyContent: 'center', alignItems:'center'}}>
            <Text style={{fontSize: 25, color: 'gray'}}>Developed By Anab Khan</Text>
            <Text style={{fontSize: 18, color: 'gray'}}>Version : 1.0</Text>
            <TouchableOpacity onPress={deleteAllData}>
                <Ionicons name="trash-sharp" size={24} color="white" />
                <Text style={{color: 'white', textAlign:'center'}}>Delete All Data</Text>
            </TouchableOpacity>
        </View>
    )
}

export default AboutScreen;