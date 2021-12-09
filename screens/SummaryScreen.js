import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SummaryScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>This is the summary screen.</Text>
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

export default SummaryScreen