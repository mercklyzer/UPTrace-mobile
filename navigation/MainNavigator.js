import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import {createDrawerNavigator, DrawerNavigatorItems} from 'react-navigation-drawer'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs'

import AuthScreen from '../screens/AuthScreen'
import DiscloseScreen from '../screens/DiscloseScreen'
import ScanScreen from '../screens/ScanScreen'
import SummaryScreen from '../screens/SummaryScreen'

import {Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import Colors from '../constants/Colors'
import { Text } from 'react-native'
import StartupScreen from '../screens/StartupScreen'


const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android'? Colors.maroon : 'white',
    },
    headerTitleStyle: {
        // fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        // fontFamily: 'open-sans'
    },
    headerTintColor: Platform.OS === 'android'? 'white' : Colors.maroon
}

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
}, {
    defaultNavigationOptions: defaultNavOptions
})

const DiscloseNavigator = createStackNavigator({
    Disclose: DiscloseScreen
}, {
    defaultNavigationOptions: defaultNavOptions
})

const ScanNavigator = createStackNavigator({
    Scan: ScanScreen
}, {
    defaultNavigationOptions: defaultNavOptions
})

const SummaryNavigator = createStackNavigator({
    Summary: SummaryScreen
}, {
    defaultNavigationOptions: defaultNavOptions
})

const tabScreenConfig = {
    Disclose: {
        screen: DiscloseNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <MaterialCommunityIcons name='hospital' size={25} color={tabInfo.tintColor}/>
            },
            tabBarColor: Colors.darkgreen,
            tabBarLabel: Platform.OS === 'android'? <Text>Disclose</Text> : 'Disclose'
        }
    },
    Scan: {
        screen: ScanNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <MaterialIcons name='qr-code-scanner' size={25} color={tabInfo.tintColor}/>
            },
            tabBarColor: Colors.maroon,
            tabBarLabel: Platform.OS === 'android'? <Text>Scan</Text> : 'Scan'
        }
    },
    Summary: {
        screen: SummaryNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <Ionicons name='person-circle-outline' size={25} color={tabInfo.tintColor}/>
            },
            tabBarColor: Colors.orange,
            tabBarLabel: Platform.OS === 'android'? <Text>Summary</Text> : 'Summary'
        }
    }
}

const ContentNavigator = Platform.OS === 'android' ?
createMaterialBottomTabNavigator(tabScreenConfig, {
    activeColor: 'white',
    shifting: true,
    barStyle:{ backgroundColor: Colors.darkgreen }
}) :
createBottomTabNavigator(tabScreenConfig, {
    tabBarOptions: {
        labelStyle: {
            // fontFamily: 'open-sans-bold'
        },
        activeTintColor: Colors.darkgreen
    }
})

const MainNavigator = createSwitchNavigator({
    // add StartUp Screen here for autologin if applicable
    Startup: StartupScreen,
    Auth: AuthNavigator,
    Content: ContentNavigator
})

export default createAppContainer(MainNavigator)