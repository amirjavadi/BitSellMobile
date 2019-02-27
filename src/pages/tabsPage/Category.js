import React from 'react';
import {View, Text, Container, Content, Spinner, Button} from 'native-base';
import {AsyncStorage, BackHandler, Dimensions, FlatList, Image, Platform, StatusBar, TouchableNativeFeedback} from 'react-native';
import Header from '../../components/sections/Header';
import {Actions} from 'react-native-router-flux';
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';
import {encode} from 'base-64';
import axios from 'axios';
import api from '../../api';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Lists extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      category: [],
      noData: false,
    }
  }

  async componentDidMount() {
    await AsyncStorage.getItem('data').then(res => {
      let response = JSON.parse(res);
      this.setState({ISO: response})
    });
    if (!global.btoa) {
      global.btoa = encode;
    }
    let headers = {
      'Authorization': 'Basic ' + btoa(this.state.ISO),
    };
    let category = [];
    axios.get(api.url + '/api/Category/GetCategories?$select=Id,Title', {headers: headers})
      .then((response) => {
        if (response.data.length < 1 ){
          this.setState({noData: true})
        } else {
          for (let i = 0; i < response.data.length; i++) {
            let obj = {
              id: response.data[i].id,
              titleCategory: response.data[i].title,
            };
            category.push(obj);
          }
          this.setState({category: category});
        }
      })
      .catch((error) => {
        console.info(error)
      })
  }

  check(item) {
    if (Actions.currentScene === 'productList') {

    } else {
      Actions.productList({item: item})
    }
  }

  renderProducts(item){
    return(
      <TouchableNativeFeedback underlayColor="#f8f8f8" onPress={() => this.check(item)}>
        <View style={{width: deviceWidth - 30, height: deviceHeight / 20 + 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 50, backgroundColor: 'white', marginTop: 4, marginBottom: 4, paddingHorizontal: 10}}>
          <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: 'black', marginHorizontal: 5}}>{item.titleCategory}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render(){
    return(
      <Container>
        <StatusBar
          backgroundColor="#404e67"
          barStyle="light-content"
        />
        <Header name="دسته بندی محصولات"/>
        <Content>
          <View style={{display: 'flex', flex: 1, width: deviceWidth, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#dddddd'}}>
            <Image source={require('../../pictures/products_background.png')} style={{flex: 1, width: deviceWidth, height: deviceHeight - 124, resizeMode: 'cover'}}/>
            <View style={{position: 'absolute', width: deviceWidth - 16, height: deviceHeight - 145, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 15, marginTop: 10, paddingTop: 5, paddingBottom: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
              {this.state.noData &&
              <View style={{width: deviceWidth, height: deviceHeight - 135, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 12, color: 'red', fontFamily: 'Vazir-FD'}}>چیزی پیدا نشد.</Text>
              </View>}
              {!this.state.noData &&
              <FlatList
                data={this.state.category}
                renderItem={({item}) => this.renderProducts(item)}
                keyExtractor={(item, index) => index.toString()}
                style={{marginTop: 2, marginBottom: 2}}
                ListEmptyComponent={() => <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center', marginTop: deviceHeight / 2 - 130}}/>
                    <Text style={{fontSize: 10, color: '#333333', fontFamily: 'Vazir-FD', marginTop: 5}}>لطفا کمی صبر کنید...</Text>
                  </View>}
              />}
            </View>
          </View>
        </Content>
      </Container>
    )
  }
}
