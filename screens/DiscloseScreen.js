import React, { useState, useEffect } from "react";
import { StyleSheet, Text, ScrollView, RefreshControl, View, Image, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from '@expo/vector-icons';
import disc from '@jsamr/counter-style/presets/disc';
import decimal from '@jsamr/counter-style/presets/decimal';
import MarkedList from '@jsamr/react-native-li';

import DiscloseModal from "../components/DiscloseModal";
import Colors from "../constants/Colors";
import * as discloseActions from '../store/actions/disclose';
import CustomButton from "../components/CustomButton";
import Modal from "../components/Modal";

const DiscloseScreen = props => {
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [isUserPositive, setIsUserPositive] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [heading, setHeading] = useState(null);
    const [status, setStatus] = useState(null); // suspected, disclosed positive
    const [agreementModalVisible, setAgreementModalVisible] = useState(false); //modal
    
    const userData = useSelector(state => state.auth.user);
    const token = useSelector(state => state.auth.token);
    
    const Strong = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

    useEffect(() => {
        const focusListener = props.navigation.addListener('didFocus', () => {
            checkUserStatus();
        });

        return () => {
            focusListener.remove();
        };
    }, []);

    useEffect(() => {
        checkUserStatus();
    }, [isSubmitted]);

    const dispatch = useDispatch();

    const checkUserStatus = async () => {
        // console.log("checking status...");
        setIsCheckingStatus(true);
        try {
            await dispatch(discloseActions.checkIfUserIsNegative(userData.contact_num, token))
            .then((patientRecords) => {
                if(patientRecords.length > 0) {
                    setIsUserPositive(true);
                } else {
                    setIsUserPositive(false);
                }
                setIsCheckingStatus(false);
                // console.log("isUserPositive:", isUserPositive);
            })
        } catch(err) {
            console.log("error:", err);
            setIsCheckingStatus(false);
        }
    };

    const changeIsSubmitted = () => {
        setIsSubmitted(true);
    };

    const closeAgreementModal = () => {
        setAgreementModalVisible(false);
        console.log("clicked close button");
    };

    if(isCheckingStatus) {
        return (
            <View style={styles.screen}>
                <ActivityIndicator size='large' color={Colors.maroon} />
            </View>
        );
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={isCheckingStatus}
                    onRefresh={checkUserStatus}
                />
            }
        >
            <View style={styles.screen}>
                <View style={styles.logoContainer}>
                    <Image source={require('../assets/images/uptrace-logo.png')} style={styles.logo} />
                </View>
                <View style={styles.buttonContainer}>
                    <CustomButton
                        heading="I suspect to be positive"
                        headingFontSize={18}
                        buttonColor={Colors.maroon}
                        isDisabled={isUserPositive}
                        onPressHandler={() => {
                            setVisible(true);
                            setHeading("I suspect to be positive")
                            setStatus("suspected");
                        }}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <CustomButton
                        heading="I tested positive"
                        headingFontSize={18}
                        buttonColor={Colors.maroon}
                        isDisabled={isUserPositive}
                        onPressHandler={() => {
                            setVisible(true);
                            setHeading("I tested positive")
                            setStatus("disclosed positive");
                        }}
                    />
                </View>
                <View style={styles.smallTextContainer}>
                    <Text style={styles.smallText, { textAlign: 'center' }}>The buttons above will only be enabled once a contact tracer has confirmed that you are negative for COVID-19.</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.contentHeading}>UPTrace</Text>
                    <Text style={styles.contentText}>
                        <Strong>UPTrace</Strong> is a contact tracing application that uses <Strong>QR codes</Strong>. It aims to be easy to use, accurate, accessible and available to the majority, effective, and to address issues on security and privacy.{'\n\n'}
                        UPTrace is compliant with the Philippine Data Privacy Act of 2012 as explained in this <Text 
                            style={styles.link}
                            onPress={() => setAgreementModalVisible(true)}
                            >
                                Data Privacy Statement
                            </Text>.
                    </Text>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={{...styles.contentHeading, ...styles.greenText}}>How it works</Text>
                    <Ionicons
                        name='qr-code'
                        size={120}
                        color={Colors.darkgreen}
                        style={styles.icon}
                    />
                    <Text style={styles.contentSubheading}>1. Scan</Text>
                    <Text style={styles.contentText}>Scan QR codes posted in every entrance and room that you enter.</Text>
                    <Ionicons
                        name='alert-circle'
                        size={120}
                        color={Colors.darkgreen}
                        style={styles.icon}
                    />
                    <Text style={styles.contentSubheading}>2. Report</Text>
                    <Text style={styles.contentText}>If you suspect yourself to be positive or if you tested positive, report your condition immediately.</Text>
                    <Ionicons
                        name='call'
                        size={120}
                        color={Colors.darkgreen}
                        style={styles.icon}
                    />
                    <Text style={styles.contentSubheading}>3. Trace </Text>
                    <Text style={styles.contentText}>If you have reported yourself to be a suspect or positive case, you will be contacted by a UPHS Contact Tracer. Possible close contacts based on your scanning history will also be contacted.</Text>
                </View>
                <DiscloseModal
                    visible={visible}
                    heading={heading}
                    status={status}
                    userData={userData}
                    token={token}
                    changeIsSubmitted={changeIsSubmitted}
                    closeModal={() => setVisible(false)}
                />
                <Modal
                    header='Data Privacy Agreement'
                    visible={agreementModalVisible}
                    closeModal={() => setAgreementModalVisible(false)}
                    onAgree={() => setAgreementModalVisible(false)}
                    agreeText='Okay'
                >
                    <Text style={styles.agreement}>
                        UPTrace is a contact tracing application for a thesis made in partial fulfillment of CS 198/199 in the University of the Philippines Diliman (UPD). UPTrace shall not disclose the personal information of users without their consent and shall only use this data for the purposes of the thesis. These are strictly implemented in compliance with the Philippine <Text style={styles.link} onPress={() => Linking.openURL('https://www.officialgazette.gov.ph/2012/08/15/republic-act-no-10173/')}>Data Privacy Act of 2012</Text> to protect your right to data privacy.{'\n\n'}
                        <Strong>What information we collect and why we collect it</Strong>{'\n'}
                        <Text>UPTrace collects the following personal information upon registration, with the corresponding purpose:</Text>                    
                    </Text>
                    <View style={styles.list}>
                        <MarkedList counterRenderer={disc}>
                            <Text style={{...styles.listItem, ...styles.agreement}}><Strong>Phone number</Strong> - to prevent fraud through a one-time PIN sent through SMS, and so that a user can be contacted if needed for contact tracing</Text>
                            <Text style={{...styles.listItem, ...styles.agreement}}><Strong>Password (encrypted)</Strong> - to secure your account</Text>
                            <Text style={{...styles.listItem, ...styles.agreement}}><Strong>Email address (only for Health Liaison Officers [HeLOs] and UP Health Service [UPHS] Contact Tracers)</Strong> - to identify a HeLO or a UPHS Contact Tracer and give them additional privileges in the application</Text>
                            <Text style={{...styles.listItem, ...styles.agreement}}><Strong>Preferred contact time</Strong> - to inform UPHS Contact Tracers of the start time and end time that you prefer to be contacted for monitoring and contact tracing </Text>
                            <Text style={{...styles.listItem, ...styles.agreement}}><Strong>Preferred way of interview</Strong> - to inform UPHS Contact Tracers of the way you prefer to be asked questions or to be interviewed for monitoring and contact tracing </Text>
                        </MarkedList>
                    </View>
                    <Text style={styles.agreement}>
                        Information about QR code scans are also collected, and this includes the user who scanned, the building and room visited, and the date and time of visit.{'\n\n'}
                        <Strong>How we collect, use, share, and retain your data</Strong>                 
                    </Text>
                    <View style={styles.list}>
                        <MarkedList counterRenderer={decimal}>
                            <Text style={{...styles.listItem, ...styles.agreement}}>When signing up in UPTrace, we collect information enumerated in the “What information we collect” section.</Text>
                            <Text style={{...styles.listItem, ...styles.agreement}}>After successfully signing up, you may now scan QR codes in every entrance and exit points of establishments, as well as in every room you enter there. We save your scan logs in a server and these may be used for contact tracing purposes if necessary. These data are used to identify possible close contacts and to identify establishments that require thorough disinfection.</Text>
                            <Text style={{...styles.listItem, ...styles.agreement}}>If you suspect yourself to be positive of COVID-19 or if you tested positive, you may report it in the app and you will be prompted to indicate whether you have symptoms or not. If you do have symptoms, you will also be asked when your symptoms started. These information will then be disclosed to UPHS contact tracers so that they may assist you and perform contact tracing.</Text>
                        </MarkedList>
                    </View>
                    <Text style={styles.agreement}>
                        Your data would only be retained and used for the purpose of testing the contact tracing app. It can only be accessed by the developers of UPTrace and by UPHS Contact Tracers. Technical measures are implemented to secure your data.{'\n\n'}
                        By clicking "I agree," you have carefully read, understood, and agreed to the said conditions, and you express your consent for UPTrace to process the personal data that you may submit without precluding your rights under the Data Privacy Act of 2012. As provided by law, you may request to access, correct, erase, or block provided information in this form on reasonable grounds.{'\n\n'}
                        For inquiries, suggestions, or any other concerns regarding our privacy practices, please contact us at lbbautista6@up.edu.ph and cyceloso1@up.edu.ph. Thank you!
                    </Text>
                </Modal>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flexGrow: 1,
        alignItems: 'center',
        marginVertical: 30
    },
    logoContainer: {
        width: 200,
        height: 60,
        marginBottom: 30
    },
    logo: {
        flex: 1,
        width: undefined,
        height: undefined
    },
    buttonContainer: {
        marginBottom: 15
    },
    smallTextContainer: {
        marginHorizontal: 30,
        justifyContent: 'center',
    },
    smallText: {
        fontFamily: 'roboto-regular',
        fontSize: 14,
        color: '#525960'
    },
    contentContainer: {
        alignItems: 'center',
        marginHorizontal: 30,
        marginTop: 30,
    },
    contentHeading: {
        fontFamily: 'roboto-bold',
        fontSize: 24,
        color: Colors.maroon,
    },
    contentSubheading: {
        fontFamily: 'roboto-bold',
        fontSize: 20,
        color: Colors.darkgreen,
    },
    contentText: {
        fontFamily: 'roboto-regular',
        fontSize: 16,
        textAlign: 'center'
    },
    link: {
        color: '#525960',
        textDecorationLine: 'underline'
    },
    greenText: {
        color: Colors.darkgreen
    },
    icon: {
        marginTop: 10
    },
    agreement: {
        fontFamily: 'roboto-regular',
        fontSize: 16,
        marginBottom: 10
    },
    list: {
        flexGrow: 1
    },
    listItem: {
        flexShrink: 1
    }
})

export default DiscloseScreen