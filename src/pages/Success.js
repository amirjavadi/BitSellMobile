import React from 'react';
import Header from '../components/sections/Header';
import {Container, Content, Icon, View, Text} from 'native-base';
import {TouchableOpacity, BackHandler, Dimensions, StatusBar} from 'react-native';
import {removeCart, removeHoleCart} from '../redux/actions';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

class Success extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
    this.props.removeHoleCart();
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress.bind(this));
  }

  handleBackPress() {
    return true
  };

  render() {
    return(
      <Container>
        <StatusBar
          backgroundColor="#404e67"
          barStyle="light-content"
        />
        <Header name="پرداخت در محل" screen="cart"/>
        <Content>
          <View style={{width: deviceWidth, height: deviceHeight - 75, alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: '#e4e4e4'}}>
            <Icon type="MaterialCommunityIcons" name="check-all" style={{fontSize: 44, color: 'green'}}/>
            <Text style={{fontFamily: 'Vazir-FD', color: '#333333', fontSize: 18}}>خرید شما با موفقیت ثبت شد.</Text>
            <Text style={{fontFamily: 'Vazir-FD', color: '#333333', fontSize: 16, marginTop: 10}}>کد پیگیری شما:</Text>
            <Text style={{fontFamily: 'Vazir-FD', color: 'green', fontSize: 20, marginTop: 5}}>{this.props.response.data[0]}</Text>
            <TouchableOpacity activeOpacity={0.7} style={{width: deviceWidth / 4, height: deviceHeight / 18, borderWidth: 1, borderColor: 'green', alignItems: 'center', justifyContent: 'center', marginTop: 20, borderRadius: 5}} onPress={() => Actions.reset('tabBar')}>
              <Text style={{fontFamily: 'Vazir-FD', color: 'green', fontSize: 14}}>تایید</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeHoleCart: () => dispatch(removeHoleCart()),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Success);
