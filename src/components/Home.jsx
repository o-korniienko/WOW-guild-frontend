import AppNavbar from './nav_bar/AppNavBar.jsx';
import GreetingPage from './GreetingPage.jsx';
import { Button, Input } from 'antd';
import 'antd/dist/antd.css';
import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const cookies = new Cookies();



function Home (){

     const [user, setUser] = useState(null);

     const XSRFToken  = cookies.get('XSRF-TOKEN')
      useEffect(() => {
        fetch("/get_user")
        .then(response=>response.json())
        .then(data=>setUser(data[0]));
    }, []);


    if(user != null && user != "null"){
       window.location.href = "/home";
    }else{
            return(<GreetingPage/>)


    }
}



export default function Recipients(){
return <Home/>

}