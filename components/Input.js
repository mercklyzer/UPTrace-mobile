import React, { useEffect, useReducer } from 'react'
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native'
import { borderColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes'
import Colors from '../constants/Colors'

const INPUT_CHANGE = 'INPUT_CHANGE'
const INPUT_BLUR = 'INPUT_BLUR'

const inputReducer = (state, action) => {
    switch(action.type){
        case INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid
            }
        case INPUT_BLUR:
            return {
                ...state,
                touched: true
            }
        default:
            return state
    }
}

const Input = props => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue? props.initialValue: '',
        isValid: props.initiallyValid,
        touched: props.initialValue ? true : false
    })

    const {onInputChange, id} = props

    useEffect(() => {
        if(inputState.touched){
            onInputChange(id, inputState.value, inputState.isValid)
        }
    }, [inputState, onInputChange, id])

    const textChangeHandler = text => {
        let isValid = true;
        if (props.required && text.trim().length === 0) {
        isValid = false;
        }

        if (props.minLength != null && text.length < props.minLength) {
        isValid = false;
        }

        if (props.maxLength != null && text.length > props.maxLength) {
        isValid = false;
        }
        dispatch({type: INPUT_CHANGE, value: text, isValid: isValid})
        dispatch({type: INPUT_BLUR})
    }

    return (
        <View style={styles.formControl}>
            <Text style={styles.label}>{props.label}</Text>
            <TextInput 
                {...props}
            // see docs
                style={styles.input} 
                value={inputState.value} 
                onChangeText={textChangeHandler}
            />

            {!inputState.isValid && inputState.touched && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{props.errorText}</Text>
                </View>
            )}

            {props.forceErrorText !== '' && inputState.touched && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{props.forceErrorText}</Text>
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