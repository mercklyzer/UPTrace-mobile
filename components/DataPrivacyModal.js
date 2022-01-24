import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Modal, StyleSheet, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from "react-redux";
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
import CustomButton from './CustomButton';

const DataPrivacyModal = props => {
    const [showModal, setShowModal] = useState(props.visible);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isWaitingResponse, setIsWaitingResponse] = useState(false);

    const dispatch = useDispatch();

    const toggleModal = () => {
        if(props.visible) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    };

    const resetModal = () => {
        setIsSubmitted(false);
    };

    useEffect(() => {
        toggleModal();
    }, [props.visible]);

    useEffect(() => {
        resetModal();
    }, [props.visible]);

    return (
        <View>
            <Modal
                transparent
                visible={showModal}
                animationType="fade"
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.header}>
                            <Text style={styles.heading}>Data Privacy Agreement</Text>
                            <View>
                                <TouchableOpacity onPress={props.closeModal}>
                                    <Ionicons
                                        name={Platform.OS === 'android' ? 'md-close-outline' : 'ios-close-outline'}
                                        size={27}
                                        color="black"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView style={styles.form}>
                            <Text style={styles.agreement}>{`UPTrace shall not disclose the personal information of users without their consent and shall only use this data for contact tracing. These are strictly implemented in compliance with the Philippine Data Privacy Act of 2012 to protect your right to data privacy. As provided by law, you may request to access, correct, erase, or block provided information in this form on reasonable grounds.\n\nBy clicking "I agree," you have carefully read, understood, and agreed to the said conditions, and you express your consent for UPTrace to process the personal data that you may submit without precluding your rights under the Data Privacy Act of 2012. As provided by law, you may request to access, correct, erase, or block provided information in this form on reasonable grounds.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur fringilla eget sapien vel porttitor. Phasellus interdum ex eget ultricies lobortis. Mauris mollis vehicula nisl id euismod. Proin sit amet venenatis lorem, a eleifend tortor. Proin semper tincidunt lacus eget ornare. Morbi porttitor risus ac odio placerat malesuada. In sed vulputate velit. Sed in mauris tincidunt, maximus libero a, faucibus ante. Curabitur quis fermentum mi.`}</Text>
                            <View style={styles.submitContainer}>
                                <CustomButton
                                    heading={props.agreeText}
                                    headingFontSize={16}
                                    buttonColor={Colors.maroon}
                                    isDisabled={false}
                                    onPressHandler={props.onAgree}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30,
        borderColor: 'black',
        borderWidth: 1
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderRadius: 20,
        elevation: 20,
        marginVertical: 150
    },
    form: {
        width: '100%'
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    heading: {
        fontFamily: 'roboto-bold',
        fontSize: 20,
        color: Colors.darkgreen
    },
    agreement: {
        fontFamily: 'roboto-regular',
        fontSize: 16,
        marginBottom: 10
    },
    submitContainer: {
        alignItems: 'flex-end',
        marginTop: 5
    }
});

export default DataPrivacyModal;