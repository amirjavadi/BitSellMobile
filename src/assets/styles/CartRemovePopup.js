import {Platform, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

let CartRemovePopup;
export default CartRemovePopup = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '100%',
    flex: 1,
    padding: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6
  },
  order: {
    flexDirection: 'row',
    width: '100%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 30,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  SecondInputIcon: {
    fontSize: 20,
    marginLeft: 3,
    marginRight: 3,
    color: '#757575',
  },
  orderInput: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    textAlign: 'right',
    direction: 'rtl',
    fontSize: 14,
    fontFamily: 'Vazir-FD',
    padding: 0,
    margin: 0,
  },
  linear: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15
  },
  submitText: {
    fontSize: 14,
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
  text: {
    color: '#333333',
    fontSize: 14,
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
  }
})
