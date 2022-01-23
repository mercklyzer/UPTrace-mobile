import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native'
import Colors from '../constants/Colors'


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
            <TextInput 
                {...props}
                style={styles.input} 
                value={value} 
                onChangeText={(text) => props.onInputChange(text, props.field)}
            />

            {errorMessage!==''  && (
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