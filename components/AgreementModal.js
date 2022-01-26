import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Linking } from "react-native";
import disc from '@jsamr/counter-style/presets/disc';
import decimal from '@jsamr/counter-style/presets/decimal';
import MarkedList from '@jsamr/react-native-li';

import Modal from '../components/Modal';

const Strong = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

// Not working. Need to pass props to Modal properly. Functions for closeModal and onAgree are not getting passed
const AgreementModal = props => {
    return (
        <Modal
            header='Data Privacy Agreement'
            visible={props.agreementModalVisible}
            closeModal={props.closeModal}
            onAgree={props.onAgree}
            agreeText={props.agreeText}
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
    );
};

const styles = StyleSheet.create({
    agreement: {
        fontFamily: 'roboto-regular',
        fontSize: 16,
        marginBottom: 10
    },
    link: {
        color: '#525960',
        textDecorationLine: 'underline'
    }
})

export default AgreementModal;