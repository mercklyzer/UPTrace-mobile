import React, { useCallback, useReducer, useState } from "react";
import { Button, StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator, Dimensions, ActionSheetIOS, Pressable, TouchableOpacity } from "react-native";
import {Picker} from '@react-native-picker/picker'
import Card from '../components/Card'
import Input from "../components/Input";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import Colors from '../constants/Colors'
import * as authActions from '../store/actions/auth'
import { useDispatch, useSelector } from "react-redux";

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

const initialTime = new Date()
initialTime.setHours(0)
initialTime.setMinutes(0)

const AuthScreen = props => {   
    const dispatch = useDispatch()
    const [isSignup, setIsSignup] = useState(true)

    const [isLoading, setIsLoading] = useState(false)
    const [showOtp, setShowOtp] = useState(false)



    const [signupFormState, dispatchSignupFormState] = useReducer(signupFormReducer, {
        inputValues: {
            contact_num: '',
            password: '',
            confirm_password: '',
            role: 'ordinary',
            start_time: '00:00',
            end_time: '00:00',
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

    

    const signupInputChangeHandler = useCallback(
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
    const [unixStartTime, setUnixStartTime] = useState(initialTime)
    const [unixEndTime, setUnixEndTime] = useState(initialTime)

    const onStartTimeChange = (event, selectedDate) => {
        setUnixStartTime(selectedDate)       
        signupInputChangeHandler('start_time', moment(selectedDate).format("HH:mm"), true) 
    };

    const onEndTimeChange = (event, selectedDate) => {
        setUnixEndTime(selectedDate) 
        signupInputChangeHandler('end_time', moment(selectedDate).format("HH:mm"), true)
      };
    
    const requestOtp = async () => {
        setIsLoading(true)
        try{
            await dispatch(authActions.requestOtp(signupFormState.inputValues['contact_num']))
            .then((message) => {
                if(message === "You may now input the OTP."){
                    setShowOtp(true)
                }
                setIsLoading(false)
            })
        }
        catch(err){
            console.log(err.message);
            if(err.message === 'You can request again after 5 minutes.'){
                setShowOtp(true)
            }
            else{
                Alert.alert("Error Occurred!", err.message, [{text: 'Okay!'}])
            }
            setIsLoading(false)
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
        setIsLoading(true)
        try{
            await dispatch(authActions.signup(signupFormState.inputValues))
            .then(() => {
                setIsLoading(false)
                props.navigation.navigate('Content')
            })
        }
        catch(err){
            Alert.alert("Error Occurred!", err.message, [{text: 'Okay!'}])
            setIsLoading(false)
        }
    }

    const loginHandler = async () => {
        setIsLoading(true)
        try {
            await dispatch(authActions.login(loginFormState.inputValues.contact_num, loginFormState.inputValues.password))
            .then(() => {
                setIsLoading(false)
                props.navigation.navigate('Content')
            })
        }
        catch(err){
            Alert.alert("Error Occurred!", err.message, [{text: 'Okay!'}])
            setIsLoading(false)
        }
    }

    const signupHandler = () => {
        if(!showOtp){
            requestOtp()
        }
        else{
            signup()
        }
        console.log("set to false");
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

    const changeWayOfContact = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ["Cancel", "One at a time", "All at once"],
              cancelButtonIndex: 0,
              userInterfaceStyle: 'dark'
            },
            buttonIndex => {
              if (buttonIndex === 0) {
                // cancel action
              } else if (buttonIndex === 1) {
                  console.log("one at a time");
                signupInputChangeHandler('way_of_interview', 'One at a time', true)
              } else if (buttonIndex === 2) {
                  console.log("all at once");
                signupInputChangeHandler('way_of_interview', 'All at once', true)
              }
            }
          );
    }

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
                        onInputChange={signupInputChangeHandler}
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
                            forceErrorText=''
                            onInputChange={signupInputChangeHandler}
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
                            onInputChange={signupInputChangeHandler}
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
                            onInputChange={signupInputChangeHandler}
                            initialValue={signupFormState.inputValues['confirm_password']}
                            initiallyValid={signupFormState.inputValidities['confirm_password']}
                        />

                        <View style={styles.startAndEndTimeContainer}>
                            <Text style={styles.formControlHeader}>Preferred Contact Time:</Text>
                            <View style={styles.formGroup}>
                                <Text style={styles.formControlLabel}>Start Time:</Text>
                                <DateTimePicker
                                testID="dateTimePickerStart"
                                value={unixStartTime}
                                mode="time"
                                is24Hour={false}
                                display="default"
                                onChange={onStartTimeChange}
                                />
                                {!validTime && (<View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>Start time should be before the end time.</Text>
                                </View>)}
                            </View>                           
                                
                            

                            <View style={styles.formGroup}>
                                <Text style={styles.formControlLabel}>End Time:</Text>
                                <DateTimePicker
                                testID="dateTimePickerEnd"
                                value={unixEndTime}
                                mode="time"
                                is24Hour={false}
                                display="default"
                                onChange={onEndTimeChange}
                                />
                                {!validTime && (<View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>End time should be after the start time.</Text>
                                </View>)}
                            </View>
                            
                            
                            
                            </View>
                            <View>                       
                                <View style={styles.formGroup}>
                                    <Text style={styles.formControlHeader}>Preferred Way of Contact:</Text>
                                    <View style={styles.row}>
                                        <Text style={styles.text}>{signupFormState.inputValues['way_of_interview']}</Text>
                                        <TouchableOpacity style={styles.button} onPress={changeWayOfContact}>
                                            <Text style={styles.buttonText}>Change</Text>
                                        </TouchableOpacity>
                                        {/* <Button title='Change' onPress={changeWayOfContact}/> */}
                                    </View>
                                </View>
                            </View>
                        </View>}

                        <View style={
                            {
                                ...styles.wideButtonContainer,
                                opacity: showOtp? (!signupFormState.formIsValid? 0.5 : 1): (!checkValidityExceptOtp()? 0.5 : 1)
                        }}>
                            {isLoading ? 
                            <ActivityIndicator size='small' color={Colors.orange}/>
                            :
                            <TouchableOpacity 
                                style={{
                                    ...styles.wideButton, 
                                    backgroundColor: Colors.maroon, 
                                }} 
                                onPress={signupHandler}  
                                disabled={showOtp? !signupFormState.formIsValid : !checkValidityExceptOtp()}>
                                <Text style={styles.wideButtonText}>SIGNUP</Text>
                            </TouchableOpacity>
                            }
                        </View>
                        
                        <View style={
                            {
                                ...styles.wideButtonContainer,
                                opacity: isLoading? 0.5 : 1
                        }}>
                            <TouchableOpacity style={styles.wideButton} onPress={goBackOrLoginHandler} disabled={isLoading}>
                                <Text style={styles.wideButtonText}>{showOtp? 'Go Back' : 'GO TO LOGIN'}</Text>
                            </TouchableOpacity>

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
                            forceErrorText=''
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
                        {isLoading ? 
                            <ActivityIndicator size='small' color={Colors.orange}/>
                            :
                            
                            <View style={
                                {
                                    ...styles.wideButtonContainer,
                                    opacity: !loginFormState.formIsValid? 0.5 : 1
                            }}>
                                <Pressable style={{...styles.wideButton, backgroundColor: Colors.maroon}} onPress={loginHandler} disabled={!loginFormState.formIsValid}>
                                    <Text style={styles.wideButtonText}>LOGIN</Text>
                                </Pressable>
                            </View>
                            
                        }
                    </View>

                    <View style={
                        {
                            ...styles.wideButtonContainer,
                            opacity: isLoading? 0.5 : 1
                    }}>
                        <Pressable style={styles.wideButton} onPress={() => setIsSignup(true)} disabled={isLoading}>
                            <Text style={styles.wideButtonText}>GO TO SIGNUP</Text>
                        </Pressable>
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
        width: '90%',
        maxWidth: 400,
        height: '90%',
        maxHeight: 800,
        padding: 20
    },
    startAndEndTimeContainer: {
        // height: 100
    },
    formGroup: {
        // marginTop: 0
        // borderColor: 'black',
        // borderWidth: 2
    },  
    formControlHeader: {
        fontFamily: 'roboto-medium',
        color: Colors.darkgreen,
        marginVertical: Dimensions.get('window').height > 800? 8: 4,
        fontSize: Dimensions.get('window').width > 600? 22: 18,
        marginTop: Dimensions.get('window').height > 800? 20: 16,
    },
    formControlLabel: {
        fontFamily: 'roboto-regular',
        color: 'black',
        marginBottom: Dimensions.get('window').height > 800? 8: 4,
        fontSize: Dimensions.get('window').width > 600? 22: 18,
    },
    timeInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontFamily: 'roboto-italic',
        fontSize: Dimensions.get('window').width > 600? 22: 16,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 8,
        elevation: 3,
        backgroundColor: Colors.darkgreen,
    },
    wideButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: Colors.darkgreen,
    },
    wideButtonText: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'roboto-regular'
    },
    buttonText:{
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'roboto-regular'
    },
    setButtonContainer: {

    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
    },
    disabled: {
        opacity: 0.5
    }
})

export default AuthScreen