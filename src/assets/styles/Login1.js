import {Platform, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

let Login1Style;
export default Login1Style = StyleSheet.create({
  background: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight - 25,
    resizeMode: 'cover'
  },
  floatView: {
    width: deviceWidth,
    height: deviceHeight - 100,
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
  fBTN: {
    width: deviceWidth * 8 / 10,
    height: 40,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    marginHorizontal: 5,
    color: 'white',
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
  },
  sBTN: {
    width: deviceWidth * 8 / 10,
    height: 40,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: 'white'
  }
})
