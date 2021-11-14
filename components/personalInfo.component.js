import React , { Component } from 'react';
import {  StyleSheet,View, Text, Image,FlatList,TouchableOpacity } from 'react-native'
import { Card,  Button, Input } from 'react-native-elements'
import { Link,withRouter} from "react-router-native"
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';



class PersonalInfo extends Component {

    constructor(props){
        super(props);
    }

    
    render(){
        return (
        <View>       
            <Card containerStyle={styles.card}>
                 <Card.Title>Personal Info</Card.Title>
                <Card.Divider/>
        
                        <View  //style={styles.user}
                        >
                        <Text >
                            <Text style={{fontWeight:"bold"}}>Full Name: </Text> {this.props.name} {"\n\n"}
                            <Text style={{fontWeight:"bold"}}>Email: </Text> {this.props.email} {"\n\n"}
                            <Text style={{fontWeight:"bold"}}>Phone Number: </Text> {"03343776203"} {"\n"}
                            
                        </Text>
                        <Button
                            icon={<Icon size={30} name='edit' color='#ffffff'  type='font-awesome' />}
                            buttonStyle={{backgroundColor:"#54045D",borderRadius: 10, marginLeft: 0, marginRight: 0, marginBottom: 0, justifyContent:"space-evenly"}}
                            title='Edit' 
                        />
                        </View>
            </Card>
        </View>
        );
    }


}


  
const styles = StyleSheet.create({
    card:{
        borderRadius: 20
    },
    user: {
      flex: 1,
      backgroundColor: '#fff',
    },
    name:{
        fontSize:30
    }
    ,
    image:{
        width: "100%",
        height:150,

    }


  });
//   export default withRouter(PersonalInfo);
export default PersonalInfo;