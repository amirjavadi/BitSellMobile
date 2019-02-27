import {Platform, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

let ProfileStyle;
export default ProfileStyle = StyleSheet.create({
  main: {
    width: deviceWidth,
    height: deviceHeight - 30,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  shopImageView: {
    width: deviceWidth * 25 / 100,
    height: deviceWidth * 25 / 100,
    borderWidth: 0.5,
    backgroundColor: 'white',
    borderColor: '#333333',
    borderRadius: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: deviceHeight / 22
  },
  photoSelected1: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 300,
  },
  underImage: {
    width: '90%',
    paddingHorizontal: 10,
    flexDirection: 'column',
  },
  SecondInputIcon: {
    fontSize: 20,
    marginLeft: 3,
    marginRight: 3,
    color: '#757575',
  },
  mapBTN: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 19,
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
  itemView: {
    width: '90%',
    flexDirection: 'row',
    borderBottomColor: '#aaaaaa',
    borderBottomWidth: 1,
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  mapView: {
    width: '100%',
    height: deviceHeight * 18 / 100,
    borderColor: '#999999',
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 20,
  },
  itemInput: {
    width: deviceWidth - 110,
    height: 30,
    paddingHorizontal: 0,
    paddingVertical: 3,
    textAlign: 'right',
    direction: 'rtl',
  },
  lin: {
    flex: 0.4,
    marginTop: 20,
    borderRadius: 15,
    zIndex: 15,
    alignItems: 'center',
  },
  lin1: {
    flex: 0.9,
    marginTop: 20,
    borderRadius: 15,
    zIndex: 15,
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Vazir-FD',
    fontSize: 14,
    color: '#333333',
  },
  orderInput: {
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: 'Vazir-FD',
    padding: 0,
    margin: 0,
    width: deviceWidth - 110,
    height: 30,
    paddingHorizontal: 0,
    paddingVertical: 3,
    textAlign: 'right',
    direction: 'rtl',
  },
  noPhotoSelected: {
    width: '60%',
    height: '80%',
    resizeMode: 'contain',
  },
})
