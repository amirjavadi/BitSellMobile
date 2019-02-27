import React from 'react';
import {Icon, Input, Text, View} from 'native-base';
import {TouchableOpacity} from 'react-native';
import BaseLightbox from './lightbox/BaseLightbox';
import LinearGradient from "react-native-linear-gradient";
import ProfilePopup from './../assets/styles/ProfilePopup';
import axios from 'axios';
import api from './../api';
import {Actions} from 'react-native-router-flux';

export default class Popup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nikeName: '',
    }
  }

  sendToServer(name){

  }

  componentDidMount() {
    switch (this.props.name) {
      case 'nikeName' :
        this.setState({nikeName: this.props.value});
        break;
      case 'userName' :
        this.setState({userName: this.props.value});
        break;
      case 'address' :
        this.setState({address: this.props.value});
        break;
    }
  }

  change(name, text) {
    switch (name) {
      case 'nikeName' :
        this.setState({nikeName: text});
        break;
      case 'userName' :
        this.setState({userName: text});
        break;
      case 'address' :
        this.setState({address: text});
        break;
    }
  }

  render() {
    return (
      <BaseLightbox verticalPercent={0.7} horizontalPercent={0.26} close={false} backgroundColor={'rgba(52,52,52,0.5)'}>
        <View style={ProfilePopup.mainView}>
          <View style={ProfilePopup.order}>
            <Icon type="MaterialCommunityIcons" name="account" style={ProfilePopup.SecondInputIcon} />
            <Input type="text" style={ProfilePopup.orderInput} value={this.state.value} onChangeText={(text) => this.change(this.props.name, text)}/>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={{width: '45%', height: 40, borderRadius: 15}} onPress={() => this.sendToServer(this.props.name)}>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#148e91', '#2a6e85', '#3b527b']} style={ProfilePopup.linear}>
              <Text style={ProfilePopup.submitText}>ثبت</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </BaseLightbox>
    )
  }
}
