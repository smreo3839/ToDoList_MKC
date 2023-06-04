import { StyleSheet } from 'react-native';

const TOdoStyles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 8,
    borderColor: '#2E9AFE',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  rightAligned: {
    justifyContent: 'flex-end',
  },
  rightMargin: {
    marginRight: 15,
  },
  leftMargin: {
    marginLeft: 15,
  },
  topMargin50: {
    marginTop: 50,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2E9AFE',
  },
  fillSpace: {
    flex: 1,
  },
});

export default TOdoStyles;
