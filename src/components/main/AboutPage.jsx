import styled from 'styled-components';
import { Button, Typography, Space, Divider, message, Input, Form} from 'antd';
import "antd/dist/antd.css";
import  './Main.css';
import React, { useState, useEffect} from 'react';
import Cookies from 'universal-cookie';
import AppNavbarGeneral from './../nav_bar/GeneralNavBar.jsx';
import AppNavbar from './../nav_bar/AppNavBar.jsx';
import { Link } from 'react-router-dom';
import {
CheckOutlined,
EditOutlined,
CloseOutlined
} from '@ant-design/icons';

const { Text, Title, Paragraph  } = Typography;
const { TextArea } = Input;
const cookies = new Cookies();
const XSRFToken  = cookies.get('XSRF-TOKEN')
const processString = require('react-process-string');
let language;
let preGeneralText
let preAboutText
let preContactsText




let config = [{
    regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
    fn: (key, result) => <span key={key}>
                             <a target="_blank" href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}>{result[1]}://{result[2]}.{result[3]}{result[4]}</a>{result[5]}
                         </span>
}, {
    regex: /(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
    fn: (key, result) => <span key={key}>
                             <a target="_blank" href={`http://${result[1]}.${result[2]}${result[3]}`}>{result[1]}.{result[2]}{result[3]}</a>{result[4]}
                         </span>
}];


const CurrentNavBar = (props) =>{
    let patchName = window.location.pathname;
    if(props.user === null || props.user === 'null'){

        return <AppNavbar setFunction={props.setFunction}/>
    }else{

        return <AppNavbarGeneral setFunction={props.setFunction} patchName = {patchName}/>
    }

}

const changeTags = (className, id) =>{
    var textAreaElement = document.getElementById(id);
    var paragraphElement = document.getElementsByClassName(className)[0];
    paragraphElement.style.display = 'inline';
    textAreaElement.style.display = 'none';
}

const OnEditing = (className,id, text) =>{
    if(className === "about_section"){
        preAboutText = text;
    }
    if(className === 'general_section'){
        preGeneralText = text;
    }
    if(className === "contacts_section"){
        preContactsText = text;
    }
    console.log(className)
    console.log(id)
    var textAreaElement = document.getElementById(id);
    var paragraphElement = document.getElementsByClassName(className)[0];
    paragraphElement.style.display = 'none';
    textAreaElement.style.display = 'inline';

}

