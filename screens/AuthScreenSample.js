import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Button, StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator, Dimensions } from "react-native";
import {Picker} from '@react-native-picker/picker'
import Card from '../components/Card'
import InputSample from "../components/InputSample";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import Colors from '../constants/Colors'
import { useDispatch } from "react-redux";
import * as authActions from '../store/actions/auth'

import DataPrivacyModal from '../components/DataPrivacyModal';

const AuthScreenSample = props => {  
    const dispatch = useDispatch()
    const [isSignup, setIsSignup] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [showOtp, setShowOtp] = useState(false)
    const [visible, setVisible] = useState(false); //modal


    // start of signup code
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
        way_of_interview: true,
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

    // for contact time
    const [startShow, setStartShow] = useState(false);
    const [endShow, setEndShow] = useState(false);

    const showTimepicker = (field) => {
        if(field === 'start_time'){
            setStartShow(true)
        }
        else if(field === 'end_time'){
            setEndShow(true)
        }
    };

    const onTimeChange = (event, selectedTime, field) => {
        if(field === 'start_time'){
            setStartShow(Platform.OS === 'ios');
        }
        else if(field === 'end_time'){
            setEndShow(Platform.OS === 'ios');
        }

        setSignupFormTouch(form => {
            return {
                ...form,
                [field]: true
            }
        })

        setSignupForm(form => {
            return {
                ...form,
                [field]: moment(selectedTime).format("HH:mm")
            }
        })
    };

    // this handles the dependency on setState (password)
    useEffect(() => {
        formValidator(signupForm.password, 'password', 'signup')
        formValidator(signupForm.confirm_password, 'confirm_password', 'signup')
    }, [signupForm.password, signupForm.confirm_password])

    // this handles the dependency on setState (time)
    useEffect(() => {
        formValidator(signupForm.start_time, 'start_time', 'signup')
        formValidator(signupForm.end_time, 'end_time', 'signup')
    }, [signupForm.start_time, signupForm.end_time])

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
            formValidator(text, field, 'signup')
        }
    }

    const textCleanHandler = (text, field) => {
        if(field === 'contact_num' || field === 'otp'){
            return text.replace(/[^0-9]/g, "")
        }
        return text
    }

    const formValidator = (text, field, form) => {
        if(form === 'signup'){
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
            if(field === 'start_time' || field === 'end_time'){
                if(signupForm['start_time'] >= signupForm['end_time'] && signupFormTouch['start_time'] && signupFormTouch['end_time']){
                    setSignupFormError((form) => {
                        return {
                            ...form,
                            ['start_time']: 'Start time should be before the end time.',
                            ['end_time']: 'End time should be after the start time.'
                        }
                    })
                }
                else{
                    setSignupFormError((form) => {
                        return {
                            ...form,
                            ['start_time']: '',
                            ['end_time']: ''
                        }
                    })
                }
            }
            if(field === 'otp'){
                if(!/^[0-9]{6}$/.test(text)){
                    setSignupFormError((form) => {
                        return {
                            ...form,
                            [field]: 'OTP should be XXXXXX.'
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
        else if(form === 'login'){
            if(field === 'contact_num'){
                if(!/^(09)\d{9}$/.test(text)){
                    setLoginFormError((form) => {
                        return {
                            ...form,
                            [field]: 'Contact Number should be 09XXXXXXXXX.'
                        }
                    })
                }
                else{
                    setLoginFormError((form) => {
                        return {
                            ...form,
                            [field]: ''
                        }
                    })
                }
            }
            if(field === 'password'){
                if(!/([a-zA-Z0-9!@#$%^&*()_+\-=\[\]\\;:'",./?]{8,16})/g.test(text)){
                    setLoginFormError((form) => {
                        return {
                            ...form,
                            [field]: `Password should be 8 to 16 alphanumeric or special characters.`
                        }
                    })
                }
                else{
                    setLoginFormError((form) => {
                        return {
                            ...form,
                            [field]: ''
                        }
                    })
                }
            }
        }
    }

    const checkValidityExceptOtp = () => {
        let formIsValid = true
        for(const key in signupFormError){
            if(key !== 'otp'){
                formIsValid = formIsValid && signupFormError[key] === '' && signupFormTouch[key] === true
            }
        }
        return formIsValid
    }

    const requestOtp = async () => {
        setIsLoading(true)
        try{
            await dispatch(authActions.requestOtp(signupForm['contact_num']))
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

    const signupHandler = () => {
        if(!showOtp){
            requestOtp()
        }
        else{
            setVisible(true);
        }
    }

    const signupSubmit = async () => {
        setIsLoading(true)
        try{
            await dispatch(authActions.signup(signupForm))
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

    const goBackOrLoginHandler = () => {
        if(showOtp){
            setShowOtp(false)
        }
        else{
            setIsSignup(false)
        }
    }

    // end of signup code

    //start of login code
    const [loginForm, setLoginForm] = useState({
            contact_num: '',
            password: ''
    })

    const [loginFormTouch, setLoginFormTouch] = useState({
        contact_num: false,
        password: false,
    })

    const [loginFormError, setLoginFormError] = useState({
        contact_num: '',
        password: '',
    })

    const loginInputChangeHandler = (text, field) => {
        text = textCleanHandler(text, field)
        

        setLoginFormTouch(form => {
            return {
                ...form,
                [field]: true
            }
        })

        setLoginForm(form => {
            return {
                ...form,
                [field]: text
            }
        })

        formValidator(text, field, 'login')
    }

    const loginHandler = async () => {
        setIsLoading(true)
        try {
            await dispatch(authActions.login(loginForm.contact_num, loginForm.password))
            .then(() => {
                setIsLoading(false)
                props.navigation.navigate('Content')
            })
        }
        catch(err){
            Alert.alert("Error Occurred!", err.message, [{text: 'Okay!'}])
            setIsLoading(false)
            setVisible(false);
        }
    }

    const checkLoginValidity = () => {
        let formIsValid = true
        for(const key in loginFormError){
            if(key !== 'otp'){
                formIsValid = formIsValid && loginFormError[key] === '' && loginFormTouch[key] === true
            }
        }
        return formIsValid
    }



    return (
        <View style={styles.screen}>
           
           <DataPrivacyModal
                visible={visible}
                closeModal={() => setVisible(false)}
                onAgree={signupSubmit}
            />

           {isSignup && <Card style={styles.authContainer}>
                <ScrollView>
                    {showOtp && <InputSample 
                        field='otp'
                        label='OTP Number'
                        keyboardType='phone-pad'
                        autoCapitalize="none"
                        errorMessage={signupFormError['otp']}
                        onInputChange={signupInputChangeHandler}
                        value={signupForm['otp']}
                        touch={signupFormTouch['otp']}
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
                        <View style={styles.startAndEndTimeContainer}>
                            <Text style={styles.formControlHeader}>Preferred Contact Time:</Text>
                            <View style={styles.formGroup}>
                                <Text style={styles.formControlLabel}>Start Time:</Text>
                                <View style={styles.timeInput}>
                                    <Text style={styles.timeText}>{signupForm['start_time']? moment(signupForm['start_time'], 'HH:mm').format("hh:mm A"): ''}</Text>
                                    <View style={styles.setButtonContainer}>
                                        <Button onPress={() => showTimepicker('start_time')} title="Set" color={Colors.darkgreen}/>
                                    </View>
                                </View>
                                {signupFormError['start_time'] !== '' && signupFormTouch['start_time'] && signupFormTouch['end_time'] && (<View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{signupFormError['start_time']}</Text>
                                </View>)}
                            </View>
                            
                            {startShow && (
                                <DateTimePicker
                                testID="dateTimePickerStart"
                                value={new Date(1)}
                                mode="time"
                                is24Hour={false}
                                display="default"
                                onChange={(event, selectedTime) => onTimeChange(event, selectedTime, 'start_time')}
                                />
                            )}

                            <View style={styles.formGroup}>
                                <Text style={styles.formControlLabel}>End Time:</Text>
                                <View style={styles.timeInput}>
                                    <Text style={styles.timeText}>{signupForm['end_time']? moment(signupForm['end_time'], 'HH:mm').format("hh:mm A"): ''}</Text>
                                    <View style={styles.setButtonContainer}>
                                        <Button onPress={() => showTimepicker('end_time')} title="Set" color={Colors.darkgreen}/>
                                    </View>
                                </View>
                                {signupFormError['end_time'] !== '' && signupFormTouch['start_time'] && signupFormTouch['end_time'] && (<View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{signupFormError['end_time']}</Text>
                                </View>)}
                            </View>
                            
                            {endShow && (
                                <DateTimePicker
                                testID="dateTimePickerEnd"
                                value={new Date(1)}
                                mode="time"
                                is24Hour={false}
                                display="default"
                                onChange={(event, selectedTime) => onTimeChange(event, selectedTime, 'end_time')}
                            />)}
                        </View>

                        <View>                       
                            <View style={styles.formGroup}>
                                <Text style={styles.formControlHeader}>Preferred Way of Contact:</Text>
                                <Picker
                                    selectedValue={signupForm['way_of_interview']}
                                    style={{ height: 50, width: 200}}
                                    onValueChange={(itemValue, itemIndex) => signupInputChangeHandler(itemValue, 'way_of_interview')}
                                >
                                    <Picker.Item label="One at a time" value="One at a time" />
                                    <Picker.Item label="All at once" value="All at once" />
                                </Picker>
                            </View>
                        </View>
                        
                    </View>}

                    <View style={styles.wideButtonContainer}>
                        {isLoading ? 
                        <ActivityIndicator size='small' color={Colors.orange}/>
                        :
                        <Button 
                            title="SIGNUP"
                            color={Colors.maroon} 
                            onPress={signupHandler} 
                            disabled={!checkValidityExceptOtp()}
                        />
                        }
                    </View>
                    <View style={styles.wideButtonContainer}>
                        <Button title={showOtp? 'Go Back' : 'Go to Login'} color={Colors.darkgreen} onPress={goBackOrLoginHandler} disabled={isLoading}/>
                    </View>

                </ScrollView>
            </Card>}

            {!isSignup && <Card style={styles.authContainer}>
                <ScrollView>

                    <View>                  
                        <InputSample 
                            field='contact_num'
                            label='Contact Number'
                            keyboardType='phone-pad'
                            required
                            autoCapitalize="none"
                            errorMessage={loginFormError['contact_num']}
                            onInputChange={loginInputChangeHandler}
                            value={loginForm['contact_num']}
                            touch={loginFormTouch['contact_num']}
                        />
                        <InputSample 
                            field='password'
                            label='Password'
                            keyboardType='default'
                            secureTextEntry={true}
                            required
                            errorMessage={loginFormError['password']}
                            onInputChange={loginInputChangeHandler}
                            value={loginForm['password']}
                            touch={loginFormTouch['password']}
                        />
                    </View>

                    <View style={styles.wideButtonContainer}>
                        {isLoading ? 
                            <ActivityIndicator size='small' color={Colors.orange}/>
                            :
                            <Button title="LOGIN" color={Colors.maroon} onPress={loginHandler} disabled={!checkLoginValidity()}/>
                        }
                    </View>
                    <View style={styles.wideButtonContainer}>
                        <Button title="Go to Signup" color={Colors.darkgreen} onPress={() => setIsSignup(true)} disabled={isLoading}/>
                    </View>

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