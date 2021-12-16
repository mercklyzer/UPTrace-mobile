import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Platform, TouchableOpacity, Button } from 'react-native';
import { RadioButtons, SegmentedControls } from 'react-native-radio-buttons'
import CalendarPicker from 'react-native-calendar-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import moment from "moment";

import Colors from '../constants/Colors';

const ReportModal = props => {
    const [showModal, setShowModal] = useState(props.visible);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const toggleModal = () => {
        if(props.visible) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    };
    // console.log("inside report modal");
    // console.log("showModal:", showModal);

    const resetModal = () => {
        setSelectedOption(null);
        setSelectedDate(null);
    };

    useEffect(() => {
        toggleModal();
    }, [props.visible]);

    useEffect(() => {
        resetModal();
    }, [props.heading]);

    const options = ["Yes", "No"];

    const selectionHandler = (selectedOption, selectedIndex) => {
        console.log('selected:', selectedOption);
        if(selectedOption === 'Yes') {
            console.log('symptomatic');
            setSelectedOption('Yes');
        } else {
            console.log('Asymptomatic');
            setSelectedOption('No');
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
                            <View style={styles.closeButton}>
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
                            <View style={styles.symptomsContainer}>
                                <Text style={styles.label}>Do you have symptoms?</Text>
                                <SegmentedControls
                                    options={options}
                                    onSelection={selectionHandler}
                                    selectedOption={selectedOption}
                                    tint={Colors.darkgreen}
                                    optionStyle={{fontFamily: 'roboto-regular'}}
                                    optionContainerStyle={{flex: 1}}
                                />
                            </View>
                            {selectedOption === 'Yes'
                            ? (
                                <View style={styles.calendarContainer}>
                                    {/* <CalendarPicker
                                        selectedDayColor={Colors.darkgreen}
                                        selectedDayTextColor={'white'}
                                        onDateChange={() => console.log("changed date")}
                                    /> */}
                                    <Text style={styles.label}>When did your symptoms start? (Onset Date)</Text>
                                    <Text style={styles.date}>{selectedDate && moment(selectedDate).format('MM/DD/YYYY')}</Text>
                                    <Button
                                        title={!selectedDate ? "Select date" : "Change date"}
                                        color={Colors.darkgreen}
                                        style={styles.datePickerButton}
                                        onPress={() => setShowCalendar(true)}
                                    />
                                    {showCalendar && <DateTimePicker
                                        testID="dateTimePicker"
                                        value={new Date()}
                                        mode={'date'}
                                        // is24Hour={true}
                                        display="default"
                                        onChange={changeDateHandler}
                                        maximumDate={new Date()}
                                        minimumDate={new Date(2019, 11, 1)}
                                    />}
                                </View>
                            )
                            : null}
                            <View style={styles.submitContainer}>
                                <Button
                                    title="Submit"
                                    color={Colors.maroon}
                                />
                            </View>
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
    closeButton: {
        // width: '100%',
        // justifyContent: 'flex-end',
        // alignItems: 'flex-end'
    },
    heading: {
        fontFamily: 'roboto-bold',
        fontSize: 20,
        // justifyContent: 'center',
        // alignItems: 'flex-start'
    },
    label: {
        // textAlign: 'center'
        fontFamily: 'roboto-regular',
        fontSize: 18,
        marginBottom: 10
    },
    symptomsContainer: {
        // marginBottom: 20
    },
    calendarContainer: {
        // flex: 1,
        width: '100%',
        backgroundColor: 'white',
        marginTop: 20
    },
    date: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        marginBottom: 20,
        paddingBottom: 5
    },
    datePickerButton: {
        // borderRadius: 30,
        // borderWidth: 1
        marginBottom: 10
    },
    submitContainer: {
        alignItems: 'flex-end',
        marginTop: 20
    }
});

export default ReportModal;