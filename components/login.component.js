import React , { Component } from 'react';
import {  StyleSheet,View, Text, Image,FlatList,TouchableOpacity  } from 'react-native'
import { Card,  Button, Input} from 'react-native-elements'
import { Link,withRouter} from "react-router-native"
import Icon from 'react-native-vector-icons/FontAwesome'
import validator from 'validator'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';


class Login extends Component {

    constructor(props){
        super(props);

        this.state = {
            user:{email:"",password:""},
            passwordHidden:true,
            icon:require("../images/icon.png"),
            eyeIconName:"eye-slash",
            ValidEmail:false,
            msg:"",

        }

        this.eyeIconToggle = this.eyeIconToggle.bind(this);
        this.validation = this.validation.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.save = this.save.bind(this);
        
    }

    async save(key, value) {
        await SecureStore.setItemAsync(key, value);
    }

    
      
    eyeIconToggle(){
        if(this.state.eyeIconName == "eye-slash"){
            this.setState({
                eyeIconName:"eye",
                passwordHidden:false
            });
        }else{
            this.setState({
                eyeIconName:"eye-slash",
                passwordHidden:true
            });
        }
        
    }

    validation(){
    

        console.log(this.state.ValidEmail);


        if(!this.state.ValidEmail){
            this.setState({
                msg:"Email Format Invalid!"
            });
            return false;
        }else if(this.state.user.password.length < 8){
            this.setState({
                msg:"Password Length Should be Atleast 8!"
            });
            return false;
        }

        return true;

    }

    async onLogin(){

        let promise = new Promise( (resolve,reject)=>{

            if (this.validation()) {
                resolve("Success!");
             }
             else {
                reject(Error("Registration Failed"));
             }

        });

        await promise.then(async (result)=>{
            console.log(result);

            axios.post("http://192.168.100.106:5000/users/login",this.state.user)
                 .then(async (res) => {
                    console.log(res.data);
                    await this.save("token",res.data.token);
                    await this.save("name",res.data.first_name+" "+res.data.last_name);
                    await this.save("email",res.data.email);
                    await this.props.getValueFor();
                    // await this.props.history.push(`/`);
                    this.props.navigation.navigate(`Home`);
                 })
                 .catch((err)=>{
                     this.setState({msg:"Invalid Email or Password"});
                     console.log("login crediental invalid : "+err.message);
                 });
        },
         function(error) {
            console.log(error.message);
         });

        
        
    }

    render(){
        return (
        <View style={{backgroundColor: '#F6BEFC'}}>       
            <Card containerStyle={styles.card}>
                {/* <Card.Title>CARD WITH DIVIDER</Card.Title>
                <Card.Divider/> */}
        
                        <View >
                        <View style={styles.logoCont}>
                        <Image style={styles.logo} resizeMode="contain" source={this.state.icon} />
                        </View>

                        <View>
                            <Text style={styles.alert}>{this.state.msg}</Text>
                        </View>

                        <Input
                            placeholder='Email'
                            inputContainerStyle={styles.input}
                            errorStyle={{ color: 'red' }}
                            onChangeText={
                                value => this.setState((prev)=>{ 
                                    return {
                                        user:{ ... prev.user,email: value },
                                        ValidEmail:validator.isEmail(value)
                                     };
                                    
                                })}
                            leftIcon={
                                <Icon
                                  name='envelope'
                                  size={24}
                                  color='#54045D'
                                />
                              }
                        />

                        <Input
                            placeholder='Password'
                            inputContainerStyle={styles.input}
                            errorStyle={{ color: 'red' }}
                            secureTextEntry={this.state.passwordHidden} 
                            onChangeText={
                                value => this.setState((prev)=>{ 
                                    return {user:{ ... prev.user,password: value } };
                                    
                                })}
                            leftIcon={
                                <Icon
                                  name='lock'
                                  size={24}
                                  color='#54045D'
                                />
                              }
                            rightIcon={
                                <Icon
                                  name={this.state.eyeIconName}
                                  onPress={()=>this.eyeIconToggle()}
                                  size={24}
                                  color='#54045D'
                                />
                            }
                        />

                        <Button
                            buttonStyle={styles.buttonStyle}
                            onPress={()=>this.onLogin()}
                            title='Login' 
                        />
                        
                        </View>
            </Card>
        </View>
        );
}

}


const styles = StyleSheet.create({
    card:{
        backgroundColor: '#F6BEFC',
        width:"100%",
        height:"100%",
        padding:0,
        margin:0,
        backfaceVisibility:"hidden"
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

//   export default withRouter(Login);
export default Login;