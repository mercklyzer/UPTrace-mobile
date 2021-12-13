import React, { useCallback, useReducer, useState } from "react";
import { Button, StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import {Picker} from '@react-native-picker/picker'
import Card from '../components/Card'
import Input from "../components/Input";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import Colors from '../constants/Colors'
import { useDispatch, useSelector } from "react-redux";
import * as authActions from '../store/actions/auth'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const signupFormReducer = (state, action) => {
    if(action.type == FORM_INPUT_UPDATE){

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

const loginFormReducer = (state, action) => {
    if(action.type == FORM_INPUT_UPDATE){

        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        }
        
        let updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
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
    const [isSignup, setIsSignup] = useState(true)

    const [error,setError] = useState()
    const [showOtp, setShowOtp] = useState(false)

    const [signupFormState, dispatchSignupFormState] = useReducer(signupFormReducer, {
        inputValues: {
            contact_num: '',
            password: '',
            confirm_password: '',
            role: 'ordinary',
            start_time: '',
            end_time: '',
            way_of_interview: 'One at a time',
            otp: ''       
        },
        inputValidities: {
            contact_num: false,
            password: false,
            confirm_password: false,
            role: true,
            start_time: false,
            end_time: false,
            way_of_interview: true,
            otp: false
        },
        formIsValid: false
    })

    const [loginFormState, dispatchLoginFormState] = useReducer(loginFormReducer, {
        inputValues: {
            contact_num: '',
            password: '',    
        },
        inputValidities: {
            contact_num: false,
            password: false
        },
        formIsValid: false
    })

    const loginInputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {

            dispatchLoginFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        }, [dispatchLoginFormState]
    );

    

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {

            dispatchSignupFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        }, [dispatchSignupFormState]
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

    const requestOtp = async () => {
        try{
            await dispatch(authActions.requestOtp(signupFormState.inputValues['contact_num']))
            .then((message) => {
                console.log(message);
                if(message === "You may now input the OTP."){
                    setShowOtp(true)
                }
            })
        }
        catch(err){
            console.log(err.message);
            if(err.message === 'You can request again after 5 minutes.'){
                setShowOtp(true)
            }
        }
    }

    const goBackOrLoginHandler = () => {
        if(showOtp){
            setShowOtp(false)
        }
        else{
            setIsSignup(false)
        }
    }

    const signup = async () => {
        try{
            await dispatch(authActions.signup(signupFormState.inputValues))
            .then((message) => {
                console.log(message);
                props.navigation.navigate('Content')
            })
        }
        catch(err){
            console.log(err.message);
        }
    }

    const loginHandler = async () => {
        console.log("logging in");
        try {
            await dispatch(authActions.login(loginFormState.inputValues.contact_num, loginFormState.inputValues.password))
            .then((message) => {
                console.log(message);
                props.navigation.navigate('Content')
            })
        }
        catch(err){
            console.log(err.message);
        }
    }

    const signupHandler = () => {
        console.log(signupFormState);
        if(!showOtp){
            requestOtp()
        }
        else{
            signup()
        }
    }

    const checkValidityExceptOtp = () => {
        let formIsValid = true
        for(const key in signupFormState.inputValidities){
            if(key !== 'otp'){
                formIsValid = formIsValid && signupFormState.inputValidities[key]
            }
        }
        return formIsValid
    }

    let passwordMatch = signupFormState.inputValidities['password'] && signupFormState.inputValidities['confirm_password']
    let validTime = signupFormState.inputValidities['start_time'] && signupFormState.inputValidities['end_time']

    console.log(signupFormState);

    return (
        <View style={styles.screen}>

            
           {isSignup && <Card style={styles.authContainer}>
                <ScrollView>
                    {showOtp && <Input 
                        id='otp'
                        label='OTP Number'
                        keyboardType='phone-pad'
                        required
                        maxLength={6}
                        minLength={6}
                        autoCapitalize="none"
                        errorText="Please enter a valid OTP."
                        onInputChange={inputChangeHandler}
                        initialValue={signupFormState.inputValues['otp']}
                        initiallyValid={signupFormState.inputValidities['otp']}
                    />}
                    {!showOtp && <View>                  
                        <Input 
                            id='contact_num'
                            label='Contact Number'
                            keyboardType='phone-pad'
                            required
                            autoCapitalize="none"
                            minLength={11}
                            maxLength={11}
                            errorText="Please enter a valid phone number."
                            onInputChange={inputChangeHandler}
                            initialValue={signupFormState.inputValues['contact_num']}
                            initiallyValid={signupFormState.inputValidities['contact_num']}
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
                            initialValue={signupFormState.inputValues['password']}
                            initiallyValid={signupFormState.inputValidities['password']}
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
                            initialValue={signupFormState.inputValues['confirm_password']}
                            initiallyValid={signupFormState.inputValidities['confirm_password']}
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
                                        selectedValue={signupFormState.inputValues['way_of_interview']}
                                        style={{ height: 50, width: 200}}
                                        onValueChange={(itemValue, itemIndex) => inputChangeHandler('way_of_interview', itemValue, true)}
                                    >
                                        <Picker.Item label="One at a time" value="One at a time" />
                                        <Picker.Item label="All at once" value="All at once" />
                                    </Picker>
                                </View>
                            </View>
                        </View>}

                        {/* just create different components for login */}
                        <View style={styles.wideButtonContainer}>
                            <Button 
                                title="SIGNUP" 
                                color={Colors.maroon} onPress={signupHandler} 
                                disabled={showOtp? !signupFormState.formIsValid : !checkValidityExceptOtp()}
                            />
                        </View>
                        <View style={styles.wideButtonContainer}>
                            <Button title={showOtp? 'Go Back' : 'Go to Login'} color={Colors.darkgreen} onPress={goBackOrLoginHandler}/>
                        </View>

                </ScrollView>
            </Card>}

            {/* for login, use functions instead */}
            {!isSignup && <Card style={styles.authContainer}>
                <ScrollView>

                    <View>                  
                        <Input 
                            id='contact_num'
                            label='Contact Number'
                            keyboardType='phone-pad'
                            required
                            autoCapitalize="none"
                            minLength={11}
                            maxLength={11}
                            errorText="Please enter a valid phone number."
                            onInputChange={loginInputChangeHandler}
                            initialValue={loginFormState.inputValues['contact_num']}
                            initiallyValid={loginFormState.inputValidities['contact_num']}
                        />
                        <Input 
                            id='password'
                            label='Password'
                            keyboardType='default'
                            secureTextEntry={true}
                            required
                            autoCapitalize="none"
                            errorText="Please enter a valid password."
                            onInputChange={loginInputChangeHandler}
                            initialValue={loginFormState.inputValues['password']}
                            initiallyValid={loginFormState.inputValidities['password']}
                        />
                    </View>

                    <View style={styles.wideButtonContainer}>
                        <Button title="LOGIN" color={Colors.maroon} onPress={loginHandler}/>
                    </View>
                    <View style={styles.wideButtonContainer}>
                        <Button title="Go to Signup" color={Colors.darkgreen} onPress={() => setIsSignup(true)}/>
                    </View>

                </ScrollView>
            </Card>}
        </View>
    )
}

AuthScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Authentication'
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