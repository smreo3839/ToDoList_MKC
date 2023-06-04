import { Button, View, TextInput, Text } from 'react-native';
import React from 'react';
import AppStyles from '../styles/AppStyles';
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { signOut, updatePassword, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import StyledButton from '../components/StyledButton';

export default function ManageAccount({ navigation }) {

  let [newPassword, setNewPassword] = React.useState("");// 새로운 비밀번호
  let [currentPassword, setCurrentPassword] = React.useState("");// 현재 비밀번호

  let [errorMessage, setErrorMessage] = React.useState("");

  // 사용자가 로그아웃을 요청할 경우 로그아웃하고 초기 화면으로 이동
  let logout = () => {
    signOut(auth).then(() => {
      navigation.popToTop();
    });
  }

  // 사용자가 비밀번호를 변경을 요청할 경우, 비밀번호를 변경
  let updateUserPassword = () => {
    signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        updatePassword(user, newPassword).then(() => {
          setNewPassword("");
          setErrorMessage("");
          setCurrentPassword("");
          alert("비밀번호 변경완료");
        }).catch((error) => {
          setErrorMessage("유효한 값을 입력하세요");
        });
      })
      .catch((error) => {
        setErrorMessage("유효한 값을 입력하세요");
      });
  };

  // 사용자가 계정을 삭제를 요청할 경우, 계정과 관련된 데이터를 모두 삭제
  let deleteUserAndToDos = () => {
    if (currentPassword === "") {
      setErrorMessage("계정을 삭제하려면 현재 암호를 입력해야 합니다");
    } else {
      signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
        .then((userCredential) => {
          const user = userCredential.user;

          // 사용자의 모든 ToDo를 가져와서 삭제
          let batch = writeBatch(db);
          const q = query(collection(db, "todos"), where("userId", "==", user.uid));
          getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              batch.delete(doc.ref);
            });
            batch.commit();

            // 사용자 계정을 삭제
            deleteUser(user).then(() => {
              navigation.popToTop();
            }).catch((error) => {
              setErrorMessage(error.message);
            });
          });
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    }
  };

  return (
    <View style={AppStyles.container}>
      <Text style={AppStyles.errorText}>{errorMessage}</Text>
      <TextInput
        style={[AppStyles.textInput, AppStyles.darkTextInput]}
        placeholder='기존 비밀번호'
        value={currentPassword}
        secureTextEntry={true}
        onChangeText={setCurrentPassword} />
      <TextInput
        style={[AppStyles.textInput, AppStyles.darkTextInput]}
        placeholder='새로운 비밀번호'
        value={newPassword}
        secureTextEntry={true}
        onChangeText={setNewPassword} />
      <StyledButton title="비밀번호 변경" onPress={updateUserPassword} />
      <StyledButton title="회원탈퇴" onPress={deleteUserAndToDos} />
      <StyledButton title="로그아웃" onPress={logout} />
      <StyledButton title="돌아가기" onPress={() => navigation.pop()} />
    </View>
  );
}
