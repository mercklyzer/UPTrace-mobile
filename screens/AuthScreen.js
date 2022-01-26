import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator, Dimensions, ActionSheetIOS, Pressable, TouchableOpacity, Platform, Image, Linking } from "react-native";
import {Picker} from '@react-native-picker/picker'
import Card from '../components/Card'
import Input from "../components/Input";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import Colors from '../constants/Colors'
import { useDispatch } from "react-redux";
import * as authActions from '../store/actions/auth'
import disc from '@jsamr/counter-style/presets/disc';
import decimal from '@jsamr/counter-style/presets/decimal';
import MarkedList from '@jsamr/react-native-li';

import Modal from '../components/Modal';
import { Ionicons } from '@expo/vector-icons';

const AuthScreen = props => {  
    const dispatch = useDispatch()
    const [isSignup, setIsSignup] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [showOtp, setShowOtp] = useState(false)
    const [otpExpiresIn, setOtpExpiresIn] = useState(0)
    const [otpTimeLeft, setOtpTimeLeft] = useState(-1)
    const [agreementModalVisible, setAgreementModalVisible] = useState(false); //modal
    const [contactModalVisible, setContactModalVisible] = useState(false); //modal
    const [interviewModalVisible, setInterviewModalVisible] = useState(false); //modal
    const Strong = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

    // start of signup code
    const [signupForm, setSignupForm] = useState({
        contact_num: '',
        password: '',
        confirm_password: '',
        role: 'ordinary',
        start_time: Platform.OS === 'android'? '':'00:00',
        end_time: Platform.OS === 'android'? '':'00:00',
        way_of_interview: 'One at a time',
        otp: ''
    })

    const [signupFormTouch, setSignupFormTouch] = useState({
        contact_num: false,
        password: false,
        confirm_password: false,
        start_time: Platform.OS === 'ios'? true: false,
        end_time: Platform.OS === 'ios'? true: false,
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
    const [startShow, setStartShow] = useState(Platform.OS === 'ios'? true : false);
    const [endShow, setEndShow] = useState(Platform.OS === 'ios'? true : false);

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
            if(Platform.OS === 'ios'){
                setUnixStartTime(selectedTime)       
            }
        }
        else if(field === 'end_time'){
            setEndShow(Platform.OS === 'ios');
            if(Platform.OS === 'ios'){
                setUnixEndTime(selectedTime)       
            }
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

    // for ios
    const initialTime = new Date()
    initialTime.setHours(0)
    initialTime.setMinutes(0)
    const [unixStartTime, setUnixStartTime] = useState(initialTime)
    const [unixEndTime, setUnixEndTime] = useState(initialTime)

    const changeWayOfContactIOS = () => {
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
                signupInputChangeHandler('Once at a time', 'way_of_interview')
              } else if (buttonIndex === 2) {
                signupInputChangeHandler('All at once', 'way_of_interview')
              }
            }
          );
    }

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

    const checkSignupValidity = (restriction) => {
        let formIsValid = true
        for(const key in signupFormError){
            if(key !== restriction){
                formIsValid = formIsValid && signupFormError[key] === '' && signupFormTouch[key] === true
            }
        }
        return formIsValid
    }

    const requestOtp = async () => {
        setIsLoading(true)
        try{
            await dispatch(authActions.requestOtp(signupForm['contact_num']))
            .then((response) => {
                if(response.message === "You may now input the OTP."){
                    setShowOtp(true)
                    setOtpExpiresIn(response.expiresIn)
                }
                setIsLoading(false)
            })
        }
        catch(err){
            console.log(err.message);
            if(err.message.message === 'You can request again after 5 minutes.'){
                setShowOtp(true)
                console.log(err.message.expiresIn);
                setOtpExpiresIn(err.message.expiresIn)
            }
            else{
                Alert.alert("Error Occurred!", err.message.message, [{text: 'Okay!'}])
            }
            setIsLoading(false)
        }
    }

    useEffect(() => {
        console.log("called");
        if(otpExpiresIn !== 0) {
            let countdownInterval = setInterval(() => {
                let timeNow = moment().unix()
                console.log(otpExpiresIn - timeNow);
                setOtpTimeLeft(otpExpiresIn - timeNow)
                if(otpExpiresIn - timeNow <= 0){
                    clearInterval(countdownInterval)
                    return
                }
                
                console.log("counting down");
            }, 1000)
    
            return (() => {
                clearInterval(countdownInterval)
            })
        }
    }, [otpExpiresIn])

    const signupHandler = () => {
        if(!showOtp){
            requestOtp()
        }
        else{
            setAgreementModalVisible(true);
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
            setAgreementModalVisible(false);
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
           
           <Modal
                header='Data Privacy Agreement'
                visible={agreementModalVisible}
                closeModal={() => setAgreementModalVisible(false)}
                onAgree={signupSubmit}
                agreeText='I agree'
            >
                <Text style={styles.agreement}>
                    UPTrace is a contact tracing application for a thesis made in partial fulfillment of CS 198/199 in the University of the Philippines Diliman (UPD). UPTrace shall not disclose the personal information of users without their consent and shall only use this data for the purposes of the thesis. These are strictly implemented in compliance with the Philippine <Text style={styles.link} onPress={() => Linking.openURL('https://www.officialgazette.gov.ph/2012/08/15/republic-act-no-10173/')}>Data Privacy Act of 2012</Text> to protect your right to data privacy.{'\n\n'}
                    <Strong>What information we collect and why we collect it</Strong>{'\n'}
                    <Text>UPTrace collects the following personal information upon registration, with the corresponding purpose:</Text>                    
                </Text>
                <View style={{ flexGrow: 1 }}>
                    <MarkedList counterRenderer={disc}>
                        <Text style={{ flexShrink: 1 }, styles.agreement}><Strong>Phone number</Strong> - to prevent fraud through a one-time PIN sent through SMS, and so that a user can be contacted if needed for contact tracing</Text>
                        <Text style={{ flexShrink: 1 }, styles.agreement}><Strong>Password (encrypted)</Strong> - to secure your account</Text>
                        <Text style={{ flexShrink: 1 }, styles.agreement}><Strong>Email address (only for Health Liaison Officers [HeLOs] and UP Health Service [UPHS] Contact Tracers)</Strong> - to identify a HeLO or a UPHS Contact Tracer and give them additional privileges in the application</Text>
                        <Text style={{ flexShrink: 1 }, styles.agreement}><Strong>Preferred contact time</Strong> - to inform UPHS Contact Tracers of the start time and end time that you prefer to be contacted for monitoring and contact tracing </Text>
                        <Text style={{ flexShrink: 1 }, styles.agreement}><Strong>Preferred way of interview</Strong> - to inform UPHS Contact Tracers of the way you prefer to be asked questions or to be interviewed for monitoring and contact tracing </Text>
                    </MarkedList>
                </View>
                <Text style={styles.agreement}>
                    Information about QR code scans are also collected, and this includes the user who scanned, the building and room visited, and the date and time of visit.{'\n\n'}
                    <Strong>How we collect, use, share, and retain your data</Strong>                 
                </Text>
                <View style={{ flexGrow: 1 }}>
                    <MarkedList counterRenderer={decimal}>
                        <Text style={{ flexShrink: 1 }, styles.agreement}>When signing up in UPTrace, we collect information enumerated in the “What information we collect” section.</Text>
                        <Text style={{ flexShrink: 1 }, styles.agreement}>After successfully signing up, you may now scan QR codes in every entrance and exit points of establishments, as well as in every room you enter there. We save your scan logs in a server and these may be used for contact tracing purposes if necessary. These data are used to identify possible close contacts and to identify establishments that require thorough disinfection.</Text>
                        <Text style={{ flexShrink: 1 }, styles.agreement}>If you suspect yourself to be positive of COVID-19 or if you tested positive, you may report it in the app and you will be prompted to indicate whether you have symptoms or not. If you do have symptoms, you will also be asked when your symptoms started. These information will then be disclosed to UPHS contact tracers so that they may assist you and perform contact tracing.</Text>
                    </MarkedList>
                </View>
                <Text style={styles.agreement}>
                    Your data would only be retained and used for the purpose of testing the contact tracing app. It can only be accessed by the developers of UPTrace and by UPHS Contact Tracers. Technical measures are implemented to secure your data.{'\n\n'}
                    By clicking "I agree," you have carefully read, understood, and agreed to the said conditions, and you express your consent for UPTrace to process the personal data that you may submit without precluding your rights under the Data Privacy Act of 2012. As provided by law, you may request to access, correct, erase, or block provided information in this form on reasonable grounds.{'\n\n'}
                    For inquiries, suggestions, or any other concerns regarding our privacy practices, please contact us at lbbautista6@up.edu.ph and cyceloso1@up.edu.ph. Thank you!
                </Text>
            </Modal>

           <Modal
                header='Preferred Contact Time'
                visible={contactModalVisible}
                closeModal={() => setContactModalVisible(false)}
                onAgree={() => {setContactModalVisible(prev => !prev)}}
                agreeText='Okay'
            >
                <Text style={styles.agreement}>{`Preferred Contact Time is composed of 2 fields: Start Time and End Time. This asks which time of the day do you usually prefer to be contacted by the UPHS Contact Tracers only when necessary.`}</Text>
            </Modal>

            <Modal
                header='Preferred Way of Interview'
                visible={interviewModalVisible}
                closeModal={() => setInterviewModalVisible(false)}
                onAgree={() => {setInterviewModalVisible(prev => !prev)}}
                agreeText='Okay'
            >
                <Text style={styles.agreement}>{`Preferred Way of Interview asks in which way do you prefer to be asked questions by a UPHS Contact Tracer about your condition. You may either choose one at a time or all at once.`}</Text>
                <Text style={styles.agreement}><Strong>One at a time</Strong> - A new question will only be asked once you have answered the previous question. A sample conversation between you and a contact tracer looks like this:</Text>
                <Image source={require('../assets/images/one-at-a-time.png')} style={styles.sampleConvo} />
                <Text style={styles.agreement}><Strong>All at once</Strong> - Questions will be compiled in a single message. A sample conversation between you and a contact tracer looks like this:</Text>
                <Image source={require('../assets/images/all-at-once.png')} style={styles.sampleConvo} />
            </Modal>

           {isSignup && <Card style={styles.authContainer}>
                <ScrollView>
                    {showOtp && <>
                    <Input 
                        field='otp'
                        label='OTP Number'
                        keyboardType='phone-pad'
                        autoCapitalize="none"
                        errorMessage={signupFormError['otp']}
                        onInputChange={signupInputChangeHandler}
                        value={signupForm['otp']}
                        touch={signupFormTouch['otp']}
                        />

                    {otpTimeLeft > 0  && <Text>{`Your OTP expires in ${otpTimeLeft}s.`}</Text>}
                    {otpTimeLeft === 0 && <Text style={styles.resendOtp} onPress={requestOtp}>Resend OTP</Text>}
                    </>
                        }
                    
                    {!showOtp && 
                    <View>
                        <View style={styles.spaceBetween}>
                            <Text style={styles.formControlHeader}>Show Data Privacy Agreement</Text>
                            <Ionicons
                                name='help-circle'
                                size={27}
                                color="black"
                                onPress={() => setAgreementModalVisible(true)}
                            />
                        </View>               
                        <Input 
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
                        <Input 
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
                        <Input 
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
                            <View style={styles.spaceBetween}>
                                <Text style={styles.formControlHeader}>Preferred Contact Time:</Text>
                                <Ionicons
                                    name='help-circle'
                                    size={27}
                                    color="black"
                                    onPress={() => setContactModalVisible((prev) => !prev)}
                                />
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.formControlLabel}>Start Time:</Text>
                                {Platform.OS === 'android' && <View style={styles.timeInput}>
                                    <Text style={styles.text}>{signupForm['start_time']? moment(signupForm['start_time'], 'HH:mm').format("hh:mm A"): ''}</Text>
                                    <View style={styles.setButtonContainer}>
                                        <Button onPress={() => showTimepicker('start_time')} title="Set" color={Colors.darkgreen}/>
                                    </View>
                                </View>}
                                {signupFormError['start_time'] !== '' && signupFormTouch['start_time'] && signupFormTouch['end_time'] && (<View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{signupFormError['start_time']}</Text>
                                </View>)}
                            </View>
                            
                            {startShow && (
                                <DateTimePicker
                                testID="dateTimePickerStart"
                                value={Platform.OS === 'android'? new Date(1) : unixStartTime}
                                mode="time"
                                is24Hour={false}
                                display="default"
                                onChange={(event, selectedTime) => onTimeChange(event, selectedTime, 'start_time')}
                                />
                            )}

                            <View style={styles.formGroup}>
                                <Text style={styles.formControlLabel}>End Time:</Text>
                                {Platform.OS === 'android' && <View style={styles.timeInput}>
                                    <Text style={styles.text}>{signupForm['end_time']? moment(signupForm['end_time'], 'HH:mm').format("hh:mm A"): ''}</Text>
                                    <View style={styles.setButtonContainer}>
                                        <Button onPress={() => showTimepicker('end_time')} title="Set" color={Colors.darkgreen}/>
                                    </View>
                                </View>}
                                {signupFormError['end_time'] !== '' && signupFormTouch['start_time'] && signupFormTouch['end_time'] && (<View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{signupFormError['end_time']}</Text>
                                </View>)}
                            </View>
                            
                            {endShow && (
                                <DateTimePicker
                                testID="dateTimePickerEnd"
                                value={Platform.OS === 'android'? new Date(1) : unixEndTime}
                                mode="time"
                                is24Hour={false}
                                display="default"
                                onChange={(event, selectedTime) => onTimeChange(event, selectedTime, 'end_time')}
                            />)}
                        </View>

                        <View style={styles.wayOfInterviewContainer}>                       
                            <View style={styles.formGroup}>
                                <View style={styles.spaceBetween}>
                                    <Text style={styles.formControlHeader}>Preferred Way of Interview:</Text>
                                    <Ionicons
                                        name='help-circle'
                                        size={27}
                                        color="black"
                                        onPress={() => setInterviewModalVisible((prev) => !prev)}
                                    />
                                </View>
                                {Platform.OS === 'android' ? <Picker
                                    selectedValue={signupForm['way_of_interview']}
                                    style={{ height: 50, width: 200}}
                                    onValueChange={(itemValue, itemIndex) => signupInputChangeHandler(itemValue, 'way_of_interview')}
                                >
                                    <Picker.Item label="One at a time" value="One at a time" />
                                    <Picker.Item label="All at once" value="All at once" />
                                </Picker> :
                                <View style={styles.row}>
                                    <Text style={styles.text}>{signupForm['way_of_interview']}</Text>
                                    <TouchableOpacity style={styles.button} onPress={changeWayOfContactIOS}>
                                        <Text style={styles.buttonText}>Change</Text>
                                    </TouchableOpacity>
                                </View>
                                }
                            </View>
                        </View>
                        
                    </View>}

                    <View style={{
                        ...styles.wideButtonContainer,
                        opacity: Platform.OS === 'ios' && (showOtp? !checkSignupValidity() : !checkSignupValidity('otp'))? 0.5 : 1
                    }}>
                        {isLoading ? 
                        <ActivityIndicator size='small' color={Colors.orange}/>
                        :
                        (Platform.OS === 'android'? <Button 
                            title="SIGNUP"
                            color={Colors.maroon} 
                            onPress={signupHandler} 
                            disabled={showOtp? !checkSignupValidity() : !checkSignupValidity('otp')}
                        /> :
                        <TouchableOpacity 
                            style={{
                                ...styles.wideButton, 
                                backgroundColor: Colors.maroon, 
                            }} 
                            onPress={signupHandler}  
                            disabled={!checkSignupValidity('otp')}>
                            <Text style={styles.wideButtonText}>SIGNUP</Text>
                        </TouchableOpacity>)
                        }
                    </View>
                    <View style={{
                        ...styles.wideButtonContainer,
                        opacity: isLoading? 0.5 : 1
                    }}>
                        {Platform.OS === 'android'? <Button title={showOtp? 'Go Back' : 'Go to Login'} color={Colors.darkgreen} onPress={goBackOrLoginHandler} disabled={isLoading}/>
                        : 
                        <TouchableOpacity style={styles.wideButton} onPress={goBackOrLoginHandler} disabled={isLoading}>
                            <Text style={styles.wideButtonText}>{showOtp? 'Go Back' : 'GO TO LOGIN'}</Text>
                        </TouchableOpacity>}
                    </View>

                </ScrollView>
            </Card>}

            {!isSignup && <Card style={styles.authContainer}>
                <ScrollView>

                    <View>                  
                        <Input 
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
                        <Input 
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
                            Platform.OS === 'android' ? <Button title="LOGIN" color={Colors.maroon} onPress={loginHandler} disabled={!checkLoginValidity()}/>
                            :   <View style={
                                {
                                    ...styles.wideButtonContainer,
                                    opacity: !checkLoginValidity()? 0.5 : 1
                                }}>
                                <Pressable style={{...styles.wideButton, backgroundColor: Colors.maroon}} onPress={loginHandler} disabled={!checkLoginValidity()}>
                                    <Text style={styles.wideButtonText}>LOGIN</Text>
                                </Pressable>
                            </View>
                            
                        }
                    </View>
                    <View tyle={
                        {
                            ...styles.wideButtonContainer,
                            opacity: isLoading? 0.5 : 1
                        }}>
                        {Platform.OS === 'android' ? <Button title="Go to Signup" color={Colors.darkgreen} onPress={() => setIsSignup(true)} disabled={isLoading}/>
                        : <Pressable style={styles.wideButton} onPress={() => setIsSignup(true)} disabled={isLoading}>
                            <Text style={{
                                ...styles.wideButtonText,
                                opacity: isLoading? 0.5 : 1
                            }}>GO TO SIGNUP</Text>
                        </Pressable>}
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
    wayOfInterviewContainer: {
        marginTop: Dimensions.get('window').height > 800? 20: 16
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
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
        marginTop: 4,
        marginBottom: 12
    },
    buttonText:{
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'roboto-regular'
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
    agreement: {
        fontFamily: 'roboto-regular',
        fontSize: 16,
        marginBottom: 10
    },
    resendOtp:{
        fontFamily: 'roboto-regular',
        color: '#3b9aff',
        textAlign: 'right'
    },
    sampleConvo: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        resizeMode:'contain',
        borderWidth: 1,
        borderColor: '#DFE2E7',
        marginBottom: Dimensions.get('window').height > 800? 12: 8,
    },
    link: {
        color: '#525960',
        textDecorationLine: 'underline'
    }
})

export default AuthScreen