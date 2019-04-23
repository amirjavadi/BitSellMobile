import React from 'react';
import {Icon, Input, Text, View} from 'native-base';
import {TouchableOpacity} from 'react-native';
import BaseLightbox from './lightbox/BaseLightbox';
import LinearGradient from "react-native-linear-gradient";
import CartRemovePopup from '../assets/styles/CartRemovePopup';
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

  render() {
    return (
      <BaseLightbox verticalPercent={0.7} horizontalPercent={0.26} close={false} backgroundColor={'rgba(52,52,52,0.5)'}>
        <View style={CartRemovePopup.mainView}>
          <View style={CartRemovePopup.order}>
            <Text style={CartRemovePopup.text}>محصول حذف شود؟</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity activeOpacity={0.7} style={{width: '45%', height: 40, borderRadius: 15}} onPress={() => this.sendToServer(this.props.name)}>
              <Text style={CartRemovePopup.submitText}>ثبت</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={{width: '45%', height: 40, borderRadius: 15}} onPress={() => Actions.pop()}>
              <Text style={CartRemovePopup.submitText}>انصراف</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BaseLightbox>
    )
  }
}
