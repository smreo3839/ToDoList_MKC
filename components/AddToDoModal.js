import { View, Text, TextInput, Button } from 'react-native';
import React from 'react';
import AppStyles from '../styles/AppStyles';

export default function AddToDoModal(props) {
  let [todo, setTodo] = React.useState("");
  return (
    <View style={AppStyles.container}>
      <Text style={AppStyles.header}>할일 추가</Text>
      <TextInput 
          style={[AppStyles.textInput, AppStyles.darkTextInput]} 
          placeholder='해야할 일'
          value={todo}
          onChangeText={setTodo} />
      <View style={[AppStyles.rowContainer, AppStyles.rightAligned, AppStyles.rightMargin]}>
      <Button title="확인" onPress={() => {
          props.addToDo(todo);
          setTodo("");
          props.onClose();
        }} />
        <Button title="취소" onPress={props.onClose} />
      </View>
    </View>
  );
}