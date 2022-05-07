import 'antd/dist/antd.css';
import { PageHeader, Avatar, Image, message, Select, Button } from 'antd';
import styled from 'styled-components'
import  './NavBar.css';
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { UserOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import logo from './../logo/logo2.jpg';


const cookies = new Cookies();
const { Option } = Select;
let languages = []
let languageLocal = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";


languages.push(<Option style={{color:"#022715"}} key="EN">EN</Option>)
languages.push(<Option style={{color:"#022715"}} key="UA">UA</Option>)



const Logo = (props) =>{
    let language = props.language;
   if(language === "UA"){
        props.setLogoText("Корівки");
   }
   if(language === "EN"){
       props.setLogoText("Tauren Milfs");
   }

    return (<Link className="logo" to="/" > {props.logoText}</Link>)
}

const Language = (props) =>{
    let lang = localStorage.getItem("language");
    if(lang == null){
        localStorage.setItem("language","EN");
    }

    const setLanguage = (value) =>{
        localStorage.setItem("language",value);
        languageLocal = value;
        props.setFunction(value);
        props.setLanguage(value);
    }

    return(


            <Select
              style={{position:'relative', right:'5%', top:'15%', color:"#63baf2" }}
              onChange={setLanguage}
              defaultValue = {languageLocal}
            >
             {languages}
            </Select>

    )
}



function NavBar(props){
    const [user, setUser] = useState(null);
    const [logoText, setLogoText] = useState(null);
    const [language, setLanguage] = useState(null);
    const StyledPageHeader = styled(PageHeader)`
          position:relative;
          height:30%;
          minWidth:100%;
          border: 1px solid rgb(0, 0, 0);
          background-color:rgb(21, 21, 21);
        `

     const setData =(data)=>{
        setUser(data);
       // localStorage.setItem("user", data);
       setLanguage(languageLocal);
     }
    useEffect(() => {


        fetch("/get_user")
            .then(response=>response.json())
            .then(data=>setData(data[0]));

    }, []);

    if(user != null){
         window.location.href = "/home";
        }else{
           return  (<StyledPageHeader
             className="site-page-header"
             title=<Logo logoText = {logoText} setLogoText={setLogoText} language = {language}/>
             extra = {[<Language setFunction={props.setFunction} setLanguage={setLanguage}/>]}
             >

             </StyledPageHeader>)
        }
}


export default function AppNavBar(props){
  return <NavBar {... props}/>;
}
