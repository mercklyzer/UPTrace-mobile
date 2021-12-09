import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const AuthScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>This is the signup/login screen.</Text>
            <Button title="LOGIN" onPress={() => props.navigation.navigate('Content')}/>
        </View>
    )
}

AuthScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Signup/Login'
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default AuthScreen