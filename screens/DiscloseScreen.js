import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import ReportModal from "../components/ReportModal";
import Colors from "../constants/Colors";

const DiscloseScreen = props => {
    const [visible, setVisible] = useState(false);
    const [heading, setHeading] = useState('');

    return (
        <View style={styles.screen}>
            {/* <Text>This is the disclose screen.</Text> */}
            <ReportModal
                visible={visible}
                heading={heading}
                closeModal={() => setVisible(false)}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="I suspect to be positive"
                    color={Colors.maroon}
                    onPress={() => {
                        setVisible(true);
                        setHeading("I suspect to be positive")
                        // console.log("button is clicked!");
                        // console.log("visible:", visible);
                    }}
                />
            </View>
            <Button
                title="I tested positive"
                color={Colors.maroon}
                onPress={() => {
                    setVisible(true);
                    setHeading("I tested positive")
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        marginBottom: 10
    }
})

export default DiscloseScreen