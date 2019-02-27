import React from 'react';
import {Dimensions, FlatList, StatusBar, TouchableNativeFeedback, AppState, AsyncStorage} from 'react-native';
import {View, Text, Container, Content, Spinner, Thumbnail} from 'native-base';
import Header from '../../components/sections/Header';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import api from '../../api';
import {DotIndicator} from 'react-native-indicators';
import {encode} from 'base-64';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Brands extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      ISO: '',
      brands: [],
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
    let brands = [];
    axios.get(api.url + '/api/Brand/Brands?$select=Id,ImageBrand,TitleBrand', {headers: headers})
      .then((response) => {
        if (response.data.length < 1 ){
          this.setState({noData: true})
        } else {
          for (let i = 0; i < response.data.length; i++) {
            let obj = {
              id: response.data[i].id,
              imageBrand: api.web + response.data[i].imageBrand.replace(/^~+/i, ''),
              titleBrand: response.data[i].titleBrand,
            };
            brands.push(obj);
          }
          this.setState({brands: brands});
        }
      })
      .catch((error) => {
        console.info(error)
      })
  }

  check(item){
    if (Actions.currentScene === 'categories'){

    } else {
      Actions.categories({brandTitle: item.titleBrand, brandId: item.id})
    }
  }

  renderBrands(item){
    return(
      <TouchableNativeFeedback underlayColor="#f8f8f8" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', borderRadius: 15}} onPress={() => this.check(item)}>
          <View style={{width: deviceWidth / 3 - 23, height: deviceWidth / 3 - 23, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 15, margin: 5}}>
            <Thumbnail square source={{uri:  item.imageBrand}} style={{width: deviceWidth / 3 - 35, height: deviceWidth / 3 - 35, resizeMode: 'contain'}}/>
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
        <Header name="برندها"/>
        <Content style={{backgroundColor: '#dddddd'}}>
          <View style={{paddingVertical: 20, paddingHorizontal: 20, backgroundColor: '#dddddd'}}>
            {this.state.noData &&
            <View style={{width: deviceWidth, height: deviceHeight -135, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 12, color: 'red', fontFamily: 'Vazir-FD'}}>چیزی پیدا نشد.</Text>
            </View>}
            {!this.state.noData &&
            <FlatList
              data={this.state.brands}
              renderItem={({item}) => this.renderBrands(item)}
              keyExtractor={(item) => item.id}
              numColumns={3}
              ListEmptyComponent={<View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center', marginTop: deviceHeight / 2 - 130}}/>
                  <Text style={{fontSize: 10, color: '#333333', fontFamily: 'Vazir-FD', marginTop: 5}}>لطفا کمی صبر کنید...</Text>
              </View>}
            />}
          </View>
        </Content>
      </Container>
    )
  }
}
