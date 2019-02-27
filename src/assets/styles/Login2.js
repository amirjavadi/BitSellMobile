import {Platform, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

let Login2Style;
export default Login2Style = StyleSheet.create({
  background: {
    flex: 1,
    width: deviceWidth,
    resizeMode: 'cover',
  },
  floatView: {
    width: deviceWidth,
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: deviceWidth * 2 / 3,
    height: deviceWidth * 2 /3,
    resizeMode: 'contain',
    marginTop: 20,
  },
  linear: {
    width: deviceWidth * 8 / 10,
    height: 40,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  icon: {
    fontSize: 24,
    color: '#00b5b8',
    backgroundColor: 'white',
    paddingHorizontal: 7,
    paddingTop: 6,
    paddingBottom: 5 + 1 / 2,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  userInput: {
    width: deviceWidth * 8 / 10,
    height: 37,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: 'white',
    textAlign: 'right',
    direction: 'rtl',
    fontSize: 14,
    padding: 0,
    fontFamily: 'Vazir-FD',
  },
  two: {
    borderWidth: 1,
    borderColor: '#787878',
    marginTop: 13,
    backgroundColor: 'white',
  },
  icon1: {
    fontSize: 22,
    marginHorizontal: 8,
    color: '#787878',
  },
  linear1: {
    width: deviceWidth / 3,
    height: 40,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  loginBTN: {
    width: deviceWidth / 3,
    height: 35,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
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
    fontSize: 14,
    color: 'white',
  }
})
