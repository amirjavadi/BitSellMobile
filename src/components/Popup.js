import React from 'react';
import {Input, Text, View} from 'native-base';
import {TouchableOpacity} from 'react-native';
import BaseLightbox from './lightbox/BaseLightbox';
import LinearGradient from "react-native-linear-gradient";
import PopupStyle from './../assets/styles/Popup';
import {connect} from 'react-redux';
import {addCart} from '../redux/actions';
import {Actions} from 'react-native-router-flux';

class Popup extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			count: '',
		}
	}

	async addToCart() {
    await this.props.addCart(this.props.brandTitle, this.props.productImage, this.props.productTitle, this.props.productId, this.props.groupTitle, this.props.groupId, this.props.daysTitle, this.props.groupPrice, this.props.tariffId, parseInt(this.state.count), this.props.lockProducts);
		Actions.pop('popup')
	}

	render() {
		return (
      <BaseLightbox verticalPercent={0.8} horizontalPercent={0.26} close={false} backgroundColor={'rgba(52,52,52,0.6)'}>
        <View style={PopupStyle.mainView}>
					<View style={PopupStyle.titleView}>
						<Text style={[PopupStyle.title,{fontSize: this.props.groupTitle.length > 20 ? 12 : 14}]}>{this.props.groupTitle}</Text>
					</View>
					<View style={PopupStyle.order}>
						<Text style={PopupStyle.orderText}>تعداد سفارش</Text>
            <Input keyboardType="numeric" type="number" style={PopupStyle.orderInput} onChangeText={(text) => this.setState({count: text})}/>
					</View>
					<TouchableOpacity activeOpacity={0.7} style={{width: '60%', height: '22%'}} onPress={() => this.addToCart()}>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#00b5b8', '#189295', '#2a7a7b']} style={PopupStyle.linear}>
            	<Text style={PopupStyle.submitText}>ثبت</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
      </BaseLightbox>
		)
	}
}


const mapDispatchToProps = (dispatch) => {
  return {
    addCart: (brandTitle, productImage, productTitle, productId, groupTitle, groupId, daysTitle, groupPrice, tariffId, count, lockProducts) => dispatch(addCart(brandTitle, productImage, productTitle, productId, groupTitle, groupId, daysTitle, groupPrice, tariffId, count, lockProducts)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Popup);
