import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import Colors from "../constants/Colors";

const CustomButton = props => {
    return (
        // <TouchableOpacity
        //     style={!props.isDisabled ? styles.button : {...styles.button, ...styles.buttonDisabled}}
        //     disabled={props.isDisabled}
        //     onPress={() => props.onPressHandler()}
        // >
        //     {/* <Text style={!props.isDisabled ? styles.buttonText : {...styles.buttonText, ...styles.buttonTextDisabled, fontSize: props.headingFontSize}}> */}
        //     {!props.isDisabled && <Text style={[styles.buttonText, { fontSize: props.headingFontSize }]}>
        //         {props.heading}
        //     </Text>}
        //     {props.isDisabled && <Text style={[styles.buttonText, styles.buttonTextDisabled, { fontSize: props.headingFontSize }]}>
        //         {props.heading}
        //     </Text>}
        // </TouchableOpacity>
        <View>
            {!props.isDisabled && <TouchableOpacity
                style={[styles.button, { backgroundColor: props.buttonColor }]}
                disabled={props.isDisabled}
                onPress={() => props.onPressHandler()}
            >
                <Text style={[styles.buttonText, { fontSize: props.headingFontSize }]}>
                    {props.heading}
                </Text>
            </TouchableOpacity>}
            {props.isDisabled && <TouchableOpacity
                style={styles.buttonDisabled}
                disabled={props.isDisabled}
                onPress={() => props.onPressHandler()}
            >
                <Text style={[styles.buttonTextDisabled, { fontSize: props.headingFontSize }]}>
                    {props.heading}
                </Text>
            </TouchableOpacity>}
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.maroon,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 3,
        elevation: 5, // for android only
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
    },
    // buttonDisabled: {
    //     backgroundColor: '#dfdfdf'
    // },
    buttonDisabled: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dfdfdf',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 3,
        elevation: 5, // for android only
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontFamily: 'roboto-regular',
        fontSize: 18
    },
    buttonTextDisabled: {
        color: '#a4a4a4'
    }
});

export default CustomButton;