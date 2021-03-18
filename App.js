/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScannerScreen} from './app/screens/Scanner';
import {LoginScreen} from './app/screens/Login';
import axios from 'axios';

const RootContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const App: () => React$Node = () => {
  const [loginKey, setLoginKey] = useState({})
  const [loading, setLoading] = useState(false)

  const storeData = async (value) => {
    try {
      console.log("DEI NAAYE", value)
      setLoginKey(value)
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@login_keys', jsonValue)
    } catch (e) {
      // saving error
      console.log("ERROR SAVING", e)
    }
  }

  const getData = async () => {
    console.log("GOYYALA 1")
    try {
      setLoading(true)
      const value = await AsyncStorage.getItem('@login_keys')
      if(value.regNo !== null) {
        console.log("GOT VALUE")
        // value previously stored
        setLoading(false)
        setLoginKey(JSON.parse(value))
        return;
      }
      setLoading(false)
    } catch(e) {
      // error reading value
      console.log("GOT ERROR")
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
    console.log("GOYYALA 2")
  }, [styled])

  if(!loading) {
    if(loginKey.regNo) {
      return (
        <ScannerScreen regKey={loginKey.regNo} />
      )
    }
    else {
      return (
        <LoginScreen storeData={storeData} />
      )
    }
  }

  // return (
  //   <>
  //     <ScannerScreen />
  //   </>
  // );
  return (
    <RootContainer>
      <ActivityIndicator size="large" color="#00ff00" />
    </RootContainer>
  );
};

export default App;
