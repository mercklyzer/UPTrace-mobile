import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import QRCodeScanner from '../components/QRCodeScanner';

const ScanScreen = props => {
    const [isFocused, setIsFocused] = useState(true);

    useEffect(() => {
        const focusListener = props.navigation.addListener('didFocus', () => {
            setIsFocused(true);
        });
        
        const blurListener = props.navigation.addListener('willBlur', () => {
            setIsFocused(false);
        });

        return () => {
            focusListener.remove();
            blurListener.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            {isFocused && <QRCodeScanner switchTab={() => props.navigation.navigate('Disclose')} />}
        </View>
    );
};

ScanScreen.navigationOptions = {
    headerTitle: "Scan QR Code"
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default ScanScreen;