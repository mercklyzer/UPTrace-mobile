import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ScanScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>This is the scan screen.</Text>
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

export default ScanScreen