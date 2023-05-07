
import { Tree, Table, Space, Button, Popconfirm, Menu, message, Layout, Input, Spin, Modal, Alert, Card, Col, Row, Pagination, List, Affix} from 'antd';
import  './MembersStyle.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import wowLogo from './../logo/wow.png';
import wowLogsLogo from './../logo/wowLogs.png';
import RaiderIo from './../logo/raiderIo.png';
import {
  SyncOutlined
} from '@ant-design/icons';




const cookies = new Cookies();
const XSRFToken  = cookies.get('XSRF-TOKEN')


const showError = (response, setLoading) =>{
    if(setLoading != null && setLoading != undefined){
        setLoading(false)
    }
    message.error("Oooops, something goes wrong. \n error: " + response.status + "\n error description: " + response.statusText)
}

let SEARCH = ""

const MembersList = (props) =>{

    const [pageSize, setPageSize] = useState(15)
    const [members, setMembers] = useState(props.members)
    const [searchText, setSearchText] = useState(SEARCH)


    var MEMBERS = props.allMembers;

    let language = props.language;
    const goTo = (url) => {
        window.open(url);
    }
    let hunterName = "Hunter";
    let warName = "Warrior";
    let paladinName = "Paladin";
    let rogueName = "Rogue";
    let priestName = "Priest";
    let deathName = "DeathKnight";
    let shamanName = "Shaman";
    let mageName = "Mage";
    let warlockName = "Warlock";
    let monkName = "Monk";
    let druidName = "Druid";
    let demonName = "DemonHunter";
    let lvlName = "lvl";
    if(language === "EN"){
        hunterName = "Hunter";
        lvlName = "lvl";
        warName = "Warrior";
        paladinName = "Paladin";
        rogueName = "Rogue";
        priestName = "Priest";
        deathName = "DeathKnight";
        shamanName = "Shaman";
        mageName = "Mage";
        warlockName = "Warlock";
        monkName = "Monk";
        druidName = "Druid";
        demonName = "DemonHunter";

    }
    if(language === "UA"){
        hunterName = "Мисливець";
        lvlName = "рівня";
        paladinName = "Паладін"
        rogueName = "Пройдисвіт"
        priestName = "Жрець"
        deathName = "Рицарь Смерті"
        shamanName = "Шаман"
        mageName = "Маг"
        warlockName = "Чорнокнижник"
        monkName = "Монах"
        druidName = "Друїд"
        demonName = "Мисливець на Демонів"
        warName = "Воїн"
    }

   function showTotal(total) {
     return `${total}  `;
   }

   const updateCharacterData = (id) =>{
        //onSearch(SEARCH)
        props.setLoading(true);

        let mainDiv = document.getElementById('mainDiv');
        if(mainDiv != null){
           mainDiv.className = 'main_div_disabled';
        }
        fetch('/update_character_data/' + id, {
          method: 'POST',
          headers: {
            'X-XSRF-TOKEN': XSRFToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        .then(response=> response.status !== 200 ? showError(response, props.setLoading) : response.url.includes("login_in") ? window.location.href = "/login_in" : response.json())
        .then(data=>props.updateCharacterDataInTable(data,SEARCH));

   }

/*    const updateCharacterDataInTable = (data) =>{
        props.setLoading(false);
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
        return MEMBERS
   } */

    const onSearch = value => {
        let str = ""
        if(value.currentTarget != undefined){
         str = value.currentTarget.value.trim();
        }else{
         str = value;
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
        setMembers (foundMembers);
        }
        setSearchText(str)
        SEARCH = str
    }

    const ListData =() =>{
        if(members != undefined && members != null && members.length > 0){

            return(
            <>

            <List style={{position:'relative', width:'auto', marginLeft:"2%", marginTop:'3%'}}
                     itemLayout="horizontal"
                     grid={{ gutter: 0, column: 3 }}

                     pagination={{
                       total:members.length,
                       showTotal:showTotal,
                       pageSizeOptions: ['15', '30', '45', '60' ,'75' ,'90', '105', '120'],
                       onChange: (_, size) =>
                               setPageSize(size),
                       pageSize: pageSize,
                     }}
                     dataSource={members}
                     renderItem={member => {
                         let color = "white";
                         let className = "Warlock";

                         switch(member.classEn){
                             case "Warrior" : {color = "#C69B6D";
                                className = warName;}
                             break
                             case "Paladin" : {color = "#F48CBA";
                                className = paladinName;}
                             break
                             case "Hunter" : {color = "#AAD372";
                                className = hunterName;}
                             break
                             case "Rogue" : {color = "#FFF468";
                                className = rogueName}
                             break
                             case "Priest" : {color = "#FFFFFF";
                                className = priestName;}
                             break
                             case "DeathKnight" : {color = "#C41E3A";
                                className = deathName;}
                             break
                             case "Shaman" : {color = "#0070DD";
                                className = shamanName;}
                             break
                             case "Mage" : {color = "#3FC7EB";
                                className = mageName;}
                             break
                             case "Warlock" : {color = "#8788EE";
                                className = warlockName;}
                             break
                             case "Monk" : {color = "#00FF98";
                                className = monkName;}
                             break
                             case "Druid" : {color = "#FF7C0A";
                                className = druidName;}
                             break
                             case "DemonHunter" : {color = "#A330C9";
                                className = demonName;}
                             break

                         }
                         let iconUrl = member.iconURL

                         if(iconUrl === null || iconUrl === undefined){
                            iconUrl = "https://worldofwarcraft.com/ru-ru/character/eu/borean-tundra/%D0%BB%D1%8C%D0%BE%D1%88%D0%BA%D0%B0";
                         }

                         let title = member.name + ", " + className + " - " + member.level + lvlName;
                         let urlWOW = "https://worldofwarcraft.com/ru-ru/character/eu/" + member.regionEn +"/" + member.name;
                         let urlWOWLogs = "https://ru.warcraftlogs.com/character/eu/" + member.regionEn + "/" + member.name;
                         let urlRaiderIo = "https://raider.io/characters/eu/" + member.regionEn +"/" + member.name;

                         return(<>
                           <Col span={8}>
                            <Card hoverable
                              title = {title}
                              style={{textAlign: 'center', width: 370, backgroundColor:color}}
                              cover={<img alt="example" src={iconUrl}/>}
                              actions={[<SyncOutlined onClick = {()=>updateCharacterData(member.id)} style={{color:'#1a854f', fontSize:'200%'}}/>]}
                            >
                            <Space  >
                              <Link className="logo" onClick={()=>{goTo(urlWOW)}} ><img style={{maxWidth:'100%', height:'auto'}} src={wowLogo} /></Link>
                              <Link className="logo" onClick={()=>{goTo(urlWOWLogs)}} ><img style={{maxWidth:'100%', height:'auto'}} src={wowLogsLogo} /></Link>
                              <Link className="logo" onClick={()=>{goTo(urlRaiderIo)}} ><img style={{maxWidth:'100%', height:'auto'}} src={RaiderIo} /></Link>
                            </Space>
                            </Card>
                          </Col>
                          <br></br>
                          </>
                     )}}
                   />
                   </>)
        }else{
            return(<div>

            </div>)
        }
    }

    return (
        <>
         <Input id = "search_input" value={searchText} style={{position:" relative", top:'24px', left:"2%", width:'340px'}} placeholder="input search text" onChange={onSearch} enterButton />
         <ListData/>
        </>
    )
}

export default function ListMembers(props){
    return <MembersList {... props}/>
}