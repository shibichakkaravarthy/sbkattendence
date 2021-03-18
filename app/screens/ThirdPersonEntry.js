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

export const ThirdPersonEntry = ({back}) => {
  const [regNo, setRegNo] = useState('')
  const [password, setPassword] = useState('')

  const onProceed = () => {
    storeData({regNo})
  }

  return (
    <RootContainer>
      <FormContainer>
        <H1>Third Person</H1>
        <Space />
        <Item>
          <Input placeholder="Name" onChangeText={text => setRegNo(text)} />
        </Item>
        <Item>
          <Input placeholder="Person to see" onChangeText={text => setRegNo(text)} />
        </Item>
        <Item>
          <Input placeholder="Reason" onChangeText={text => setRegNo(text)} />
        </Item>
        <Space />
        <Button primary onPress={() => alert("Error saving Third Person Entry")} >
          <Text>Enter</Text>
        </Button>
        <Space />
        <Button primary onPress={back} >
          <Text>Back</Text>
        </Button>
      </FormContainer>
    </RootContainer>
  )
}
