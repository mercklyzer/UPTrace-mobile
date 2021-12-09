import React from "react";
import { StyleSheet, Text, View } from "react-native";

const DiscloseScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>This is the disclose screen.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default DiscloseScreen