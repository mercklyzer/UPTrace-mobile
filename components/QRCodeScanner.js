import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Dimensions, Platform, Image } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import moment from "moment";

import Colors from '../constants/Colors';
import * as scannerActions from '../store/actions/scanner';
import Modal from '../components/Modal';

const QRCodeScanner = props => {
    const [scannedBuilding, setScannedBuilding] = useState('')
    const [scannedRoom, setScannedRoom] = useState('')

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [isWaitingResponse, setIsWaitingResponse] = useState(false);
    const [successfulScanModalVisible, setSuccessfulScanModalVisible] = useState(false);
    
    const [camera, setCamera] = useState(null);
    const [imagePadding, setImagePadding] = useState(0);
    const [ratio, setRatio] = useState('4:3');  // Default ratio is 4:3
    const [isRatioSet, setIsRatioSet] =  useState(false);
    const { height, width } = Dimensions.get('window');
    const screenRatio = height / width;

    const dispatch = useDispatch();
    const userData = useSelector(state => state.auth.user);
    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        (async () => {
            const result = await Permissions.askAsync(Permissions.CAMERA);
            setHasPermission(result.status === 'granted');
        })();
    }, []);

    const prepareRatio = async () => {
        let desiredRatio = '4:3'; // Start with the system default

        // This issue only affects Android
        if (Platform.OS === 'android') {
            const ratios = await camera.getSupportedRatiosAsync();

            // Calculate the width/height of each of the supported camera ratios
            // These width/height are measured in landscape mode
            // Find the ratio that is closest to the screen ratio without going over
            let distances = {};
            let realRatios = {};
            let minDistance = null;
            for (const ratio of ratios) {
                const parts = ratio.split(':');
                const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
                realRatios[ratio] = realRatio;
                // Ratio can't be taller than screen, so we don't want an abs()
                const distance = screenRatio - realRatio; 
                distances[ratio] = realRatio;
                if(minDistance == null) {
                    minDistance = ratio;
                } else {
                    if (distance >= 0 && distance < distances[minDistance]) {
                        minDistance = ratio;
                    }
                }
            }

            // Set the best ratio match
            desiredRatio = minDistance;

            // Calculate the difference between the camera width and the screen height
            const remainder = Math.floor((height - realRatios[desiredRatio] * width) / 2);

            // Set the preview padding and preview ratio
            setImagePadding(remainder);
            setRatio(desiredRatio);

            // Set that the ratio has been computed so that it won't have to be recomputed every time the screen refreshes
            setIsRatioSet(true);
        }
    };

    const setCameraReady = async () => {
        if(!isRatioSet) {
            await prepareRatio();
        }
    };

    useEffect(() => {
        if(scannedBuilding !== '' && scannedRoom !== ''){
            // Alert.alert('Success', `Successfully scanned ${scannedBuilding} - ${scannedRoom}`, [{ text: 'Okay', onPress: props.switchTab }]);
            setSuccessfulScanModalVisible(true);
        }
    }, [scannedBuilding, scannedRoom])

    const scanQRHandler = async ({ type, data }) => {
        // If the QR code scanned is valid, data === room_id
        setScanned(true);
        setIsWaitingResponse(true);
        try {
            await dispatch(scannerActions.addLog(userData, token, data))
            .then((response) => {
                console.log("scanned: ", response);

                setScannedBuilding(response.building_name)
                setScannedRoom(response.room_name)

                console.log("room_id:", data);
                // Alert.alert('Success', `Successfully scanned ${scannedBuilding} - ${scannedRoom}`, [{ text: 'Okay', onPress: props.switchTab }]);
            })
        } catch(err) {
            console.log("error:", err);
            Alert.alert('An error occurred', `${err}`, [{ text: 'Try Again', onPress: () => {
                setScanned(false);
                setIsWaitingResponse(false);
            } }]);
        }
    };

    if(hasPermission === null) {
        return <View style={styles.centered}>
            <Text>Requesting for camera permission.</Text>
        </View>;
    }

    if(hasPermission === false) {
        return <View style={styles.centered}>
            <Text>No camera access! You need to grant camera permission to use this app.</Text>
        </View>;
    }

    return (
        <View style={StyleSheet.absoluteFillObject}>
            {!isWaitingResponse && <Camera
                onCameraReady={setCameraReady}
                ratio={ratio}
                ref={(ref) => {
                    setCamera(ref);
                }}
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                onBarCodeScanned={scanned ? undefined : scanQRHandler}
                style={styles.scanner}
            />}
            {isWaitingResponse && <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.maroon} />
            </View>}
            <Modal
                header='Success'
                visible={successfulScanModalVisible}
                closeModal={() => {
                    setSuccessfulScanModalVisible(false);
                    props.switchTab();
                }}
                onAgree={() => {
                    setSuccessfulScanModalVisible(false);
                    props.switchTab();
                }}
                agreeText='Okay'
                removeAgreeButton={true}
            >
                <View style={styles.successGifContainer}>
                    <Image source={require('../assets/images/success.gif')} style={styles.successGif} />
                </View>
                <Text style={styles.successMessage}>Successfully scanned {scannedBuilding} - {scannedRoom}</Text>
            </Modal>
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
    },
    successMessage: {
        fontFamily: 'roboto-regular',
        color: Colors.darkgreen,
        fontSize: 16,
        textAlign: 'center'
    },
    successGifContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    successGif: {
        width: '40%',
        height: undefined,
        aspectRatio: 1,
        resizeMode:'contain',
        marginBottom: Dimensions.get('window').height > 800? 10: 6
    },
});

export default QRCodeScanner;