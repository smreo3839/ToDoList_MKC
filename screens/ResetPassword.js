import { Text, View, TextInput, ImageBackground, Button, KeyboardAvoidingView, Platform } from 'react-native';
import AppStyles from '../styles/AppStyles';
import InlineTextButton from '../components/InlineTextButton';
import React from 'react';
import { auth } from "../firebase";
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ResetPassword({ navigation }) {

  const background = require("../assets/background.jpg");

  // 이메일 상태를 관리하는 변수
  let [email, setEmail] = React.useState("");

  let [errorMessage, setErrorMessage] = React.useState("");

  // resetPassword 함수는 사용자가 비밀번호 재설정을 요청할 때 호출
  let resetPassword = () => {
    // 비밀번호 재설정 이메일을 사용자에게 전송하고,
    // 성공적으로 이메일이 전송되면 사용자를 로그인 화면으로 이동
    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigation.popToTop();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }

  return (
    <ImageBackground style={AppStyles.imageContainer} source={background}>
      <KeyboardAvoidingView
        style={AppStyles.backgroundCover}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={60}>
        <Text style={[AppStyles.lightText, AppStyles.header]}>Reset Password</Text>
        <Text style={AppStyles.errorText}>{errorMessage}</Text>
        <TextInput
          style={[AppStyles.textInput, AppStyles.lightTextInput, AppStyles.lightText]}
          placeholder='Email'
          placeholderTextColor="#BEBEBE"
          value={email}
          onChangeText={setEmail} />
        <View style={[AppStyles.rowContainer, AppStyles.topMargin]}>
          <Text style={AppStyles.lightText}>계정이 없으신가요?   </Text>
          <InlineTextButton text="회원가입" onPress={() => navigation.navigate("SignUp")} />
        </View>
        <Button title="Reset Password" onPress={resetPassword} color="#f7b267" />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}


