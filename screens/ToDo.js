import { View, Button, ImageBackground, Text, Modal, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import InlineTextButton from '../components/InlineTextButton';
import AppStyles from '../styles/AppStyles';
import TOdoStyles from '../styles/TOdoStyles';
import { auth, db } from "../firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { sendEmailVerification } from 'firebase/auth';
import React from 'react';
import AddToDoModal from '../components/AddToDoModal';
import BouncyCheckbox from 'react-native-bouncy-checkbox';


export default function ToDo({ navigation }) {
  // 배경 이미지
  const background = require("../assets/todoList.jpg");

  let [modalVisible, setModalVisible] = React.useState(false); // modalVisible은 할 일을 추가하는 모달의 표시 상태를 관리
  let [isLoading, setIsLoading] = React.useState(true); // isLoading은 데이터를 로딩하는 동안 Spinner를 표시하기 위한 상태를 관리
  let [isRefreshing, setIsRefreshing] = React.useState(false); // isRefreshing은 pull-to-refresh 기능의 상태를 관리
  let [toDos, setToDos] = React.useState([]); // toDos는 할 일 목록을 관리

  // Firestore에서 사용자의 할 일 목록을 로드하는 함수를 정의
  let loadToDoList = async () => {
    const q = query(collection(db, "todos"), where("userId", "==", auth.currentUser.uid));

    const querySnapshot = await getDocs(q);
    let toDos = [];
    querySnapshot.forEach((doc) => {
      let toDo = doc.data();
      toDo.id = doc.id;
      toDos.push(toDo);
    });

    setToDos(toDos); // 로드된 할 일 목록을 상태에 저장
    setIsLoading(false); // 데이터 로딩이 완료되었음을 나타내는 상태
    setIsRefreshing(false); // 데이터 로딩이 완료되었음을 나타내는 상태
  };

  // isLoading 상태가 true일 경우, 할 일 목록을 로드
  if (isLoading) {
    loadToDoList();
  }

  // 할 일 항목의 완료 상태를 업데이트하는 함수를 정의
  let checkToDoItem = (item, isChecked) => {
    const toDoRef = doc(db, 'todos', item.id);
    setDoc(toDoRef, { completed: isChecked }, { merge: true });
  };

  // 특정 할 일 항목을 삭제하는 함수를 정의
  let deleteToDo = async (toDoId) => {
    await deleteDoc(doc(db, "todos", toDoId)); // Firestore에서 해당 항목을 삭제
    let updatedToDos = [...toDos].filter((item) => item.id != toDoId); // 로컬 상태에서 해당 항목을 삭제
    setToDos(updatedToDos); // 업데이트된 할 일 목록을 상태에 저장
  };

  // 각 할 일 항목을 렌더링하는 함수를 정의
  let renderToDoItem = ({ item }) => {
    return (
      <View style={[AppStyles.rowContainer, AppStyles.rightMargin, AppStyles.leftMargin]}>
        <View style={AppStyles.fillSpace}>
          <BouncyCheckbox
            isChecked={item.complated}
            size={25}
            fillColor="#258ea6"
            unfillColor="#FFFFFF"
            text={item.text}
            iconStyle={{ borderColor: "#258ea6" }}
            onPress={(isChecked) => { checkToDoItem(item, isChecked) }}
          />
        </View>
        <InlineTextButton text="삭제" color="#258ea6" onPress={() => deleteToDo(item.id)} />
      </View>
    );
  }

  // 할 일 목록을 렌더링하는 함수를 정의
  let showToDoList = () => {
    return (
      <FlatList
        data={toDos}
        refreshing={isRefreshing}
        onRefresh={() => {
          loadToDoList();
          setIsRefreshing(true);
        }}
        renderItem={renderToDoItem}
        keyExtractor={item => item.id}
        style={{ backgroundColor: '#FFFFFF' }}
      />
    )
  };

  // 할 일 목록이 로딩 중일 때를 렌더링하는 함수를 정의
  let showContent = () => {
    return (
      <View>
        {/*로딩 중일 때는 ActivityIndicator를 보여줌, 아니면 할 일 목록을 렌더링 */}
        {isLoading ? <ActivityIndicator size="large" /> : showToDoList()}
        <Button
          title="할일 추가"
          onPress={() => setModalVisible(true)}
          color="#2E9AFE" />
      </View>
    );
  };

  // 사용자에게 이메일을 인증하도록 요청하는 메시지를 렌더링하는 함수를 정의
  let showSendVerificationEmail = () => {
    return (
      <View>
        <Text>계속하시려면 이메일을 확인하십시오   </Text>
        <Button title="이메일 재전송" onPress={() => sendEmailVerification(auth.currentUser)} />
        <Button title="로그인" onPress={() => navigation.navigate("Login")} />
      </View>
    );
  };

  // 새로운 할 일 항목을 추가하는 함수를 정의
  let addToDo = async (todo) => {
    let toDoToSave = {
      text: todo,
      completed: false,
      userId: auth.currentUser.uid
    };
    const docRef = await addDoc(collection(db, "todos"), toDoToSave); // Firestore에 새로운 할 일 항목을 추가

    toDoToSave.id = docRef.id;

    let updatedToDos = [...toDos];
    updatedToDos.push(toDoToSave); // 로컬 상태에 새로운 할 일 항목을 추가

    setToDos(updatedToDos); // 업데이트된 할 일 목록을 상태에 저장
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.1 )' }}>
          <View style={[AppStyles.rowContainer, AppStyles.rightAligned, AppStyles.rightMargin, AppStyles.topMargin50]}>
            <InlineTextButton text="설정" color="#258ea6" onPress={() => navigation.navigate("ManageAccount")} />
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <AddToDoModal
              onClose={() => setModalVisible(false)}
              addToDo={addToDo} />
          </Modal>
          <Text style={TOdoStyles.header}>ToDoList</Text>
          {auth.currentUser.emailVerified ? showContent() : showSendVerificationEmail()}
        </View>
      </ImageBackground>
    </SafeAreaView>
  )

}