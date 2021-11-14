import React , { Component } from 'react';
import { Text,  View ,FlatList,StyleSheet} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import UserCarCard from "./userCarCard.component";



export default class UserCar extends Component {

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


    componentWillUnmount () {
       this.focusListener();
    }


    componentDidMount() {
        
        this.focusListener = this.props.navigation.addListener('focus', async () => {
        try{
        await this.getValueFor();
        await axios.get("http://192.168.100.106:5000/cars/userVehicles",{
            headers:{"x-access-token":this.state.token}
          })
          .then(res => {
            //console.log(res);
            const cars = res.data;
            //console.log(cars[0]._id);
            this.setState({ cars });
          })
          .catch((err)=>{
            console.log(err.message);

        });
          
        }catch(err){
            console.log(err.message);
        }
    });
      }

    render(){

        if(this.state.cars.length !=0){
        
        return (
            <FlatList 
            data={this.state.cars}
            renderItem={ ({ item, index, separators })=>(<UserCarCard  key={item._id} car = {item} navigation={this.props.navigation} />)}
            keyExtractor={item => item._id}
            numColumns={2}
            columnWrapperStyle={styles.carsLayout}
            />
        );

        }else{

        return (
            <View><Text style={{color:"blue"}}>No Vehicles Posted</Text></View>
        );

        }
        
       
    }

}


const styles = StyleSheet.create({
   
    carsLayout:{
        justifyContent:"space-evenly",
    }
});