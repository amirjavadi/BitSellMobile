import {Platform, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');
const firstHeight = deviceHeight / 7;

let ForgetPassStyle;
export default ForgetPassStyle = StyleSheet.create({
  background: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight - 30,
    resizeMode: 'cover'
  },
  overlayView: {
    width: deviceWidth,
    height: deviceHeight - 30,
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: deviceWidth * 2 / 3,
    height: deviceWidth * 2 /3,
    resizeMode: 'contain',
  },
  buttonGradient: {
    width: deviceWidth / 3,
    height: 40,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
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
    }), fontSize: 14, color: 'white'
  },
  text: {
    fontFamily: 'Vazir-FD',
    fontSize: 15,
    color: '#333333'
  },
  text1: {
    fontFamily: 'Vazir-FD',
    color: '#666666',
    fontSize: 13,
  },
  shopNameView: {
    width: deviceWidth,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  linear: {
    width: deviceWidth * 2 / 5,
    height: deviceHeight / 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#757575',
    padding: 1.5,
  },
  Slide2Input: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 12,
    fontFamily: 'Vazir-FD',
    fontSize: 16,
    color: '#333333',
  },
})
