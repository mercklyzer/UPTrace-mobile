import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/Colors";
import { useDispatch } from "react-redux";
import * as authActions from '../store/actions/auth'

const StartupScreen = (props) => {
    const dispatch = useDispatch()

    useEffect(() => {
        const tryLogin = async () => {
            console.log("trying to login");
            const userData = await AsyncStorage.getItem('userData')
            const transformedData = JSON.parse(userData)
            console.log(transformedData);
            if(!userData){
                props.navigation.navigate('Auth')
                return
            }

            let {token, user} = transformedData
            user = user? JSON.parse(user) : user
    
            if(!token || !user){
                props.navigation.navigate('Auth')
                return
            }

            dispatch(authActions.authenticate(user, token))
            props.navigation.navigate('Content')
        }



        tryLogin()
    }, [dispatch])

    return (
        <View style={styles.screen}>
            <ActivityIndicator size='large' color={Colors.primary}/>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default StartupScreen