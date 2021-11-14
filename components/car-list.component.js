import React , { Component } from 'react';
import { Text,  View ,FlatList} from 'react-native';
import axios from 'axios';
import CarCard from "./carCard.component";
import * as SecureStore from 'expo-secure-store';



export default class CarList extends Component {

    constructor(props){
        super(props);

        this.state  = {
            cars:[]
        };

        this.getValueFor = this.getValueFor.bind(this);
        this.focusListener = "";

    }

    async getValueFor(key) {
        let result = await (await SecureStore.getItemAsync(key)).toString();
        if (result) {
          console.log(result);
          return result;
        } else {
          alert('Login Please');
        }
    }

    componentDidMount() {
      this.focusListener = this.props.navigation.addListener('focus', () => {
        try{
        axios.get("http://192.168.100.106:5000/cars")
          .then(res => {
            //console.log(res);
            const cars = res.data;
            this.setState({ cars });
          });
        }catch(err){
            console.log(err.message);
        }
      });
      }

      componentWillUnmount () {
        this.focusListener();
     }

    render(){
        return (
            <FlatList 
            data={this.state.cars}
            style={{backgroundColor: '#F6BEFC'}}
            renderItem={ ({ item, index, separators })=>(<CarCard  key={item._id} car = {item} navigation={this.props.navigation} />)}
            keyExtractor={item => item._id}
            />
        );
    }


}