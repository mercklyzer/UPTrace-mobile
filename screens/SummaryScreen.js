import React, { useCallback, useState } from "react";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Card";
import Colors from "../constants/Colors";

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
                <Text>Profile Summary</Text>
                <Text>{userData.contact_num}</Text>
                {userData.email && <Text>{userData.email}</Text>}
                {userData.name && <Text>{userData.name}</Text>}
                <Text>{userData.contact_start_time}</Text>
                <Text>{userData.contact_end_time}</Text>
                <Text>{userData.way_of_interview}</Text>
                <Text>{userData.role}</Text>
            </ScrollView>
        </Card>

        <View style={styles.buttonContainer}>
            
            <Button title='LOGOUT' color={Colors.maroon}
                onPress={logoutHandler}
            />
            
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
    }
})

export default SummaryScreen