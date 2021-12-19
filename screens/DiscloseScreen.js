import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, RefreshControl, View, Button, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import DiscloseModal from "../components/DiscloseModal";
import Colors from "../constants/Colors";
import * as discloseActions from '../store/actions/disclose';

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
            contentContainerStyle={styles.screen}
            refreshControl={
                <RefreshControl
                    refreshing={isCheckingStatus}
                    onRefresh={checkUserStatus}
                />
            }
        >
            <DiscloseModal
                visible={visible}
                heading={heading}
                status={status}
                userData={userData}
                token={token}
                changeIsSubmitted={changeIsSubmitted}
                closeModal={() => setVisible(false)}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="I suspect to be positive"
                    color={Colors.maroon}
                    disabled={isUserPositive}
                    onPress={() => {
                        setVisible(true);
                        setHeading("I suspect to be positive");
                        setStatus("suspected");
                    }}
                />
            </View>
            <Button
                title="I tested positive"
                color={Colors.maroon}
                disabled={isUserPositive}
                onPress={() => {
                    setVisible(true);
                    setHeading("I tested positive")
                    setStatus("disclosed positive");
                }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        marginBottom: 10
    }
})

export default DiscloseScreen