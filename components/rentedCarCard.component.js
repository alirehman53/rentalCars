import React , { Component } from 'react';
import {  StyleSheet,View, Text, Image,FlatList,TouchableOpacity } from 'react-native'
import { Card,  Button, Icon } from 'react-native-elements'
import { Link,withRouter} from "react-router-native"


class RentedCarCard extends Component {

    constructor(props){
        super(props);

        this.state = {
            car:this.props.car
        }

        
    }

    onPress = ()=>{
        // this.props.history.push(`/cars/${this.state.car._id}`);
        this.props.navigation.navigate('View Vehicle',{id:this.state.car._id});
    }

    
    render(){
        return (
        <View key={this.state.car._id}>
            <TouchableOpacity onPress = {this.onPress} >
            <Card containerStyle={styles.card}>
                {/* <Card.Title>CARD WITH DIVIDER</Card.Title>
                <Card.Divider/> */}
        
                        <View  //style={styles.user}
                        >
                        <Image style={styles.image} resizeMode="contain" source={{ uri:this.state.car.img[0].Imagedata }} />
                        <Text >
                            {/* <Text style={styles.name}>{this.state.car.carName}</Text>{"\n"} */}
                            <Text style={{fontWeight:"bold"}}>Model: </Text>{this.state.car.model}{"\n"}
                            <Text style={{fontWeight:"bold"}}>Rent Charges: </Text> {this.state.car.rentCharges} <Text style={{fontWeight:"bold"}}>RS</Text> {"\n"}
                                               
                        </Text>

                        {/* Car Owner Infomation */}
                        <Card.Divider/>
                        <Text>

                        <Text style={{fontWeight:"bold"}}>Owner: </Text> {this.state.car.ownerFirstName+" "+this.state.car.ownerLastName } {"\n"}
                        <Text style={{fontWeight:"bold"}}>Phone: </Text> {this.state.car.ownerContact} {"\n"}
                        <Text style={{fontWeight:"bold"}}>Email Address: </Text> {this.state.car.ownerEmail } {"\n"}
                        
                        </Text>
                        
                        {/* <Button
                            icon={<Icon name='car' color='#ffffff'  type='font-awesome' />}
                            buttonStyle={{backgroundColor:"#54045D",borderRadius: 10, marginLeft: 0, marginRight: 0, marginBottom: 0, justifyContent:"space-evenly"}}
                            title='RENT NOW' 
                        /> */}
                        
                        </View>
                    
            </Card>
            </TouchableOpacity>
        </View>
        );
}

}

const styles = StyleSheet.create({
    card:{
        borderRadius: 20,
    },
    user: {
      flex: 1,
      backgroundColor: '#fff',
    },
    name:{
        fontSize:20
    }
    ,
    image:{
        width: "100%",
        height:100,

    }


  });
//   export default withRouter(CarCard);
export default RentedCarCard;