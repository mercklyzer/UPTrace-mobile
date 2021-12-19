import React, { useState, useEffect } from "react";
import { StyleSheet, Text, ScrollView, RefreshControl, View, Image, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import DiscloseModal from "../components/DiscloseModal";
import Colors from "../constants/Colors";
import * as discloseActions from '../store/actions/disclose';
import CustomButton from "../components/CustomButton";

const DiscloseScreen = props => {
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [isUserPositive, setIsUserPositive] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [heading, setHeading] = useState(null);
    const [status, setStatus] = useState(null); // suspected, disclosed positive
    
    const userData = useSelector(state => state.auth.user);
    const token = useSelector(state => state.auth.token);

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
                <View style={styles.contentContainer}>
                    <Text style={styles.contentHeading}>Some Title</Text>
                    <Text style={styles.contentText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium assumenda id, reprehenderit minima ipsam quidem, nemo veritatis sint ut perferendis nostrum temporibus fugiat qui dolorem vel fugit repellendus labore ipsa suscipit dolorum, adipisci aut totam omnis. Voluptas voluptatibus saepe magnam, magni possimus quibusdam! Quo dignissimos eos necessitatibus ut facilis et.</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.contentHeading}>Some Title</Text>
                    <Text style={styles.contentText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium assumenda id, reprehenderit minima ipsam quidem, nemo veritatis sint ut perferendis nostrum temporibus fugiat qui dolorem vel fugit repellendus labore ipsa suscipit dolorum, adipisci aut totam omnis. Voluptas voluptatibus saepe magnam, magni possimus quibusdam! Quo dignissimos eos necessitatibus ut facilis et.</Text>
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
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flexGrow: 1,
        alignItems: 'center',
        // justifyContent: 'center',
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
    contentContainer: {
        alignSelf: 'flex-start',
        marginHorizontal: 30,
        marginTop: 30
    },
    contentHeading: {
        fontFamily: 'roboto-bold',
        fontSize: 24,
        color: Colors.maroon
    },
    contentText: {
        fontFamily: 'roboto-regular',
        fontSize: 16,
    }
})

export default DiscloseScreen