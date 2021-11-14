import { StatusBar } from 'expo-status-bar';
import React , { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route,Redirect} from "react-router-native";
import Navbar from "./components/navbar.component";
import CarList from "./components/car-list.component";
import CarView from "./components/car-view.component";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import RentalCars from "./components/rentalCars.component";
import * as SecureStore from 'expo-secure-store';
import AddUserCar from "./components/add-user-car.component";
import EditUserCarView from "./components/edit-user-car-view.component";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Card,  Button, Icon } from 'react-native-elements'
import { createDrawerNavigator,} from '@react-navigation/drawer';



const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


async function Logout(props){

  await props.removeToken();
  return (<CarList />);
  
};


class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      token:"",
      name:"",
      email:"",
      redirect:""
    };

    this.getValueFor = this.getValueFor.bind(this);
    this.removeToken = this.removeToken.bind(this);
  }

  async removeToken(){
    try{
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("name");
    await SecureStore.deleteItemAsync("email");
    await this.setState({name:"",token:"",redirect:"/login"});
    
    }catch(err){
      console.log(err.message);
    }

  }

  async getValueFor() {
    try{
    let result1 = await (await SecureStore.getItemAsync("token")).toString();
    let result2 = await (await SecureStore.getItemAsync("name")).toString();
    let result3 = await (await SecureStore.getItemAsync("email")).toString();
    if (result1 && result2 && result3) {
      await this.setState({token:result1,name:result2,email:result3,redirect:""});
      
      return true;
    } else {
        return false;
    }
    }catch(err){
      console.log(err.message);
    }
  
  }

  async componentDidMount() {
    try{
    let token = await this.getValueFor();
    console.log(this.state.name);
    }catch(err){
      console.log(err.message);
    }
  }


render(){
  
  return (
    <View style= {styles.container}>
    <NavigationContainer >
      <Stack.Navigator>
      <Stack.Screen name="Root" options={{ headerShown: false }} >
      {()=><Drawer.Navigator 
                            screenOptions={{
                              drawerStyle: {backgroundColor:"#54045D"},
                              drawerLabelStyle:{ color:"white",fontWeight:'bold'},
                              headerTintColor: '#fff', 
                            }}
                           
           >
      
        <Drawer.Screen 
                      name="Home"

                      component={CarList}
                      options={{
                      headerTitle:"Home" ,
                      unmountOnBlur:true,
                      headerRight: () => (
                        this.state.token.length != 0 && <Button
                        onPress={()=>this.removeToken()}
                        title='Logout' 
                        buttonStyle={{backgroundColor:"#54045D",color:"white"}}

                        />
                        ),
                      headerStyle:{
                                    backgroundColor:"#54045D",
                                    
                                  },
                      headerTitleStyle: {
                                    fontWeight: 'bold',
                                    color:"white"
                                    },

                       }}
        />
        { !this.state.token &&
        <Drawer.Screen name="Register"
                       options={{
                        
                        headerStyle:{
                          backgroundColor:"#54045D",
                          
                        },
                        headerTitleStyle: {
                          fontWeight: 'bold',
                          color:"white"
                          },
                       }}
        >
          {()=><Register name={this.state.name} 
                    token={this.state.token} 
                    getValueFor={()=>this.getValueFor()}
                    removeToken={()=>this.removeToken()}
          />}

        </Drawer.Screen>
        }

        
        { !this.state.token &&
        <Drawer.Screen name="Login"
                       options={{
                        headerStyle:{
                          backgroundColor:"#54045D",
                          
                        },
                        headerTitleStyle: {
                          fontWeight: 'bold',
                          color:"white"
                          },
                       
                       }}
                       
        >
          {()=><Login name={this.state.name} 
                    token={this.state.token} 
                    getValueFor={()=>this.getValueFor()}
                    removeToken={()=>this.removeToken()}
          />}

        </Drawer.Screen>
        }

        { this.state.token.length != 0 &&
          <Drawer.Screen name="Profile"
                         options={{
                              headerStyle:{backgroundColor:"#54045D"},
                              headerTitleStyle: {
                                            fontWeight: 'bold',
                                            color:"white"
                                                },
                              unmountOnBlur:true
                              }}
                         
          >
          {(props)=><Profile name={this.state.name} 
                        token={this.state.token} 
                        email={this.state.email} 
                        getValueFor={()=>this.getValueFor()}
                        removeToken={()=>this.removeToken()}
                        // navigation={props.navigation}
                        {... props}
                        
          />}
          </Drawer.Screen>
        }


        { this.state.token.length != 0 &&
          <Drawer.Screen name="Rental Vehicle"
                         options={{
                              headerStyle:{backgroundColor:"#54045D"},
                              headerTitleStyle: {
                                            fontWeight: 'bold',
                                            color:"white"
                                                },
                              unmountOnBlur:true
                              }}
                         
          >
          {(props)=><RentalCars name={this.state.name} 
                        token={this.state.token} 
                        email={this.state.email} 
                        getValueFor={()=>this.getValueFor()}
                        removeToken={()=>this.removeToken()}
                        {... props}
                        
          />}
          </Drawer.Screen>
        }


       
  </Drawer.Navigator>}
  </Stack.Screen>
  <Stack.Screen name="View Vehicle" component={CarView} options={{ headerShown: false , unmountOnBlur:true,}} />
  <Stack.Screen name="Edit Vehicle Details"  options={{
                        unmountOnBlur:true,
                        headerTintColor: '#fff', 
                        headerStyle:{
                          backgroundColor:"#54045D",
                          
                        },
                        headerTitleStyle: {
                          fontWeight: 'bold',
                          color:"white"
                          },
                       
                       }} >
                         {(props)=><EditUserCarView {...props} />}
  </Stack.Screen>
  <Stack.Screen name="Add Vehicle Details" options={{
                        headerTintColor: '#fff', 
                        headerStyle:{
                          backgroundColor:"#54045D",
                        },
                        headerTitleStyle: {
                          fontWeight: 'bold',
                          color:"white"
                          },
                       
                       }}>
    {
      (props)=><AddUserCar {...props} />
    }
  </Stack.Screen>
 
  </Stack.Navigator>
  </NavigationContainer>
  </View>


/* <NativeRouter>
      
      <View style= {styles.container} >
          
          <Navbar name={this.state.name}
           token={this.state.token} 
           getValueFor={()=>this.getValueFor()}
           removeToken={()=>this.removeToken()}
            />
          <Route exact path="/" component={CarList}></Route>
        
          <Route>
                {this.state.redirect && <Redirect to="/login" />}
          </Route>
          <Route exact path="/cars/:id" component={CarView} />
          
          <Route exact path="/addUserCar" component={AddUserCar} />
          <Route exact path="/editUserCar/:id" component={EditUserCarView} />
          
          <Route exact path="/register" 
          render={() => <Register 
                              name={this.state.name} 
                              token={this.state.token} 
                              getValueFor={()=>this.getValueFor()}
                              removeToken={()=>this.removeToken()}
                               />}
          />
          <Route exact path="/login" 
          render={() => <Login 
                              name={this.state.name} 
                              token={this.state.token} 
                              getValueFor={()=>this.getValueFor()}
                              removeToken={()=>this.removeToken()}
                               />}
          />

          <Route exact path="/profile" 
          render={() => <Profile
                              name={this.state.name} 
                              token={this.state.token}
                              email={this.state.email} 
                              getValueFor={()=>this.getValueFor()}
                              removeToken={()=>this.removeToken()}
                               />}
          />
        
      </View>
      </NativeRouter> */
    
  );

        }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6BEFC',
  },
});


export default  App;