import React from 'react';
import {Container} from 'native-base';
import {AsyncStorage, Dimensions, BackHandler} from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import customMarker from './../pictures/marker1.png';
import {Actions} from 'react-native-router-flux';
import {captureScreen} from 'react-native-view-shot';
import Header from '../components/sections/Header';

MapboxGL.setAccessToken('pk.eyJ1Ijoic2hhaGFiMjEwMSIsImEiOiJjanBvMnk4YWgwOHZmNDJxam13OWh1a3VjIn0.EDIlLdfRNOk_iCfgOGnEXQ');

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class map extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      center: [55.996493, 30.394711],
      GeoJSON: {},
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.tes(); // works best when the goBack is async
    return true;
  };

  tes(){
    this.setState({ center: this.state.GeoJSON.geometry.coordinates});
    captureScreen({
      format: "jpg",
      quality: 0.8
    }).then(
      uri => this.props.mapUrl(JSON.stringify(uri))
    );
    Actions.pop()
  }

  componentWillMount(){
    AsyncStorage.getItem('location').then((response) => {
      if (response !== null || response !== {}){
        this.setState({GeoJSON: JSON.parse(response)})
      }
    })
  }

  marker(){
    return(
    <MapboxGL.ShapeSource id="marker-source" shape={this.state.GeoJSON}>
      <MapboxGL.SymbolLayer id="marker-style-layer" style={{ iconImage: customMarker, iconSize: 0.4}} />
    </MapboxGL.ShapeSource>)
  }

  componentWillUnmount(){
    AsyncStorage.setItem('location', JSON.stringify(this.state.GeoJSON));
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    // const uri = MapboxGL.snapshotManager.takeSnap({
    //   centerCoordinate: this.state.GeoJSON.geometry.coordinates,
    //   width: deviceWidth * 8 / 10,
    //   height: deviceHeight * 20 / 100,
    //   zoomLevel: 14,
    //   styleURL: MapboxGL.StyleURL.Street,
    //   writeToDisk: true,
    // });
  }

  renderMarker(event){
    this.setState({GeoJSON: event, ok: true});
  }

  render(){
    return(
      <Container>
        <MapboxGL.MapView
          styleURL={MapboxGL.StyleURL.Street}
          zoomLevel={12}
          centerCoordinate={this.state.center}
          style={{flex: 1}}
          getDrawableCache={true}
          onLongPress={this.renderMarker.bind(this)}>
          {this.marker()}
        </MapboxGL.MapView>
      </Container>
    )
  }
}
