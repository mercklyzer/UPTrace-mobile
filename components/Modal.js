import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Modal, StyleSheet, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from "react-redux";
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
import CustomButton from './CustomButton';

const DataPrivacyModal = props => {
    const [showModal, setShowModal] = useState(props.visible);

    useEffect(() => {
        setShowModal(props.visible)
    }, [props.visible])

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
                            <Text style={styles.heading}>{props.header}</Text>
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
                            {props.children}
                            <View style={styles.submitContainer}>
                                <CustomButton
                                    heading={"I agree"}
                                    headingFontSize={16}
                                    buttonColor={Colors.maroon}
                                    isDisabled={false}
                                    // onPressHandler={() => console.log("I agreed")}
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