import AppNavbar from './../nav_bar/GeneralNavBar.jsx';
import MembersList from './/MembersList.jsx';
import Stars from './/Stars.jsx';
import { Tree, Table, Space, Button, Popconfirm, Menu, message, Layout, Input, Spin, Modal, Alert, Card, Col, Row, Pagination, List, Affix} from 'antd';
import 'antd/dist/antd.css';
import  './MembersStyle.css';
import {
  PlusCircleOutlined,
  SyncOutlined,
  BarChartOutlined,
  ReloadOutlined,
  DownOutlined,
  TeamOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import wowLogo from './../logo/wow.png';
import wowLogsLogo from './../logo/wowLogs.png';
import RaiderIo from './../logo/raiderIo.png';

const { Search } = Input;
const { Sider, Content } = Layout;
const { Meta } = Card;
const cookies = new Cookies();
const XSRFToken  = cookies.get('XSRF-TOKEN')
const { SubMenu } = Menu;

let MEMBERS = []
let languageLocal;




function isAdmin(user){
    let roles = user.roles;
    for(var i = 0; i < roles.length; i++){
        if (roles[i] === "ADMIN"){
            return true;
        }
    }
    return false;
}





const MenuComponent = (props) =>{
        const [collapsed, setCollapsed] = useState(true);
        const toggleCollapsed = () => {
            collapsed ? setCollapsed(false) : setCollapsed(true);
        };
        const [hoverList, setHoverList] = useState(false);
        const [hoverUpdateAll, setHoverUpdateAll] = useState(false);
        const [hoverRateList, setHoverRateList] = useState(false);
        const [hoverUpdateLogAll, setHoverUpdateLogAll] = useState(false);


        let language = props.language;
        let updateText = "Update Blizzard Data";
        let starsText = "Rating";
        let memberListText = "Members"
        let listText = "Members List"
        let updateRankText = "Update WOWLogs Data"


        if(language === "UA"){
            updateText = "Оновити Blizzard Дані";
            starsText = "Рейтинг";
            memberListText = "Склад"
            listText = "Список"
            updateRankText = "Оновити WOWLogs Дані"
        }

        if(props.user !== null && !isAdmin(props.user) ){
             let adminMenu = document.getElementById('admin');
             if(adminMenu != null){
                adminMenu.style.display = 'none';
             }
         }


        const handleMouseEnter = (index) => {
          switch (index) {
            case 1:
                setHoverList(true);;
                break;
            case 2:
                setHoverUpdateAll(true);
                break;
            case 3:
                setHoverRateList(true);
                break;
            case 4:
                setHoverUpdateLogAll(true);
                break;
            default:

          }
        };

        const handleMouseLeave = (index) => {
          switch (index) {
            case 1:
                setHoverList(false);;
                break;
            case 2:
                setHoverUpdateAll(false);
                break;
            case 3:
                setHoverRateList(false);
                break;
            case 4:
                setHoverUpdateLogAll(false);
                break;
            default:
          }
        };


        const updateMembersFromBlizzard = () =>{
            props.setLoading(true);

            let mainDiv = document.getElementById('mainDiv');
            if(mainDiv != null){
               mainDiv.className = 'main_div_disabled';
            }
            fetch('/update_members_bz', { method: 'POST',
                headers: {
                  'X-XSRF-TOKEN': XSRFToken,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                credentials: 'include'

            })
            .then(response=> response.status !== 200 ? showError(response, props.setLoading) : response.url.includes("login_in") ? window.location.href = "/login_in" : response.json())
            .then(data => props.setData(data));


        }

        const setContent = (value) =>{
            window.location.href = "/members/" + value
           // props.setContentType(value)
        }

        const updateRankingData = ()=>{
            props.setLoading(true);

            let mainDiv = document.getElementById('mainDiv');
            if(mainDiv != null){
               mainDiv.className = 'main_div_disabled';
            }
            fetch('/update_ranking', { method: 'POST',
                headers: {
                  'X-XSRF-TOKEN': XSRFToken,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                credentials: 'include'

            })
            .then(response=> response.status !== 200 ? showError(response, props.setLoading) : response.url.includes("login_in") ? window.location.href = "/login_in" : response.json())
            .then(data => setBossesData(data));
        }


        const setBossesData = (data) =>{
            props.setLoading(false);

            let newArray = Object.entries(data)
            let map = new Map(newArray);

            if(map.keys().next().value === 'Deleted' || map.keys().next().value === 'Saved' || map.keys().next().value ===  'Successful'){
                message.success(map.keys().next().value);
            }else{
                message.error(map.keys().next().value);
            }
            props.setBosses(map.values().next().value);

            let mainDiv = document.getElementById('mainDiv');
            if(mainDiv != null){
               mainDiv.className = 'main_div_enabled';
            }

        }

        return (<Sider  collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <Affix offsetTop ={5}>

          <Menu
            mode="inline"

            inlineCollapsed={collapsed}
            style={{ height: '100%', borderRight: 0 }}
          >


            <SubMenu title = {memberListText} icon={<TeamOutlined style={{color:'#1a854f', fontSize:'150%'}}/>}>
                <Menu.Item key="0" id = "admin" icon={<UnorderedListOutlined style={{
                    color: '#1a854f',
                    fontSize:'150%',

                }}/>}>
                 <Link style={{
                        color: hoverList ? '#1e7ce4' : '#1a854f',
                        fontSize:'100%'
                    }}
                    onClick = {()=>setContent("list")}
                    onMouseEnter={()=>handleMouseEnter(1)}
                    onMouseLeave={()=>handleMouseLeave(1)}
                 >
                   {listText}
                 </Link>
                 </Menu.Item>
                 <Menu.Item key="1" id = "admin" icon={<SyncOutlined style={{color:'#1a854f', fontSize:'150%'}}/>}>
                 <Link style={{
                        color: hoverUpdateAll ? '#1e7ce4' : '#1a854f',
                        fontSize:'100%'
                    }}
                    onClick = {updateMembersFromBlizzard}
                    onMouseEnter={()=>handleMouseEnter(2)}
                    onMouseLeave={()=>handleMouseLeave(2)}
                 >
                   {updateText}
                 </Link>
                 </Menu.Item>


                 <SubMenu title={starsText}  icon={<BarChartOutlined style={{color:'#1a854f', fontSize:'150%'}}/>}>
                 <Menu.Item key="2">
                    <Link style={{
                            color: hoverRateList ? '#1e7ce4' : '#1a854f',
                            fontSize:'100%'
                        }}
                        onClick = {()=>setContent("stars")}
                        onMouseEnter={()=>handleMouseEnter(3)}
                        onMouseLeave={()=>handleMouseLeave(3)}
                    >
                    {starsText}
                    </Link>
                 </Menu.Item>
                 <Menu.Item key="3">
                     <Link style={{
                            color: hoverUpdateLogAll ? '#1e7ce4' : '#1a854f',
                            fontSize:'100%'
                        }}
                        onClick = {updateRankingData}
                        onMouseEnter={()=>handleMouseEnter(4)}
                        onMouseLeave={()=>handleMouseLeave(4)}
                     >
                     {updateRankText}
                     </Link>
                  </Menu.Item>

                 </SubMenu>
             </SubMenu >

          </Menu>
          </Affix>
        </Sider>)

}


const showError = (response,setLoading) =>{
     if(setLoading != null && setLoading != undefined){
        setLoading(false)

    }

    message.error("Oooops, something goes wrong. \n error: " + response.status + "\n error description: " + response.statusText)
}

function Members (props){
    languageLocal = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";
    const [collapsed, setCollapsed] = useState(false);
    const [currentLanguage, setLanguage] = useState(languageLocal);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState(null)
    const [user, setUser] = useState(null);
    const [contentType, setContentType] = useState(props.match.params.tag);
    const [bosses, setBosses] = useState([])
    let patchName = window.location.pathname;

    const setData = (value) =>{
        setMembers(value);
        MEMBERS = value
        setLoading(false);


        let mainDiv = document.getElementById('mainDiv');
        if(mainDiv != null){
           mainDiv.className = 'main_div_enabled';
        }

    }


    const ContentDiv = (props) =>{

        if(contentType === "list"){
            return (<MembersList updateCharacterDataInTable = {updateCharacterDataInTable} setMembers = {setMembers} setSearchValue = {setSearchValue} searchValue = {searchValue}  setLoading = {setLoading}  members = {members} allMembers = {MEMBERS} language = {currentLanguage}/>)
        }
        if(contentType === "stars"){
            return (<Stars bosses = {bosses}/>)
        }
    }

    const updateCharacterDataInTable = (data, search) =>{
         setLoading(false);
         let newArray = Object.entries(data)
         let map = new Map(newArray);
         if(map.keys().next().value === 'Deleted' || map.keys().next().value === 'Saved' || map.keys().next().value ===  'Successful'){
             message.success(map.keys().next().value);
             var updatedCharacter = map.values().next().value

              for(var i = 0; i < MEMBERS.length; i++){
                 if(MEMBERS[i].id === updatedCharacter.id){
                     MEMBERS[i] = updatedCharacter
                 }
             }
         }else{
             message.error(map.keys().next().value);
         }
         let mainDiv = document.getElementById('mainDiv');
         if(mainDiv != null){
            mainDiv.className = 'main_div_enabled';
         }
         if(search.trim() === ""){
            setMembers([])
            setMembers(MEMBERS)
         }else{
            onSearch(search)
         }
    }

    useEffect(() => {
        setLoading(true)


        fetch('/get_user')
                .then(response=> response.status !== 200 ? showError(response, setLoading) : response.url.includes("login_in") ? window.location.href = "/login_in" : response.json())
                .then(data=>setUserData(data));


        fetch('/get_members',{

        })
            .then(response => response.status !== 200 ? showError(response) : response.json())
            .then(data => setData(data))

        fetch('/get_bosses',{
        })
            .then(response => response.status !== 200 ? showError(response) : response.json())
            .then(data => setBosses(data))

    }, []);

    const setUserData = (data) =>{
        if (data !== null && data !== undefined){
            /* if(!isAdmin(data)){
                window.location.href = "/forbidden403"
            }else{
            } */
            setUser(data[0])
        }
    }

    const isAdmin = (user) =>{
        let roles = user.roles;
        for(var i = 0; i < roles.length; i++){
            if (roles[i] === "ADMIN"){
                return true;
            }
        }

        return false;
    }


     const onSearch = (value) => {
         let str = ""
         if(value.currentTarget != undefined){
            str = value.currentTarget.value.trim();
         }else{
            str = value.trim();
         }


         if(str ===''){
             setMembers(MEMBERS);

         }else{
             let foundMembers = [];
             for(var i = 0; i < MEMBERS.length; i++){
                 var stringObject = MEMBERS[i].name + " " + MEMBERS[i].classEn + "" + MEMBERS[i].level + "" + MEMBERS[i].rank + "" + MEMBERS[i].race + "" +
                 MEMBERS[i].regionEn;
                 if(stringObject.toLowerCase().includes(str.toLowerCase())){
                     foundMembers.push(MEMBERS[i]);
                 }

             }
         setMembers(foundMembers);
         }
         //SEARCH = str
     }

    const handleChange = (value) => {
        console.log(value);
    }



   return (
        <div id="mainDiv">
          <Layout style={{position:"absolute", minHeight:"100%", width:"100%"}}>
            <Spin size="large" spinning={loading}>
            <AppNavbar style = {{height:"10%"}} setFunction={setLanguage} patchName = {patchName}/>
            </Spin>
             <Layout>
                <MenuComponent setBosses={setBosses} setContentType = {setContentType} user={user} loading = {loading} setSearchValue = {setSearchValue} setLoading = {setLoading} setData = {setData} language = {currentLanguage}/>
                <Layout style={{minHeight:"100%"}}>
                    <Content disabled = {true}>

                         <ContentDiv contentType = {contentType} />
                    </Content>

                </Layout>
             </Layout>

           </Layout>
           </div>
         );
}



export default function MembersPage(props){
return <Members {... props}/>

}