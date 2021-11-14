import React , { Component } from 'react';
import { Text,  View ,FlatList} from 'react-native';
import axios from 'axios';
import RentedCarCard from "./rentedCarCard.component";
import * as SecureStore from 'expo-secure-store';



export default class RentalCars extends Component {

    constructor(props){
        super(props);
        this.state  = {
            cars:[],
            token:""
        };
        this.getValueFor = this.getValueFor.bind(this);
        this.focusListener = "";

    }

    async getValueFor() {
        let token = await SecureStore.getItemAsync("token");
        let result = await (token?token:"").toString();
        if (result) {
          await this.setState({token:result});
          return true;
        } else {
          this.authAlert();
          return false;
        }
    }

    componentDidMount() {
      this.focusListener = this.props.navigation.addListener('focus', async () => {
        try{
        await this.getValueFor();
        await axios.get("http://192.168.100.106:5000/cars/rentalVehicles",{
            headers:{
                "x-access-token":this.state.token,
            }
           })
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
            renderItem={ ({ item, index, separators })=>(<RentedCarCard  key={item._id} car = {item} navigation={this.props.navigation} />)}
            keyExtractor={item => item._id}
            />
        );
    }


}