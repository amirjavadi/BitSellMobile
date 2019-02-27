import {Platform, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');
const firstHeight = deviceHeight / 7;

let RegisterStyle;
export default RegisterStyle = StyleSheet.create({
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
    resizeMode: 'contain'
  },
  underLogoView: {
    width: deviceWidth,
    flexDirection: 'row',
    textAlign: 'right',
    direction: 'rtl',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20
  },
  selectPhoto: {
    width: deviceWidth / 5,
    height: deviceWidth / 5,
    borderWidth: 0.5,
    borderColor: '#222222',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectPhotoImage: {
    width: deviceWidth / 5 - 25,
    height: deviceWidth / 5 - 25,
    resizeMode: 'contain',
  },
  selectPhotoImage1: {
    width: deviceWidth / 4,
    height: deviceWidth / 4,
    resizeMode: 'contain'
  },
  photoSelected: {
    width: deviceWidth / 5,
    height: deviceWidth / 5,
    resizeMode: 'contain',
    borderRadius: 4,
  },
  photoSelected1: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 300,
  },
  inputsView: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  gradient: {
    width: deviceWidth * 4 / 5 - 40,
    height: 33,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    marginLeft: 10,
  },
  inputIcon: {
    fontSize: 22,
    color: '#00b5b8',
    backgroundColor: 'white',
    paddingRight: 7,
    paddingTop: 4,
    paddingBottom: 3,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  input: {
    width: deviceWidth * 8 / 10,
    height: 30,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: 'white',
    textAlign: 'right',
    direction: 'rtl',
    fontSize: 12,
    padding: 0,
    fontFamily: 'Vazir-FD',
  },
  input1: {
    height: 28,
    borderRadius: 11,
  },
  inputView: {
    width: deviceWidth * 4 / 5 - 40,
    height: deviceHeight / 19,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    borderWidth: 1,
    borderColor: '#757575',
    marginTop: 6,
    backgroundColor: 'white',
    marginLeft: 10,
  },
  SecondInputIcon: {
    fontSize: 20,
    marginLeft: 8,
    marginRight: 1,
    color: '#757575',
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
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  _reverse: {
    flexDirection: 'row-reverse'
  },
  active: {
    width: 13,
    height: 13,
    borderRadius: 50,
  },
  main: {
    backgroundColor: 'transparent',
    position: 'absolute',
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: deviceHeight - firstHeight,
  },
  buttonWrapperStyle: {
    flexDirection: 'row-reverse',
    height: deviceHeight - 100,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  shopImageView: {
    width: deviceWidth * 33 / 100,
    height: deviceWidth * 33 / 100,
    borderWidth: 0.5,
    backgroundColor: 'white',
    borderColor: '#333333',
    borderRadius: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: deviceHeight / 16
  },
  shopNameView: {
    width: deviceWidth,
    height: deviceHeight / 7,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10
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
    fontSize: 18,
    color: '#333333',
  },
  reg3shopNameView: {
    width: deviceWidth,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  middleView: {
    width: deviceWidth * 8 / 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  reg3row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  marginTop: {
    marginTop: 10,
  },
  inReg3row: {
    width: deviceWidth * 2 / 5 - 5,
    height: deviceHeight / 19,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#999999',
    backgroundColor: 'white',
  },
  reg3inputIcon: {
    fontSize: 15,
    marginLeft: 8,
    color: '#787878',
  },
  reg3input: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    textAlign: 'right',
    direction: 'rtl',
    borderRadius: 20,
    fontSize: 12,
    padding: 0,
    fontFamily: 'Vazir-FD',
  },
  mapView: {
    width: deviceWidth * 8 / 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 5,
  },
  mapText: {
    fontSize: 9,
    fontFamily: 'Vazir-FD',
    color: '#008284',
    marginLeft: 5,
    marginVertical: 5,
  },
  mapBTN: {
    width: '100%',
    height: deviceHeight * 18 / 100,
    borderColor: '#999999',
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  netError: {
    fontFamily: 'Vazir-FD',
    fontSize: 14,
    color: 'red',
  },
  noMapImage: {
    width: '100%',
    height: '59%',
    resizeMode: 'contain',
  },
  mapImage: {
    width: '100%',
    height: deviceHeight * 18 / 100 - 2,
    resizeMode: 'cover',
    borderRadius: 20,
  }
})
