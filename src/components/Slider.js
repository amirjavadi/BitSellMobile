import React from 'react';
import {Dimensions, FlatList, Image, View, Platform, TouchableOpacity} from "react-native";
import {Button, Icon, Text} from "native-base";

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Slider extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			interval: null,
			index: -1,
			data: [
        {
          url: require('./../pictures/breakfast.jpeg'),
        }, {
          url: require('./../pictures/cheese.jpg'),
        }, {
          url: require('./../pictures/cheese1.jpg'),
        },
			],
			ios: false,
			android: false,
		}
	}

    componentWillMount(){
	    if (Platform.OS === 'ios'){
		    this.setState({
			    ios: true,
			    android: false
		    });
	    }else {
		    this.setState({
			    ios: false,
			    android: true
		    });
	    }
        this.initSlider();
    }

    componentWillUnmount() {
      clearInterval(this.state.interval);
		}

    initSlider() {
			this.setState({
				interval: setInterval(() => {
						this.scrollIndex()
				}, 2800)
			});
    }

    renderItem(item, index) {
        return(
			<View key={index} style={{width: deviceWidth, height: deviceHeight * 3 / 10}}>
				<Image style={{width: '100%', height: '100%', resizeMode: 'cover'}} source={item.url}/>
			</View>
        )
    }

	scrollIndex = () => {
        let position = this.state.index + 1;
        position = position > 2 ? 0 : position;
        this.flatListRef.scrollToIndex({animated: true, index: position});
        this.setState({index: position});
    };

    nSlide() {
        clearInterval(this.state.interval);
        let position = this.state.index;
        if (position === -1) {
            this.flatListRef.scrollToIndex({animated: true, index: 0});
            this.setState({index: 0}, () => this.initSlider());
            return;
		}
        position += 1;
        if (position === 3) {
            this.flatListRef.scrollToIndex({animated: true, index: 0});
            this.setState({index: 0}, () => this.initSlider());
            return;
		}
        this.flatListRef.scrollToIndex({animated: true, index: position});
        this.setState({index: position}, () => this.initSlider());
    }

	pSlide() {
        clearInterval(this.state.interval);
        let position = this.state.index;
        if (position === -1) {
            this.flatListRef.scrollToIndex({animated: true, index: 1});
            this.setState({index: 1}, () => this.initSlider());
            return;
        }
        position -= 1;
        if (position === -1) {
            this.flatListRef.scrollToIndex({animated: true, index: 2});
            this.setState({index: 2}, () => this.initSlider());
            return;
        }
        this.flatListRef.scrollToIndex({animated: true, index: position});
        this.setState({index: position}, () => this.initSlider());
    }

  _renderIndicators(data) {
      return (
        <View style={{alignItems: 'center', justifyContent: 'flex-end'}}>
          <FlatList
            horizontal
            style={{position: 'absolute', zIndex: 500, paddingBottom: 5,}}
            renderItem={({item, index}) => this._renderActiveIndicator(item, index)}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            ref={(ref) => { this.flatList = ref; }}
          />
        </View>
      );
  }

  _renderActiveIndicator(item, index) {
    if (this.state.index === index) {
      return (
        <TouchableOpacity style={{marginHorizontal: 2}}>
          <Icon name="circle" type="FontAwesome" style={{fontSize: 14, color: 'rgba(255,255,255,1)'}} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={{marginHorizontal: 2}}>
          <Icon name="circle" type="FontAwesome" style={{fontSize: 14, color: 'rgba(125,125,125,0.4)'}} />
        </TouchableOpacity>
      );
    }
  }

	render(){
		return(
			<View style={{height: deviceHeight*3/10}}>
				<FlatList
					style={{height: deviceHeight*3/10}}
					data={this.state.data}
					horizontal={true}
					renderItem={({item}, index) => this.renderItem(item, index)}
					keyExtractor={(item, index) => index.toString()}
					scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
					ref={(ref) => { this.flatListRef = ref; }}/>
        {this._renderIndicators(this.state.data)}
				{this.state.ios && <View style={{position: 'absolute', width: '100%', top: deviceHeight*3/2/10, marginTop: -10, justifyContent: 'space-between', flexDirection: 'row'}}>
					<Button small transparent style={{justifyContent: 'flex-start', alignItems: 'center'}}>
						<Icon onPress={this.nSlide.bind(this)} name="right" ios="ios-arrow-dropright-circle" android="md-arrow-dropright-circle" style={{fontSize: 24, color: 'black', opacity: 0.4}}/>
					</Button>
					<Button small transparent style={{justifyContent: 'flex-end', alignItems: 'center'}}>
						<Icon onPress={this.pSlide.bind(this)} name="left" ios="ios-arrow-dropleft-circle" android="md-arrow-dropleft-circle" style={{fontSize: 24, color: 'black', opacity: 0.4}}/>
					</Button>
				</View>}
				{this.state.android && <View style={{position: 'absolute', width: '100%', top: deviceHeight*3/2/10, marginTop: -10, justifyContent: 'space-between', flexDirection: 'row'}}>
					<Button small transparent style={{justifyContent: 'flex-start', alignItems: 'center'}}>
						<Icon onPress={this.pSlide.bind(this)} name="right" ios="ios-arrow-dropright-circle" android="md-arrow-dropright-circle" style={{fontSize: 24, color: 'black', opacity: 0.4}}/>
					</Button>
					<Button small transparent style={{justifyContent: 'flex-end', alignItems: 'center'}}>
						<Icon onPress={this.nSlide.bind(this)} name="left" ios="ios-arrow-dropleft-circle" android="md-arrow-dropleft-circle" style={{fontSize: 24, color: 'black', opacity: 0.4}}/>
					</Button>
				</View>}
			</View>
		)
	}
}