const updateGeneralText = (text, tag) =>{
    text = text.trim()
    var generalMessage = {
        tag:tag,
        message:text,
    }
      fetch('/update_message_by_tag/' , { method: 'POST',
       headers: {
         'X-XSRF-TOKEN': XSRFToken,
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       credentials: 'include',
       body:JSON.stringify(generalMessage)
    })
    .then(response => response.json())
    .then(data => data[0] != "Successful" ? message.error(data[0]) : changeTags(tag + "_section", tag + "_text_area"));
}

/*
const updateAboutText = (text) =>{
    var aboutMessage = {
        tag:"about",
        message:text,
    }
    fetch('/update_message_by_tag/' , { method: 'POST',
       headers: {
         'X-XSRF-TOKEN': XSRFToken,
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       credentials: 'include',
       body:JSON.stringify(aboutMessage)
    })
    .then(response => response.json())
    .then(data => data[0] != "Successful" ? message.error(data[0]) : changeTags("about_section","about_text_area"));
}
const updateContactsText = (text) =>{
    var contactsMessage = {
        tag:"contacts",
        message:text,
    }
    fetch('/update_message_by_tag/' , { method: 'POST',
       headers: {
         'X-XSRF-TOKEN': XSRFToken,
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       credentials: 'include',
       body:JSON.stringify(contactsMessage)
    })
    .then(response => response.json())
    .then(data => data[0] != "Successful" ? message.error(data[0]) : changeTags("contacts_section","contacts_text_area"));
}
 */

const Content = (props) =>{
    const [generalText, setGeneralText] = useState( "general info");
    const [aboutText, setAboutText] = useState('some about us');
    const [contactsText, setContactsText] = useState('contacts');
    let user = null;
    //var user = props.user;

        const onClick = (event) =>{

            if(event.target.tagName != "TEXTAREA" && (event.key === "Enter" || event.buttons ===1)){
                var textAreaElement1 = document.getElementById("general_text_area");
                var textAreaElement2 = document.getElementById("about_text_area");
                var textAreaElement3 = document.getElementById("contacts_text_area");
                if(textAreaElement1 != undefined && textAreaElement1.style.display === "inline"){
                    var paragraphElement1 = document.getElementsByClassName('general_section')[0];
                    var textArea = document.getElementById('general');
                    updateGeneralText (textArea.value, "general");
                    textAreaElement1.style.display = 'none';
                    paragraphElement1.style.display = 'inline';

                }

                if(textAreaElement2 != undefined && textAreaElement2.style.display === "inline"){
                    var paragraphElement2 = document.getElementsByClassName('about_section')[0];
                    var textArea = document.getElementById('about');
                    updateGeneralText (textArea.value, "about");
                    textAreaElement2.style.display = 'none';
                    paragraphElement2.style.display = 'inline';
                }

                if(textAreaElement3 != undefined && textAreaElement3.style.display === "inline"){
                    var paragraphElement3 = document.getElementsByClassName('contacts_section')[0];
                    var textArea = document.getElementById('contacts');
                    updateGeneralText (textArea.value, "contacts");
                    textAreaElement3.style.display = 'none';
                    paragraphElement3.style.display = 'inline';
                }

            }
            if(event.key === "Escape"){
                var textAreaElement1 = document.getElementById("general_text_area");
                var textAreaElement2 = document.getElementById("about_text_area");
                var textAreaElement3 = document.getElementById("contacts_text_area");

                if(textAreaElement1.style.display === "inline"){
                    var paragraphElement1 = document.getElementsByClassName('general_section')[0];
                    setGeneralText(preGeneralText);
                    preGeneralText = "";
                    paragraphElement1.style.display = 'inline';
                    textAreaElement1.style.display = 'none';
                }
                if(textAreaElement2.style.display === "inline"){
                    var paragraphElement2 = document.getElementsByClassName('about_section')[0];
                    setAboutText(preAboutText);
                    preGeneralText = "";
                    paragraphElement2.style.display = 'inline';
                    textAreaElement2.style.display = 'none';
                }
                if(textAreaElement3.style.display === "inline"){
                    var paragraphElement3 = document.getElementsByClassName('contacts_section')[0];
                    setContactsText(preContactsText);
                    preGeneralText = "";
                    paragraphElement3.style.display = 'inline';
                    textAreaElement3.style.display = 'none';
                }
            }
        }


    const setData = (data) =>{
        let message = '';
        if(data != null && data.length >0){
            for(var i = 0; i < data.length; i++){
                if(data[i].tag === "general"){
                    setGeneralText(data[i].message);
                    processString(config)(data[i].message)

                }
                if(data[i].tag === "about"){
                    setAboutText(data[i].message);
                }
                if(data[i].tag === "contacts"){
                    setContactsText(data[i].message);
                }
            }
        }

    }

   const setUserData =(data)=>{
        console.log(data)
        if(data !== null && data[0] !== null){
            user = data[0]
            var isAdmin = false;
            var editBtns;
            for(var i = 0; i < user.roles.length; i++){
                if(user.roles[i] === "ADMIN"){
                    window.addEventListener("keydown",onClick);
                    window.addEventListener("mousedown",onClick);
                    isAdmin = true;
                }
            }
            if(!isAdmin){
                editBtns = document.getElementsByClassName("edit_btn");
                if(editBtns != null){
                    for(var j = 0; j < editBtns.length; j++){
                        editBtns[j].style.display = 'none';
                    }
                }
            }
        }else{
            editBtns = document.getElementsByClassName("edit_btn");
            if(editBtns != null){
                for(var j = 0; j < editBtns.length; j++){
                    editBtns[j].style.display = 'none';
                }
            }
        }
    }

    useEffect(() => {

        fetch('/get_user',{
                })
         .then(response => response.json())
         .then(data => setUserData(data));

        fetch('/get_about_us_messages',{
        })
            .then(response => response.json())
            .then(data => setData(data));
    }, []);

    const ShowUrls = (text) =>{
        text = processString(config)(text);
        return text;
    }



    const onChangeGeneral = (text)=>{
        setGeneralText(text.target.value)
    }
    const onChangeAbout = (text)=>{
        setAboutText(text.target.value)
    }
    const onChangeContacts = (text)=>{
        setContactsText(text.target.value)
    }


    return(
     <Space  id="text_space" align="center" direction="vertical">

          <Title level={3} style={{textAlign: 'center', marginTop:'3%', color:"#248755"}}>GENERAL</Title>
          <Paragraph className='general_section' >{ShowUrls(generalText)} <EditOutlined className="edit_btn" onClick={()=>OnEditing("general_section", "general_text_area", generalText)}/></Paragraph>
           <div  style={{display:'none'}} id="general_text_area">
            <TextArea id='general' cols='150' rows={10} value={generalText} onChange={onChangeGeneral}></TextArea>
            <CheckOutlined className="save_btn" onClick={()=>updateGeneralText(generalText, "general")}/> &nbsp;&nbsp;<CloseOutlined className="close_btn" onClick={()=>changeTags("general_section", "general_text_area")}/>
            <br/><br/>
          </div>

          <Title level={3} style={{textAlign: 'center', marginTop:'3%', color:"#248755"}}>ABOUT US</Title>
          <Paragraph className='about_section' >{ShowUrls(aboutText)} <EditOutlined className="edit_btn" onClick={()=>OnEditing("about_section", "about_text_area", aboutText)}/>ABOUT US</Paragraph>
          <div  style={{display:'none'}} id="about_text_area">
           <TextArea id="about" cols='150' rows={10} value={aboutText} onChange={onChangeAbout}></TextArea>
           <CheckOutlined className="save_btn" onClick={() => updateGeneralText(aboutText, "about")}/>&nbsp;&nbsp;<CloseOutlined className="close_btn" onClick={()=>changeTags("about_section", "about_text_area")}/>
           <br/><br/>
          </div>

         <Title level={3} style={{textAlign: 'center', marginTop:'3%', color:"#248755"}}>CONTACTS</Title>
         <Paragraph className='contacts_section' >{ShowUrls(contactsText)} <EditOutlined className="edit_btn" onClick={()=>OnEditing("contacts_section", "contacts_text_area", contactsText)}/></Paragraph>
         <div  style={{display:'none'}} id="contacts_text_area">
          <TextArea id="contacts" cols='150' rows={10} value={contactsText} onChange={onChangeContacts}></TextArea>
          <CheckOutlined className="save_btn" onClick={() => updateGeneralText(contactsText, "contacts")}/>&nbsp;&nbsp;<CloseOutlined className="close_btn" onClick={()=>changeTags("contacts_section", "contacts_text_area")}/>
          <br/><br/>
         </div>


     </Space>

    )
}


const Main =  () =>{
    language = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";
    const [currentLanguage, setLanguage] = useState(language);
    const [user,setUser] = useState(null);

    const setData = (data) =>{
        if(data[0] != null){
            setUser(data[0]);
        }

    }

    useEffect(() => {
        fetch('/get_user',{
        })
            .then(response => response.json())
            .then(data => setData(data));
    }, []);





        return(
            <div style={{width:"100%"}} >
                <CurrentNavBar user={user} setFunction={setLanguage}/>
                <Space style={{width:"50%", position:'relative', left:"25%", marginTop:'5%'}} align="center" direction="vertical">
                    <Content  />
                </Space>
            </div>
        )


}

export default function MainPage(){
return <Main/>
}