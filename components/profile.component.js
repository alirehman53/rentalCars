import React , { Component } from 'react';
import {  StyleSheet,View, Text, Image,FlatList,TouchableOpacity ,ScrollView} from 'react-native'
import { Card,  Button, Input } from 'react-native-elements'
import { Link,withRouter} from "react-router-native"
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import PersonalInfo from "./personalInfo.component";
import UserCar from "./user-cars.component";
import { useNavigation } from '@react-navigation/native';




class Profile extends Component {

    constructor(props){
        super(props);
        this.addCarPost = this.addCarPost.bind(this);
        this.focusListener = "";


        
    }

    

    addCarPost(){
        console.log("add Car button pressed");
        //this.props.history.push(`/addUserCar`);
        this.props.navigation.navigate('Add Vehicle Details');
    }

    
    render(){
        return (
        <View style={{flex:1,backgroundColor: '#F6BEFC'}}>    
            <PersonalInfo 
            name={this.props.name}
            email={this.props.email}
            />
            <View style={{alignItems:"center"}}>
            <Button
                    icon={<Icon size={30} name='plus' color='#ffffff'  type='font-awesome' />}
                    buttonStyle={{width:"80%",backgroundColor:"#54045D",borderRadius: 5, marginLeft: 0, marginRight: 0, marginVertical: 5, justifyContent:"space-evenly"}}
                    title='Add Car'
                    onPress= {()=>this.addCarPost()} 
            />
            </View>

            
            <View style={{flex:1}}>
                <Card containerStyle={{borderRadius:20,flex:1}}>
                <Card.Title>Cars For Rent</Card.Title>
                <Card.Divider/>
                <UserCar  navigation={this.props.navigation} />
                </Card>
            </View> 
        </View>
        );
    }


}

const styles = StyleSheet.create({
    card:{
        width:"100%",
        padding:0,
        margin:0,
        backfaceVisibility:"hidden",
    },
    
    logo:{
        borderRadius:360,
        width:"35%",
        height:"35%"  
    },
    logoCont:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:5,
    },
    input:{
        borderBottomColor:"#54045D"
    },
    buttonStyle:{
        backgroundColor:"#54045D",
        borderRadius: 10,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        justifyContent:"space-evenly"
    },
    alert:{
        color:"red",
        justifyContent: 'center',
        alignItems: 'center',
        textAlign:"center"
    
    }

                            


  });



//   export default withRouter(Profile);
export default Profile;
