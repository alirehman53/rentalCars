import React , { Component } from 'react';
import {  StyleSheet,View, Text, Image,FlatList,TouchableOpacity, Dimensions } from 'react-native'
import { Card,  Button, Icon } from 'react-native-elements'
import { Link,withRouter} from "react-router-native"


class UserCarCard extends Component {

    constructor(props){
        super(props);

        this.state = {
            car:this.props.car
        }

        
    }

    onPress = ()=>{
        //this.props.history.push(`/editUserCar/${this.state.car._id}`);
        this.props.navigation.navigate('Edit Vehicle Details',{id:this.state.car._id});
    }

    
    render(){
        return (
        <View key={this.state.car._id}>
            <TouchableOpacity onPress = {this.onPress}  >
            <Card containerStyle={styles.card}>
                <View>
                    <Image style={styles.image} resizeMode="contain" source={{ uri:this.state.car.img[0].Imagedata }} />
                </View>
            </Card>
            </TouchableOpacity>
        </View>
        );


}

}

const styles = StyleSheet.create({
   
    card:{
        width: (Dimensions.get('window').width /2)-10,
        borderColor:"#ffff"
    },
    name:{
        fontSize:30
    }
    ,
    image:{
        width: "100%",
        height:120,

    }


  });
//   export default withRouter(UserCarCard);
export default UserCarCard;