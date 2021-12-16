import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet } from 'react-native';

import QRCodeScanner from '../components/QRCodeScanner';

const ScanScreen = props => {
    const [titleValue, setTitleValue] = useState('');
    const [selectedImage, setSelectedImage] = useState();
    const [isFocused, setIsFocused] = useState(true);

    useEffect(() => {
        const focusListener = props.navigation.addListener('didFocus', () => {
            console.log("currently focused!");
            setIsFocused(true);
        });
        
        const blurListener = props.navigation.addListener('willBlur', () => {
            console.log("will blur!");
            setIsFocused(false);
        });

        return () => {
            console.log("will remove listener!");
            focusListener.remove();
            blurListener.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            {/* <Text>Testing...</Text> */}
            {isFocused && <QRCodeScanner switchTab={() => props.navigation.navigate('Disclose')} />}
        </View>
    );
};

ScanScreen.navigationOptions = {
    headerTitle: "Scan QR Code"
};

const styles = StyleSheet.create({
    container: {
        // margin: 30
        flex: 1
    }
});

export default ScanScreen;