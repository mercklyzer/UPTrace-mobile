import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, Alert, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

import Colors from '../constants/Colors';

const QRCodeScanner = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [imagePadding, setImagePadding] = useState(0);
    const [ratio, setRatio] = useState('4:3');  // default is 4:3
    const { height, width } = Dimensions.get('window');
    const screenRatio = height / width;
    const [isRatioSet, setIsRatioSet] =  useState(false);

    useEffect(() => {
        (async () => {
            const result = await Permissions.askAsync(Permissions.CAMERA);
            setHasPermission(result.status === 'granted');
        })();
    }, []);

    const prepareRatio = async () => {
        let desiredRatio = '4:3';  // Start with the system default
        // This issue only affects Android
        if (Platform.OS === 'android') {
            const ratios = await camera.getSupportedRatiosAsync();

            // Calculate the width/height of each of the supported camera ratios
            // These width/height are measured in landscape mode
            // find the ratio that is closest to the screen ratio without going over
            let distances = {};
            let realRatios = {};
            let minDistance = null;
            for (const ratio of ratios) {
                const parts = ratio.split(':');
                const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
                realRatios[ratio] = realRatio;
                // ratio can't be taller than screen, so we don't want an abs()
                const distance = screenRatio - realRatio; 
                distances[ratio] = realRatio;
                if (minDistance == null) {
                    minDistance = ratio;
                } else {
                    if (distance >= 0 && distance < distances[minDistance]) {
                        minDistance = ratio;
                    }
                }
            }
            // set the best match
            desiredRatio = minDistance;
            //  calculate the difference between the camera width and the screen height
            const remainder = Math.floor(
            (height - realRatios[desiredRatio] * width) / 2
            );
            // set the preview padding and preview ratio
            setImagePadding(remainder);
            setRatio(desiredRatio);
            // Set a flag so we don't do this 
            // calculation each time the screen refreshes
            setIsRatioSet(true);
        }
    };

    const setCameraReady = async () => {
        if (!isRatioSet) {
            await prepareRatio();
        }
    };

    const scanQRHandler = async ({ type, data }) => {
        setScanned(true);
        // Verify if QR code is valid. If yes, show alert below, sumit POST request, then redirect. If not, show alert saying that QR code is invalid and try again. Need to setScanned(false) here.
        // Show activity indicator while waiting for response from server hehe
        Alert.alert('Successfully scanned QR code!', `Data: ${data}`, [{ text: 'Okay', onPress: props.switchTab }]);
    };

    // if(isLoading) {
    //     return (
    //         <View style={styles.centered}>
    //             <ActivityIndicator size='large' color={Colors.maroon} />
    //         </View>
    //     );
    // }

    if(hasPermission === null) {
        return <Text>Requesting for camera permission.</Text>;
    }

    if(hasPermission === false) {
        return <Text>No camera access! You need to grant camera permission to use this app.</Text>;
    }

    return (
        <View style={StyleSheet.absoluteFillObject}>
            <Camera
                onCameraReady={setCameraReady}
                ratio={ratio}
                ref={(ref) => {
                    setCamera(ref);
                }}
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                onBarCodeScanned={scanned ? undefined : scanQRHandler}
                style={styles.scanner}
            />
            {scanned && <Button
                title={'Tap to Scan Again'}
                color={Colors.primary}
                onPress={() => {
                    setScanned(false);
                }}
            />}
        </View>
    );
};

const styles = StyleSheet.create({
    scanner: {
        height: '100%'
        // flex: 1
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default QRCodeScanner;