import React, {useState} from 'react';
import styled from 'styled-components/native';
import { Container, Header, Content, Form, Item, Input, H1, Button, Text } from 'native-base';

const RootContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const Space = styled.View`
  height: 25px;
`;

const FormContainer = styled.View`
  margin: 50px;
  padding: 20px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #777;
`;

export const LoginScreen = ({storeData}) => {
  const [regNo, setRegNo] = useState('')
  const [password, setPassword] = useState('')

  const onProceed = () => {
    storeData({regNo})
  }

  return (
    <RootContainer>
      <FormContainer>
        <H1>Sign-In</H1>
        <Space />
        <Item>
          <Input placeholder="Reg No" onChangeText={text => setRegNo(text)} />
        </Item>
        <Item last>
        </Item>
        <Space />
        <Button rounded primary onPress={onProceed} >
          <Text>Proceed</Text>
        </Button>
      </FormContainer>
    </RootContainer>
  )
}
