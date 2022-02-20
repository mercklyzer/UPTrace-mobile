import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import Colors from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons'; 


const Input = props => {
    const [value, setValue] = useState(props.value)
    const [touch, setTouch] = useState(props.touch)
    const [errorMessage, setErrorMessage] = useState(props.errorMessage)
    

    useEffect(() => {
        setValue(props.value)
    }, [props.value])

    useEffect(() => {
        setTouch(props.touch)
    }, [props.touch])

    useEffect(() => {
        setErrorMessage(props.errorMessage)
    }, [props.errorMessage])

    return (
        <View style={styles.formControl}>
            <Text style={styles.label}>{props.label}</Text>
            {props.isPassword && <View style={{flex: 1, flexDirection:'row'}}>
                <TextInput 
                    {...props}
                    style={styles.input} 
                    value={value} 
                    onChangeText={(text) => props.onInputChange(text, props.field)}
                />
                {!props.isPasswordVisible && 
                    <TouchableOpacity onPress={() => props.setIsPasswordVisible(val => !val)}>
                        <Ionicons  name="eye" size={24} color="black" style={{flexGrow: 0, textAlignVertical: "center"}}/>
                    </TouchableOpacity>
                
                }
                {props.isPasswordVisible && 
                    <TouchableOpacity onPress={() => props.setIsPasswordVisible(val => !val)}>
                        <Ionicons  name="eye-off" size={24} color="black" style={{flexGrow: 0, textAlignVertical: "center"}}/>
                    </TouchableOpacity>
                }
                
                

             </View>}

            {!props.isPassword && <TextInput 
                {...props}
                style={styles.input} 
                value={value} 
                onChangeText={(text) => props.onInputChange(text, props.field)}
            />}

            {errorMessage !=='' && touch && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    formControl:{
        width: '100%',
    },
    label: {
        fontFamily: 'roboto-medium',
        color: Colors.darkgreen,
        marginVertical: Dimensions.get('window').height > 800? 8: 4,
        fontSize: Dimensions.get('window').width > 600? 22: 18,
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        fontSize: Dimensions.get('window').width > 600? 22: 18,
        marginBottom: Dimensions.get('window').height > 800? 14: 10,
        flexGrow: 1
    },
    errorContainer: {
        marginVertical: Dimensions.get('window').height > 800? 8: 4,
    },
    errorText: {
        fontFamily: 'roboto-regular',
        color: 'red',
        fontSize: 13
    }
})

export default Input