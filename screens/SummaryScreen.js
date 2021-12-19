import React, { useCallback, useState } from "react";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Card";
import Colors from "../constants/Colors";
import moment from 'moment'

import * as authActions from '../store/actions/auth'


const SummaryScreen = props => {
    const userData = useSelector(state => state.auth.user)
    const dispatch = useDispatch()
    
    const logoutHandler = useCallback(() => {
        dispatch(authActions.logout())
        props.navigation.navigate('Auth')
    }, [dispatch])

    return (
    <View style={styles.screen}>
        <Card style={styles.summaryContainer}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Profile Summary</Text>
                </View>
                <Text style={styles.label}>Contact Number:</Text>
                <Text style={styles.detail}>{userData.contact_num}</Text>
                {userData.email && <Text style={styles.label}>Email:</Text>}
                {userData.email && <Text>{userData.email}</Text>}
                {userData.name && <Text style={styles.label}>Name:</Text>}
                {userData.name && <Text>{userData.name}</Text>}
                <Text style={styles.label}>Preferred Contact Time: </Text> 
                <Text style={styles.detail}>{moment(userData.contact_start_time, "HH:mm").format("hh:mm A")} to {moment(userData.contact_end_time, "HH:mm").format("hh:mm A")}</Text>
                <Text style={styles.label}>Preferred Way of Interview: </Text> 
                <Text style={styles.detail}>{userData.way_of_interview}</Text>
                <Text style={styles.label}>Role: </Text> 
                <Text style={styles.detail}>{userData.role}</Text>
            </ScrollView>
        </Card>

        <View style={styles.buttonContainer}>
            
        <TouchableOpacity 
            style={{
                ...styles.wideButton, 
                backgroundColor: Colors.maroon, 
            }} 
            onPress={logoutHandler}>
            <Text style={styles.wideButtonText}>LOGOUT</Text>
        </TouchableOpacity>            
        </View>

    </View>

    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    summaryContainer: {
        width: '80%',
        maxWidth: 400,
        // height: '0%',
        // maxHeight: 800,
        padding: 20,
        marginVertical: 20
    },
    buttonContainer: {
        width: '80%',
        maxWidth: 400,
        marginVertical: 20
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    header: {
        fontFamily: 'roboto-bold',
        color: Colors.darkgreen,
        fontSize: 18
    },
    label: {
        fontFamily: 'roboto-medium',
        fontSize: 16,
        color: Colors.darkgreen,
        marginVertical: 10
    },
    detail: {
        fontFamily: 'roboto-regular',
        fontSize: 16,
        textAlign: 'center'
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

})

export default SummaryScreen