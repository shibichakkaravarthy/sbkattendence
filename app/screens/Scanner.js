import React, {useState, useRef, useEffect} from 'react';
import {Dimensions} from 'react-native';
import {H1, H2, H3, Text, Button, Container, Header, Left, Body, Right, Icon, Title} from 'native-base';
import {ThirdPersonEntry} from './ThirdPersonEntry';
import styled from 'styled-components/native';
import {RNCamera as Camera} from 'react-native-camera';
import RBSheet from "react-native-raw-bottom-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {showMessage} from "react-native-flash-message";
import axios from 'axios';

const Rolls = {
  "180721": "Raj Kumar",
  "108716": "Mari Muthu",
  "180718": "Pradeep",
  "180714": "Maharajan",
  "180719": "Rajaganesh"
}

const RootContainer = styled.View`
  flex: 1;
  flex-direction: column;
`;

const BottomSheetContent = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const BottomSheetText = styled.Text`
  font-size: 24px;
  text-align: center;
`;

const ThirdPersonEntryContainer = styled.View`
  position: absolute;
  right: 25px;
  top: 70px;
`;

const ProfileContainer = styled.View`
  position: absolute;
  left: 25px;
  top: 70px;
`;

export const ScannerScreen = ({regKey}) => {
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [lastActivity, setLastActivity] = useState('');
  const [lastLogout, setLastLogout] = useState('');
  const [showThirdPersonEntry, setShowThirdPersonEntry] = useState(false);
  const refRBSheet = useRef();

  const onBarcodeScan = (e) => {
    const testExpression = /^\d+$/
    const barcode = e.data
    alert(barcode, Rolls[barcode]);
    setScannedBarcode(barcode)
    if(barcode.length !== 6 && !testExpression.test(barcode)) {
      alert("Invalid BarCode")
      return;
    }
    refRBSheet.current.open();
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('lastActivity')
      if(value !== null) {
        setLastActivity(value)
      }
    } catch(e) {

    }
  }

  const getLogout = async () => {
    try {
      const value = await AsyncStorage.getItem('lastLogout')
      if(value !== null) {
        setLastLogout(value)
      }
    } catch(e) {

    }
  }

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('lastActivity', value)
    } catch (e) {
      // saving error
    }
  }
  const storeLogout = async (value) => {
    try {
      await AsyncStorage.setItem('lastLogout', value)
    }
    catch (e) {
      // saving error
    }
  }

  const onLogin = (id) => {
    console.log("LOGIN DATE", moment().format("YYYY-MM-DD"))
    axios.put('http://ec2-3-6-87-15.ap-south-1.compute.amazonaws.com:5000/checkin', {
      date: moment().format("DD-MM-YYYY"),
      time: moment().format("hh:mm AA"),
      userID: regKey,
    }).
    then(data => {
      storeData(moment().format("YYYY-MM-DD"));
      alert("Login Successful")
      getData()
    })
    .catch(err => {
      storeData(moment().format("YYYY-MM-DD"));
      alert("Login Successful")
      getData()
    })
  }

  const onLogout = () => {
    console.log("LOGIN DATE", moment().format("YYYY-MM-DD"))
    axios.put('http://ec2-3-6-87-15.ap-south-1.compute.amazonaws.com:5000/checkout', {
      date: moment().format("DD-MM-YYYY"),
      time: moment().format("hh:mm AA"),
      userID: regKey,
    }).
    then(data => {
      alert("Checkout successful")
      storeLogout(moment().format("YYYY-MM-DD"));
      getLogout()
    })
    .catch(err => {
      alert("Checkout unsuccessful")
      console.log(err)
      // storeLogout(moment().format("YYYY-MM-DD"));
      // getLogout();
    })
  }

  useEffect(() => {
    refRBSheet.current.open();
    getData()
  }, [scannedBarcode])

  if(showThirdPersonEntry) {
    return <ThirdPersonEntry back={() => setShowThirdPersonEntry(false)} />
  }

  return (
    <RootContainer>
      <Header>
        <Body>
          <Title></Title>
        </Body>
      </Header>

      <ProfileContainer>
        <Button
        >
          <Text>Profile</Text>
        </Button>
      </ProfileContainer>

      <ThirdPersonEntryContainer>
        <Button
          onPress={() => setShowThirdPersonEntry(true)}
          disabled={lastLogout === moment().format("DD-MM-YYYY")}
        >
          <Text>Third Person Entry</Text>
        </Button>
      </ThirdPersonEntryContainer>

      <Camera onBarCodeRead={onBarcodeScan} captureAudio={false} style={{flex: 1, margin: 20}} />
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={Dimensions.get('window').height*0.45}
        openDuration={250}
        customStyles={{
          draggableIcon: {
            backgroundColor: '#555',
          },
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}
      >
        <BottomSheetContent>
          {
            (lastActivity && moment(lastActivity).format("DD-MM-YYYY") === moment().format("DD-MM-YYYY"))
            ?
            <H2>Sign-Out</H2>
            :
            <H2>Sign-In</H2>
          }
          <BottomSheetContent>
          <H1>Student ID: {scannedBarcode}</H1>
          <H1>Student Name: {Rolls[scannedBarcode]}</H1>
          </BottomSheetContent>
          <BottomSheetContent>
            {
              (lastActivity && moment(lastActivity).format("DD-MM-YYYY") === moment().format("DD-MM-YYYY"))
              ?
              <BottomSheetText>Log out Time</BottomSheetText>
              :
              <BottomSheetText>Log in Time</BottomSheetText>
            }
            <BottomSheetText>{moment().format("DD MMM YYYY hh:mm A")}</BottomSheetText>
          </BottomSheetContent>
          <BottomSheetContent>
            <Button
            onPress={
              (lastActivity && moment(lastActivity).format("DD-MM-YYYY") === moment().format("DD-MM-YYYY"))
              ?
              onLogout
              :
              onLogin
            }
            disabled={lastLogout === moment().format("DD-MM-YYYY")}
            >
            {
              (lastActivity && moment(lastActivity).format("DD-MM-YYYY") === moment().format("DD-MM-YYYY"))
              ?
              <Text>Confirm and Log out</Text>
              :
              <Text>Confirm and Log in</Text>
            }
            </Button>
          </BottomSheetContent>
        </BottomSheetContent>
      </RBSheet>
    </RootContainer>
  )
}
