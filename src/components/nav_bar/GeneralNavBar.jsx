import 'antd/dist/antd.css';
import { PageHeader, Avatar, Image, message, Select, Descriptions, Button, Tag} from 'antd';
import styled from 'styled-components'
import  './NavBar.css';
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { UserOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import logo from './../logo/logo2.jpg';


const cookies = new Cookies();
const { Option } = Select;
const XSRFToken  = cookies.get('XSRF-TOKEN');
let languages = []
let languageLocal = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";

languages.push(<Option style={{color:"#022715"}} key="EN">EN</Option>)
languages.push(<Option style={{color:"#022715"}} key="UA">UA</Option>)


const Language = (props) =>{
    let lang = localStorage.getItem("language");
    if(lang == null){
        localStorage.setItem("language","EN");
    }

    const UpdateData = (value) =>{
        localStorage.setItem("language",value)
        languageLocal = value
        props.setFunction(value);
        props.setLanguage(value);
    }



    const setLanguage = (value) =>{

        fetch('/update_language?language=' + value, {
          method: 'POST',
          headers: {
            'X-XSRF-TOKEN': XSRFToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }).then(response => response.status === false ? message.error("Something goes wrooong. status:" + response.status + ", status text:" + response.statusText) :
        response.json()).then(data => data[0] != "Success" ? message.error(data[0]) : UpdateData(value));
    }


    const onClick = (event) =>{
        console.log(event);
    }

    return(


            <Select
              className = "language_selector"
              onChange={setLanguage}
              value = {props.language}
              onClick = {onClick}
            >
             {languages}
            </Select>

    )
}

const getLogOut = () =>{
    window.location.href = "/login_in";

}

const BackIcon = () =>{
    const StyledBackIcon = styled(ArrowLeftOutlined)`
        color:#cd641b;
        &:hover {
          color:#1273de;
          }
    `
    return <StyledBackIcon/>

}



const Logo = (props) =>{
     let language = props.language;
     if(language === "UA"){
          props.setLogoText("Корівки");
     }

     if(language === "EN"){
         props.setLogoText("Tauren Milfs");
     }

     return (<Link className="logo" to="/" >{props.logoText}</Link>
     )
}

const LogOut = () =>{

    fetch('/logout', {
      method: 'POST',
      headers: {
        'X-XSRF-TOKEN': XSRFToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(response => response.status === false ? message.error("Something goes wrooong. status:" + response.status + ", status text:" + response.statusText) : getLogOut())


}

function UserButton(props){
    let language = props.language;
    if(language === "UA"){
        props.setUserTittle("Налаштування користувача");
    }

    if(language === "EN"){
        props.setUserTittle("User settings");
    }

    const StyledUserButton = styled(Button)`
    position:relative;
    right:5%;
    top:25%;
    color:#248755;
    font-family: "Trebuchet MS";
    text-decoration: underline;`



    return ( <StyledUserButton  type="link" title={props.userTittle}>
                    <Link to="/usr_settings">
                 <Avatar className='usr_ava' style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />&nbsp;
                 {props.username}</Link>
               </StyledUserButton>
            )


}



const LogOutButton = (props) =>{

    const StyledLogOutButton = styled(Button)`
    position:relative;
    right:3%;
    top:25%;
    color:#248755;
    font-family: "Trebuchet MS";
    text-decoration: underline;`

    let language = props.language;
    if(language === "UA"){
        props.setLogOutText("Вийти");

    }

    if(language === "EN"){
       props.setLogOutText("Log out");

    }

     return (
            <StyledLogOutButton type="link"><Link onClick={LogOut}>
                 {props.logOutText}</Link>
               </StyledLogOutButton>
               )


}

const Menu = (props) =>{
    let language = props.language;
    let user = props.user;
    let colorMembers = '#248755';
    let colorAdmin = '#248755';
    let colorAdd = '#248755';
    let colorCrafts = '#248755';
    let colorAbout = '#248755';
    let isAdmin = false;

    if(props.patchName != undefined && props.patchName.includes("/edit_user/")){
        colorAdmin = "#248755";
    }
    switch(props.patchName){
        case "/admin" : colorAdmin = "#c8e6c9"
        break
        case "/about_us" : colorAbout = "#c8e6c9"
        break
        case "/addons" : colorAdd = "#c8e6c9"
        break
        case "/crafts" : colorCrafts = "#c8e6c9"
        break
        case "/members" : colorMembers = "#c8e6c9"
        break
        case "/stars" : colorMembers = "#c8e6c9"
        break

    }
    if (language === "UA"){
        props.setCraftText("Ремесла")
        props.setAddonsText("Аддони")
        props.setMembersText("Склад")
        props.setAboutText("Про нас")
        props.setAdminText("Адмін")
    }

    if (language === "EN"){
        props.setCraftText("Crafts")
        props.setAddonsText("Addons")
        props.setMembersText("Members")
        props.setAboutText("About us")
        props.setAdminText("Admin")
    }

    if(user != null && user !="null"){
        isAdmin = false;
        for(var i = 0; i < user.roles.length; i++){
            if(user.roles[i] === "ADMIN"){
                isAdmin = true;
            }
        }
    }

    const StyledLink = styled(Link)`
      hover {
        color: #54b1ed;
      }
    `

    if(!isAdmin){

        return(
            <Descriptions  column={4} style={{width:'45%', position:'relative', left:'35%'}}>
                <Descriptions.Item>
                   <Link className="header_menu" style = {{color:colorMembers}}  to="/members">{props.membersText}</Link>
               </Descriptions.Item>
                <Descriptions.Item>
                   <Link className="header_menu" style = {{color:colorAdd}}  to="/addons">{props.addonsText}</Link>
               </Descriptions.Item>
               <Descriptions.Item>
                   <Link className="header_menu"  style = {{color:colorCrafts}} to="/crafts">{props.craftText}</Link>
               </Descriptions.Item>
               <Descriptions.Item>
                   <Link className="header_menu" style = {{color:colorAbout}} to="/about_us">{props.aboutText}</Link>
               </Descriptions.Item>
            </Descriptions>)




    }else{

         return(
            <Descriptions  column={5} style={{ width:'45%', position:'relative', left:'30%'}}>
                <Descriptions.Item>
                   <Link className="header_menu" style = {{color:colorMembers}}  to="/members">{props.membersText}</Link>
               </Descriptions.Item>
               <Descriptions.Item>
                   <Link className="header_menu" style = {{color:colorAdd}} to="/addons">{props.addonsText}</Link>
               </Descriptions.Item>
               <Descriptions.Item>
                   <Link className="header_menu" style = {{color:colorCrafts}} to="/crafts">{props.craftText}</Link>
               </Descriptions.Item>
               <Descriptions.Item>
                   <Link className="header_menu" style = {{color:colorAbout}} to="/about_us">{props.aboutText}</Link>
               </Descriptions.Item>
               <Descriptions.Item >
                   <Link className="header_menu" style = {{color:colorAdmin}} to="/admin">{props.adminText}</Link>
               </Descriptions.Item>
            </Descriptions>
        )

    }
}



function NavBar(props){
    const history = useHistory();
    const Back = () =>{
        history.goBack();
    }
    const [user, setUser] = useState("null");
    const [logOutText, setLogOutText] = useState("");
    const [userTittle, setUserTittle] = useState("");
    const [language, setLanguage] = useState("");
    const [logoText, setLogoText] = useState("");
    const [aboutText, setAboutText] = useState("");
    const [membersText, setMembersText] = useState("");
    const [addonsText, setAddonsText] = useState("");
    const [craftText, setCraftText] = useState("");
    const [adminText, setAdminText] = useState("");



    const StyledPageHeader = styled(PageHeader)`
          position:relative;
          height:3%;
          minWidth:100%;
          border: 1px solid rgb(0, 0, 0);
          background-color:rgb(21, 21, 21);
        `

     const setData =(data)=>{
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("language",data.language);
        setLanguage(data.language);
     }
    useEffect(() => {


        fetch("/get_user")
            .then(response=>response.json())
            .then(data=>setData(data[0]));

    }, []);

    if(user === null){
         window.location.href = "/login_in";
        }else{
           return  (<StyledPageHeader
             className="site-page-header"
             title=<Logo logoText = {logoText} setLogoText={setLogoText}  language = {language} />
             extra = {[<UserButton key='0' {... user}
                            userTittle = {userTittle}
                            setUserTittle = {setUserTittle}
                            language = {language}
                       />,
                       <LogOutButton key='1'
                              logOutText = {logOutText}
                              setLogOutText = {setLogOutText}
                              language = {language}
                       />,
                       <Language setCurrentDifficulty = {props.setCurrentDifficulty} language = {language} setLanguage={setLanguage} setFunction={props.setFunction}/>
                       ]}
             >

                <Menu
                language = {language}
                aboutText = {aboutText}
                setAboutText = {setAboutText}
                membersText = {membersText}
                setMembersText = {setMembersText}
                addonsText = {addonsText}
                setAddonsText = {setAddonsText}
                craftText = {craftText}
                setCraftText = {setCraftText}
                user = {user}
                setAdminText = {setAdminText}
                adminText = {adminText}
                patchName = {props.patchName}
             />


             </StyledPageHeader>)
        }
}


export default function AppNavBar(props){

  return <NavBar {... props}/>;
}
