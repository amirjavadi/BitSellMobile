import {Platform, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

let HeaderStyle;
export default HeaderStyle = StyleSheet.create({
  main: {
    width: deviceWidth,
    height: 50,
    backgroundColor: '#404e67',
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    color: 'white',
    ...Platform.select({
      ios: {
        fontFamily: 'Vazir-FD',
        fontWeight: 'bold'
      },
      android: {
        fontFamily: 'Vazir-Bold-FD',
      }
    })
  },
  right: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  searchButton: {
    marginRight: 10,
    color: 'white',
    fontSize: 24,
  },
  cartButton: {
    marginLeft: 10,
    marginRight: 17,
    color: 'white',
    fontSize: 24,
  }
})
