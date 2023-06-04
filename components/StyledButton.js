// StyledButton.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const StyledButton = ({ title, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            width: 200, // 이 줄을 추가하여 버튼의 너비를 고정합니다.
            alignItems: 'center',
            justifyContent: 'center', // 텍스트를 버튼의 중앙에 배치합니다.
            backgroundColor: '#f7b267',
            padding: 10,
            margin: 10,
            borderRadius: 5
        }}>
        <Text style={{ color: 'white', fontSize: 18 }}>{title}</Text>
    </TouchableOpacity>
);

export default StyledButton; // StyledButton 컴포넌트를 내보냄
