import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Platform, TouchableOpacity, Button, ActivityIndicator, Alert } from 'react-native';
import { SegmentedControls } from 'react-native-radio-buttons'
import { useDispatch } from "react-redux";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import moment from "moment";

import Colors from '../constants/Colors';
import * as discloseActions from '../store/actions/disclose';
import CustomButton from './CustomButton';

const DiscloseModal = props => {
    const [showModal, setShowModal] = useState(props.visible);
    const [showCalendar, setShowCalendar] = useState(false);
    const [condition, setCondition] = useState(null);
    const [isSymptomatic, setIsSymptomatic] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
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
        setIsSymptomatic(null);
        setSelectedDate(null);
    };

    useEffect(() => {
        toggleModal();
    }, [props.visible]);

    useEffect(() => {
        resetModal();
    }, [props.heading, props.visible]);

    const options = ["Yes", "No"];

    const selectionHandler = (isSymptomatic, selectedIndex) => {
        if(isSymptomatic === 'Yes') {
            setIsSymptomatic('Yes');
            setCondition('symptomatic');
        } else {
            setIsSymptomatic('No');
            setCondition('asymptomatic');
        }
    };

    const changeDateHandler = (event, selectedDate) => {
        setShowCalendar(false);
        if(selectedDate !== undefined) {
            setSelectedDate(selectedDate);
            console.log("changed date to:", selectedDate);
        } else {
            console.log("no date change");
        }
    };

    const checkValidity = () => {
        if(isSymptomatic == null) return false;

        switch(isSymptomatic) {
            case('Yes'):
                if(selectedDate !== null) return true;
                return false;
            case('No'):
                return true;
            default:
                return false;
        }
    };

    const submitHandler = async () => {
        setIsSubmitted(true);
        const isFormValid = checkValidity();

        if(isFormValid) {
            let onsetDate = moment(selectedDate).format("YYYY-MM-DD");
            const disclosureDate = moment().unix();
            const status = props.status;
            
            if(isSymptomatic === 'No') {
                onsetDate = moment().format("YYYY-MM-DD");
            }
    
            const formData = {
                condition: condition,
                onsetDate: onsetDate,
                disclosureDate: disclosureDate,
                status: status
            };
    
            console.log("formData:", formData);
            console.log('Form is valid.');
            
            setIsWaitingResponse(true);
            try {
                await dispatch(discloseActions.addPatient(props.userData, props.token, formData))
                .then((patientObject) => {
                    props.closeModal();
                    console.log('patientObject:', patientObject);
                    props.changeIsSubmitted();
                })
            } catch(err) {
                console.log("error:", err);
                Alert.alert('An error occurred', `${err}`, [{ text: 'Try Again' }]);
            }
            setIsWaitingResponse(false);
        } else {
            console.log('Form is invalid.');
        }
    };

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
                            <Text style={styles.heading}>{props.heading}</Text>
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
                        <View style={styles.form}>
                            <View>
                                <Text style={styles.label}>Do you have symptoms?</Text>
                                <SegmentedControls
                                    options={options}
                                    onSelection={selectionHandler}
                                    selectedOption={isSymptomatic}
                                    tint={Colors.darkgreen}
                                    optionStyle={{fontFamily: 'roboto-regular'}}
                                    optionContainerStyle={{flex: 1}}
                                />
                                <Text style={styles.errorText}>{isSubmitted && isSymptomatic == null ? 'Please select "Yes" or "No."' : ''}</Text>
                            </View>
                            {isSymptomatic === 'Yes'
                            ? (
                                <View>
                                    <Text style={styles.label}>When did your symptoms start? (Onset Date)</Text>
                                    {Platform.OS === 'android' && <View>
                                        <View style={styles.dateInput}>
                                            <Text style={styles.date}>{selectedDate ? moment(selectedDate).format('MM/DD/YYYY') : ''}</Text>
                                            <View style={styles.datePickerButtonContainer}>
                                                <CustomButton
                                                    heading={!selectedDate ? "Select date" : "Change date"}
                                                    headingFontSize={16}
                                                    buttonColor={Colors.darkgreen}
                                                    isDisabled={false}
                                                    onPressHandler={() => setShowCalendar(true)}
                                                />
                                            </View>
                                        </View>
                                        <View>
                                            {showCalendar && <DateTimePicker
                                                testID="dateTimePicker"
                                                value={new Date()}
                                                mode={'date'}
                                                display="default"
                                                onChange={changeDateHandler}
                                                maximumDate={new Date()}
                                                minimumDate={new Date(2019, 11, 1)}
                                            />}
                                        </View>
                                    </View>}
                                    {Platform.OS === 'ios' && <View>
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={new Date()}
                                            mode={'date'}
                                            display="default"
                                            onChange={changeDateHandler}
                                            maximumDate={new Date()}
                                            minimumDate={new Date(2019, 11, 1)}
                                        />
                                    </View>}
                                    <Text style={styles.errorText}>{isSubmitted && selectedDate == null ? 'Please select a date.' : ''}</Text>
                                </View>
                            )
                            : null}
                            {!isWaitingResponse && <View style={styles.submitContainer}>
                                <CustomButton
                                    heading="Submit"
                                    headingFontSize={18}
                                    buttonColor={Colors.maroon}
                                    isDisabled={false}
                                    onPressHandler={submitHandler}
                                />
                            </View>}
                            {isWaitingResponse && <View style={{alignItems: 'flex-end'}}>
                                <ActivityIndicator size='large' color={Colors.maroon} />
                            </View>}
                        </View>
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
        elevation: 20
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
        fontSize: 20
    },
    label: {
        fontFamily: 'roboto-regular',
        fontSize: 18,
        marginBottom: 10
    },
    errorText: {
        color: 'red',
        marginTop: 5
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    date: {
        fontSize: 16,
        fontFamily: 'roboto-italic'
    },
    datePickerButtonContainer: {
        // marginTop: 10,
    },
    submitContainer: {
        alignItems: 'flex-end',
        marginTop: 10
    }
});

export default DiscloseModal;