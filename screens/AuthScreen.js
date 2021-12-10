import React, { useCallback, useReducer, useState } from "react";
import { Button, StyleSheet, Text, View, ScrollView, Picker, Alert } from "react-native";
import Card from '../components/Card'
import Input from "../components/Input";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import Colors from '../constants/Colors'
import { useDispatch, useSelector } from "react-redux";

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
    if(action.type == FORM_INPUT_UPDATE){
        console.log(action.input);

        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        }
        
        let updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }

        if(action.input === 'password' || action.input === 'confirm_password'){
            updatedValidities = {
                ...updatedValidities, 
                ["password"]: action.isValid && (updatedValues['password'] === updatedValues['confirm_password']),
                ["confirm_password"]: action.isValid && (updatedValues['password'] === updatedValues['confirm_password'])
            }
        }

        if(action.input === 'start_time' || action.input === 'end_time'){
            updatedValidities = {
                ...updatedValidities, 
                ["start_time"]: action.isValid && (updatedValues['start_time'] < updatedValues['end_time']),
                ["end_time"]: action.isValid && (updatedValues['start_time'] < updatedValues['end_time']),
            }
        }

        let updatedFormIsValid = true
        for(const key in updatedValidities){
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }

        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues,
        }
    }
    return state
}

const AuthScreen = props => {   
    const dispatch = useDispatch()

    const [error,setError] = useState()

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            contact_num: '',
            password: '',
            confirm_password: '',
            role: 'ordinary',
            start_time: '',
            end_time: '',
            way_of_interview: 'One at a time'           
        },
        inputValidities: {
            contact_num: false,
            password: false,
            confirm_password: false,
            role: true,
            start_time: false,
            end_time: false,
            way_of_interview: true  
        },
        formIsValid: false
    })

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {

            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        }, [dispatchFormState]
    );

    // const [date, setDate] = useState(new Date(1));
    const [startShow, setStartShow] = useState(false);
    const [startText, setStartText] = useState('')
    const [endShow, setEndShow] = useState(false);
    const [endText, setEndText] = useState('')

    const onStartTimeChange = (event, selectedDate) => {
        setStartShow(Platform.OS === 'ios');
        setStartText(moment(selectedDate).format("hh:mm A"))       
        inputChangeHandler('start_time', moment(selectedDate).format("HH:mm"), true) 
    };

    const onEndTimeChange = (event, selectedDate) => {
        console.log("onchange");
        setEndShow(Platform.OS === 'ios');
        setEndText(moment(selectedDate).format("hh:mm A")) 
        inputChangeHandler('end_time', moment(selectedDate).format("HH:mm"), true)
      };
    
      const showTimepicker = (field) => {
          if(field === 'start'){
            setStartShow(true)
          }
          else{
            setEndShow(true)
          }
      };

    console.log(formState.inputValidities);
    let passwordMatch = formState.inputValidities['password'] && formState.inputValidities['confirm_password']
    let validTime = formState.inputValidities['start_time'] && formState.inputValidities['end_time']

    return (
        <View behavior='padding' style={styles.screen}>
            <Card style={styles.authContainer}>
                <ScrollView>
                    <Input 
                        id='contact_num'
                        label='Contact Number'
                        keyboardType='phone-pad'
                        required
                        autoCapitalize="none"
                        errorText="Please enter a valid phone number."
                        onInputChange={inputChangeHandler}
                        initialValue=''
                    />
                    <Input 
                        id='password'
                        label='Password'
                        keyboardType='default'
                        secureTextEntry={true}
                        required
                        autoCapitalize="none"
                        errorText="Please enter a valid password."
                        forceErrorText={passwordMatch? '' : 'Passwords do not match.'}
                        onInputChange={inputChangeHandler}
                        initialValue=''
                    />
                    <Input 
                        id='confirm_password'
                        label='Confirm Password'
                        keyboardType='default'
                        secureTextEntry={true}
                        required
                        autoCapitalize="none"
                        errorText="Please enter a valid password."
                        forceErrorText={passwordMatch? '' : 'Passwords do not match.'}
                        onInputChange={inputChangeHandler}
                        initialValue=''
                    />

                    <View style={styles.startAndEndTimeContainer}>
                        <Text style={styles.formControlHeader}>Preferred Contact Time:</Text>
                        <View style={styles.formGroup}>
                            <Text style={styles.formControlLabel}>Start Time:</Text>
                            <View style={styles.timeInput}>
                                <Text style={styles.timeText}>{startText}</Text>
                                <View style={styles.setButtonContainer}>
                                    <Button onPress={() => showTimepicker('start')} title="Set" color={Colors.darkgreen}/>
                                </View>
                            </View>
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{validTime || startText == ''? '' : 'Start time should be before the end time.'}</Text>
                            </View>
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.formControlLabel}>End Time:</Text>
                            <View style={styles.timeInput}>
                                <Text style={styles.timeText}>{endText}</Text>
                                <View style={styles.setButtonContainer}>
                                    <Button onPress={() => showTimepicker('end')} title="Set" color={Colors.darkgreen}/>
                                </View>
                            </View>
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{validTime || endText === ''? '' : 'End time should be after the start time.'}</Text>
                            </View>
                        </View>
                        {startShow && (
                            <DateTimePicker
                            testID="dateTimePickerStart"
                            value={new Date(1)}
                            mode="time"
                            is24Hour={false}
                            display="default"
                            onChange={onStartTimeChange}
                            />
                        )}
                        {endShow && (
                            <DateTimePicker
                            testID="dateTimePickerEnd"
                            value={new Date(1)}
                            mode="time"
                            is24Hour={false}
                            display="default"
                            onChange={onEndTimeChange}
                            />
                        )}
                        </View>
                        <View>                       
                            <View style={styles.formGroup}>
                                <Text style={styles.formControlLabel}>Preferred Way of Contact:</Text>
                                <Picker
                                    selectedValue={'One at a time'}
                                    style={{ height: 50, width: 200}}
                                    onValueChange={(itemValue, itemIndex) => inputChangeHandler('way_of_interview', itemValue, true)}
                                >
                                    <Picker.Item label="One at a time" value="One at a time" />
                                    <Picker.Item label="All at once" value="All at once" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.wideButtonContainer}>
                            <Button title="SIGNUP" color={Colors.maroon} onPress={() => console.log('')}/>
                        </View>
                        <View style={styles.wideButtonContainer}>
                            <Button title="Go to Login" color={Colors.darkgreen}/>
                        </View>

                </ScrollView>
            </Card>
        </View>
    )
}

AuthScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Signup/Login'
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        height: '90%',
        maxHeight: 800,
        padding: 20
    },
    startAndEndTimeContainer: {
        // height: 100
    },
    formGroup: {
        marginTop: 8
    },  
    formControlHeader: {
        marginTop: 50
    },
    formControlLabel: {
        marginVertical: 2
    },
    timeInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    timeText: {
        
    },
    setButtonContainer: {

    },
    wideButtonContainer: {
        marginVertical: 8
    },
    errorContainer: {
        marginVertical: 5
      },
    errorText: {
        // fontFamily: 'open-sans',
        color: 'red',
        fontSize: 13
    }
})

export default AuthScreen