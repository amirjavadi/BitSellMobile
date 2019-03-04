import {Platform, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

let PopupStyle;
export default PopupStyle = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '100%',
    flex: 1,
    padding: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleView: {
    width: '80%',
    height: '22%',
    backgroundColor: '#01b4b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Platform.select({
      ios: {
        fontFamily: 'Vazir-FD',
        fontWeight: 'bold',
        textAlign: 'center'
      },
      android: {
        textAlign: 'center',
        fontFamily: 'Vazir-Bold-FD',
      }
    }),
    color: 'white',
  },
  order: {
    flexDirection: 'row',
    width: '70%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 50,
  },
  orderText: {
    fontFamily: 'Vazir-FD',
    fontSize: 12,
    color: '#333333',
  },
  orderInput: {
    width: '33%',
    height: '40%',
    backgroundColor: 'white',
    textAlign: 'center',
    direction: 'rtl',
    fontSize: 14,
    marginHorizontal: 10,
    fontFamily: 'Vazir-FD',
    borderWidth: 1,
    padding: 0,
  },
  linear: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontSize: 12,
    color: 'white',
    ...Platform.select({
      ios: {
        fontFamily: 'Vazir-FD',
        fontWeight: 'bold',
        textAlign: 'center'
      },
      android: {
        textAlign: 'center',
        fontFamily: 'Vazir-Bold-FD',
      }
    }),
  },
  reng: {
    fontFamily: 'Vazir-FD',
    marginTop: 10,
  },
})
