import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Button, StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator, Dimensions } from "react-native";
import {Picker} from '@react-native-picker/picker'
import Card from '../components/Card'
import InputSample from "../components/InputSample";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import Colors from '../constants/Colors'
import * as authActions from '../store/actions/auth'
import { useDispatch, useSelector } from "react-redux";
import DataPrivacyModal from '../components/DataPrivacyModal';



const AuthScreenSample = props => {   
    const [isSignup, setIsSignup] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [showOtp, setShowOtp] = useState(false)
    const [visible, setVisible] = useState(false); //modal

    const [signupForm, setSignupForm] = useState({
        contact_num: '',
        password: '',
        confirm_password: '',
        role: 'ordinary',
        start_time: '',
        end_time: '',
        way_of_interview: 'One at a time',
        otp: ''
    })

    const [signupFormTouch, setSignupFormTouch] = useState({
        contact_num: false,
        password: false,
        confirm_password: false,
        start_time: false,
        end_time: false,
        way_of_interview: false,
        otp: false
    })

    const [signupFormError, setSignupFormError] = useState({
        contact_num: '',
        password: '',
        confirm_password: '',
        start_time: '',
        end_time: '',
        way_of_interview: '',
        otp: ''
    })

    // this handles the dependency on setState
    useEffect(() => {
        formValidator(signupForm.password, 'password')
        formValidator(signupForm.confirm_password, 'confirm_password')
    }, [signupForm.password, signupForm.confirm_password])

    const signupInputChangeHandler = (text, field) => {
        text = textCleanHandler(text, field)

        setSignupFormTouch(form => {
            return {
                ...form,
                [field]: true
            }
        })

        setSignupForm(form => {
            return {
                ...form,
                [field]: text
            }
        })

        // password and confirm password are handled using useEffect since they have dependency on setState
        if(field !== 'password' && field != 'confirm_password'){
            formValidator(text, field)
        }
    }

    const textCleanHandler = (text, field) => {
        if(field === 'contact_num'){
            return text.replace(/[^0-9]/g, "")
        }
        return text
    }

    const formValidator = (text, field) => {
        if(field === 'contact_num'){
            if(!/^(09)\d{9}$/.test(text)){
                setSignupFormError((form) => {
                    return {
                        ...form,
                        [field]: 'Contact Number should be 09XXXXXXXXX.'
                    }
                })
            }
            else{
                setSignupFormError((form) => {
                    return {
                        ...form,
                        [field]: ''
                    }
                })
            }
        }
        if(field === 'password' || field === 'confirm_password'){
            if(!/([a-zA-Z0-9!@#$%^&*()_+\-=\[\]\\;:'",./?]{8,16})/g.test(text)){
                setSignupFormError((form) => {
                    return {
                        ...form,
                        [field]: `Password should be 8 to 16 alphanumeric or special characters.`
                    }
                })
            }
            else if(signupForm['password'] !== signupForm['confirm_password']){
                setSignupFormError((form) => {
                    return {
                        ...form,
                        ['password']: 'Passwords do not match.',
                        ['confirm_password']: 'Passwords do not match.'
                    }
                })
            }
            else{
                setSignupFormError((form) => {
                    return {
                        ...form,
                        [field]: ''
                    }
                })
            }
        }
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
                    
                    {!showOtp && 
                    <View>                  
                        <InputSample 
                            field='contact_num'
                            label='Contact Number'
                            keyboardType='phone-pad'
                            required
                            autoCapitalize="none"
                            errorMessage={signupFormError['contact_num']}
                            onInputChange={signupInputChangeHandler}
                            value={signupForm['contact_num']}
                            touch={signupFormTouch['contact_num']}
                        />
                        <InputSample 
                            field='password'
                            label='Password'
                            keyboardType='default'
                            secureTextEntry={true}
                            required
                            errorMessage={signupFormError['password']}
                            onInputChange={signupInputChangeHandler}
                            value={signupForm['password']}
                            touch={signupFormTouch['password']}
                        />
                        <InputSample 
                            field='confirm_password'
                            label='Confirm Password'
                            keyboardType='default'
                            secureTextEntry={true}
                            required
                            errorMessage={signupFormError['confirm_password']}
                            onInputChange={signupInputChangeHandler}
                            value={signupForm['confirm_password']}
                            touch={signupFormTouch['confirm_password']}
                        />
                    </View>}

                    {/* <View style={styles.wideButtonContainer}>
                        {isLoading ? 
                        <ActivityIndicator size='small' color={Colors.orange}/>
                        :
                        <Button 
                            title="SIGNUP"
                            color={Colors.maroon} onPress={signupHandler} 
                            disabled={showOtp? !signupFormState.formIsValid : !checkValidityExceptOtp()}
                        />
                        }
                    </View>
                    <View style={styles.wideButtonContainer}>
                        <Button title={showOtp? 'Go Back' : 'Go to Login'} color={Colors.darkgreen} onPress={goBackOrLoginHandler} disabled={isLoading}/>
                    </View> */}

                </ScrollView>
            </Card>}
        </View>
    )
}

AuthScreenSample.navigationOptions = navData => {
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
        // borderColor: 'red',
        // borderWidth: 2
    },
    timeText: {
        fontFamily: 'roboto-italic',
        fontSize: Dimensions.get('window').width > 600? 22: 16,
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

export default AuthScreenSample