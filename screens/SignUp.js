import { Text, View, TextInput, ImageBackground, Button, KeyboardAvoidingView, Platform } from 'react-native';
import AppStyles from '../styles/AppStyles';
import InlineTextButton from '../components/InlineTextButton';
import React from 'react';
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";


export default function SignUp({ navigation }) {
  const background = require("../assets/background.jpg"); // 배경 이미지 로드

  // 이메일, 암호, 암호 확인 및 유효성 검사 메시지 상태 생성
  let [email, setEmail] = React.useState("");
  let [password, setPassword] = React.useState("");
  let [confirmPassword, setConfirmPassword] = React.useState("");
  let [validationMessage, setValidationMessage] = React.useState("");

  // 비밀번호의 일치성을 확인하고 상태를 설정하는 함수 정의
  let validateAndSet = (value, valueToCompare, setValue) => {
    if (value !== valueToCompare) {
      setValidationMessage("패스워드가 일치하지 않습니다");
    } else {
      setValidationMessage("");
    }

    setValue(value);
  };

  // 회원 가입을 처리하는 함수 정의
  let signUp = () => {
    if (password === confirmPassword) { // 암호와 암호 확인이 일치하는지 확인
      createUserWithEmailAndPassword(auth, email, password) // Firebase auth에서 제공하는 함수로 이메일과 암호를 사용해 사용자를 생성
        .then((userCredential) => {
          sendEmailVerification(auth.currentUser) // 사용자에게 이메일 인증 메시지를 보냄
            .then(() => {
              console.log("checkEmailVerification");
              checkEmailVerification(userCredential.user); // 이메일 인증이 완료되었는지 확인하는 함수 호출
            })
            .catch((error) => {
              setValidationMessage(error.message); // 이메일 인증 메시지 발송 중 오류 발생 시 에러 메시지 설정
            });
        })
        .catch((error) => {
          setValidationMessage(error.message); // 사용자 생성 중 오류 발생 시 에러 메시지 설정
        });
    }
  }

  // 이메일 인증이 완료되었는지 확인하는 함수
  let checkEmailVerification = (user) => {
    user.reload() // 사용자 정보를 새로고침
      .then(() => {
        if (user.emailVerified) { // 이메일 인증이 완료되었는지 확인
          navigation.navigate("ToDo", { user: user }); // 이메일 인증이 완료되면 ToDo 페이지로 이동
        } else {
          // 아직 이메일 인증이 완료되지 않았으면 1초 후에 다시 이 함수를 호출
          console.log("이메일 인증 확인 안됨");
          setTimeout(() => {
            checkEmailVerification(user);
          }, 1000);
        }
      });
  }

  return (
    <ImageBackground style={AppStyles.imageContainer} source={background}>
      <KeyboardAvoidingView
        style={AppStyles.backgroundCover}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={60}>
        <Text style={[AppStyles.lightText, AppStyles.header]}>Sign Up</Text>
        <Text style={[AppStyles.errorText]}>{validationMessage}</Text>
        <TextInput
          style={[AppStyles.textInput, AppStyles.lightTextInput, AppStyles.lightText]}
          placeholder='이메일'
          placeholderTextColor="#BEBEBE"
          value={email}
          onChangeText={setEmail} />
        {/* 이메일 입력란 렌더링 */}
        <TextInput
          style={[AppStyles.textInput, AppStyles.lightTextInput, AppStyles.lightText]}
          placeholder='패스워드'
          placeholderTextColor="#BEBEBE"
          secureTextEntry={true}
          value={password}
          onChangeText={(value) => validateAndSet(value, confirmPassword, setPassword)} />
        {/* 비밀번호 입력란 렌더링 */}
        <TextInput
          style={[AppStyles.textInput, AppStyles.lightTextInput, AppStyles.lightText]}
          placeholder='패스워드 확인'
          placeholderTextColor="#BEBEBE"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(value) => validateAndSet(value, password, setConfirmPassword)} />
        {/* 비밀번호 확인 입력란 렌더링 */}
        <View style={[AppStyles.rowContainer, AppStyles.topMargin]}>
          <Text style={AppStyles.lightText}>이미 계정이 있나요?   </Text>
          <InlineTextButton text="로그인" onPress={() => navigation.popToTop()} />
          {/*로그인 버튼을 누르면 처음 화면으로 돌아감 */}
        </View>
        <Button title="회원가입" onPress={signUp} color="#f7b267" />
        {/*회원가입 버튼을 누르면 signUp 함수를 호출하여 회원가입 진행 */}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}