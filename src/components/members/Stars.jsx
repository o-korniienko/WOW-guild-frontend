import AppNavbar from './../nav_bar/GeneralNavBar.jsx';
import { Table, Form, Select, Space, Button, Popconfirm,Typography, Menu, message, Layout, Input, Spin, Modal, Alert, Card, Col, Row, Pagination, List, Affix} from 'antd';
import 'antd/dist/antd.css';
import  './MembersStyle.css';
import styled from 'styled-components'
import {
  PlusCircleOutlined,
  SyncOutlined,
  BarChartOutlined,
  ReloadOutlined,
  MinusOutlined,
  PlusOutlined
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
const { Option } = Select;
const { Text } = Typography;


let MEMBERS = [];
let languageLocal;
let BOSSES = [];
let RAIDS = [];
let difficulties = [];
let criteria  = [];
let currentDifficultyNumber = 5;
let currentMetric = "dps";
let currentBossLocal;
let ALLRANKEDCHARACTERS = [];




function isAdmin(user){
    let roles = user.roles;
    for(var i = 0; i < roles.length; i++){
        if (roles[i] === "ADMIN"){
            return true;
        }
    }
    return false;
}

const MembersList = (props) =>{
    const { Column, ColumnGroup } = Table;

    var characterNameTitle = "Character"
    var maxDPSTitle = "Max DPS"
    var averageDPSTitle = "Average DPS"
    var totalKillsTitle = "Total Kills"
    var dpsTitle = "DPS"
    var killIlvlTitle = "kill ilvl"
    var dateTitle = "date";
    var maxHPSTitle = "Max HPS"
    var averageHPSTitle = "Average HPS"
    var hpsTitle = "HPS"

    if(props.currentLanguage === "EN"){
        characterNameTitle = "Character"
        maxDPSTitle = "Max DPS"
        averageDPSTitle = "Average DPS"
        dpsTitle = "DPS"
        maxHPSTitle = "Max HPS"
        averageHPSTitle = "Average HPS"
        hpsTitle = "HPS"
        totalKillsTitle = "Total Kills"
        killIlvlTitle = "kill ilvl"
        dateTitle = "date"

    }
    if(props.currentLanguage === "UA"){
        characterNameTitle = "Персонаж"
        maxDPSTitle = "Максимальне УЗС"
        averageDPSTitle = "Середнє УЗС"
        totalKillsTitle = "Загальна Кількість Вбивств"
        dpsTitle = "УЗС"
        killIlvlTitle = "рівень при вбивстві"
        dateTitle = "дата"
        maxHPSTitle = "Максимальний ВЗС"
        averageHPSTitle = "Середній ВЗС"
        hpsTitle = "ВЗС"

    }


    function showTotal(total) {
      return `${total}  `;
    }

    if(currentMetric === "dps"){
        return(
            <StyledTable dataSource={props.members}
            pagination = {{ total:"members.length", showTotal:showTotal, pageSizeOptions: ['10', '20', '40', '50' ,'70' ,'100'], showSizeChanger:true}}
            sticky

            style = {{position:"relative", width:"96%", left:"2%", marginTop:"3%"}}
            rowClassName={(record, index) => ("rows")}
            expandable = {{
               expandedRowRender: record => {return (
                    <StyledTable dataSource={record.ranks}
                     pagination = {false}
                     style = {{position:"relative", marginButton:"2%"}}
                     rowClassName={(record, index) => ("rows")}
                     >
                    <Column align="center" width='15%' title={dpsTitle} dataIndex="amount" key="amount"
                         sorter= {(a, b) => a.dps.toString().localeCompare(b.dps.toString())}
                     />
                      <Column align="center" width='13%' title={killIlvlTitle} dataIndex="killIlvl" key="killIlvl"
                          sorter= {(a, b) => a.killIlvl.toString().localeCompare(b.killIlvl.toString())}
                      />
                      <Column align="center" width='13%' title={dateTitle} dataIndex="date" key="date"/>

                    </StyledTable>
                )}
            }}

            expandIcon={({ expanded, onExpand, record }) =>
              expanded ? (
                <MinusOutlined title = "hide history" onClick={(e) => onExpand(record, e)}   />
              ) : (
                <PlusOutlined title = "show history" onClick={(e) => onExpand(record, e)}   />
              )
            }
            >

             <Column  align = "center" width = "23%" title={characterNameTitle} dataIndex="name" key="name"
              sorter= {(a, b) => a.name.localeCompare(b.name)}
              render = {(name, member) => {
                    var color = ""
                    switch(member.classEn){
                        case "Warrior" : color = "#C69B6D";

                        break
                        case "Paladin" : color = "#F48CBA";

                        break
                        case "Hunter" : color = "#AAD372";

                        break
                        case "Rogue" : color = "#FFF468";

                        break
                        case "Priest" : color = "white";

                        break
                        case "DeathKnight" : color = "#C41E3A";

                        break
                        case "Shaman" : color = "#0070DD";

                        break
                        case "Mage" : color = "#3FC7EB";

                        break
                        case "Warlock" : color = "#8788EE";

                        break
                        case "Monk" : color = "#00FF98";

                        break
                        case "Druid" : color = "#FF7C0A";

                        break
                        case "DemonHunter" : color = "#A330C9";

                        break

                    }
                    return (
                      <Text style = {{color:color}}>
                       {name}
                      </Text>
                    );
                  }
              }
             />

             <Column  width = "23%" align="center"  title={maxDPSTitle} dataIndex="max" key="max"
              sorter= {(a, b) => a.max.toString().localeCompare(b.max.toString())}
             />
             <Column  width = "23%" align="center"  title={averageDPSTitle} dataIndex="average" key="average"
             sorter= {(a, b) => a.average.toString().localeCompare(b.average.toString())}
             />
             <Column  width = "23%" align="center" title={totalKillsTitle} dataIndex="totalKills" key="totalKills"
              sorter= {(a, b) => a.totalKills.toString().localeCompare(b.totalKills.toString())}
             />


            </StyledTable>
        )
    }else{
        return(
            <StyledTable dataSource={props.members}
            pagination = {{ total:"members.length", showTotal:showTotal, pageSizeOptions: ['10', '20', '40', '50' ,'70' ,'100'], showSizeChanger:true}}
            sticky

            style = {{position:"relative", width:"96%", left:"2%", marginTop:"3%"}}
            rowClassName={(record, index) => ("rows")}
            expandable = {{
               expandedRowRender: record => {return (
                    <StyledTable dataSource={record.ranks}
                     pagination = {false}
                     style = {{position:"relative", marginButton:"2%"}}
                     rowClassName={(record, index) => ("rows")}
                     >
                    <Column align="center" width='15%' title={hpsTitle} dataIndex="amount" key="amount"
                         sorter= {(a, b) => a.dps.toString().localeCompare(b.dps.toString())}
                     />
                      <Column align="center" width='13%' title={killIlvlTitle} dataIndex="killIlvl" key="killIlvl"
                          sorter= {(a, b) => a.killIlvl.toString().localeCompare(b.killIlvl.toString())}
                      />
                      <Column align="center" width='13%' title={dateTitle} dataIndex="date" key="date"/>

                    </StyledTable>
                )}
            }}

            expandIcon={({ expanded, onExpand, record }) =>
              expanded ? (
                <MinusOutlined title = "hide history" onClick={(e) => onExpand(record, e)}   />
              ) : (
                <PlusOutlined title = "show history" onClick={(e) => onExpand(record, e)}   />
              )
            }
            >



             <Column  align = "center" width = "23%" title={characterNameTitle} dataIndex="name" key="name"
              sorter= {(a, b) => a.name.localeCompare(b.name)}
              render = {(name, member) => {
                    var color = ""
                    switch(member.classEn){
                        case "Warrior" : color = "#C69B6D";

                        break
                        case "Paladin" : color = "#F48CBA";

                        break
                        case "Hunter" : color = "#AAD372";

                        break
                        case "Rogue" : color = "#FFF468";

                        break
                        case "Priest" : color = "white";

                        break
                        case "DeathKnight" : color = "#C41E3A";

                        break
                        case "Shaman" : color = "#0070DD";

                        break
                        case "Mage" : color = "#3FC7EB";

                        break
                        case "Warlock" : color = "#8788EE";

                        break
                        case "Monk" : color = "#00FF98";

                        break
                        case "Druid" : color = "#FF7C0A";

                        break
                        case "DemonHunter" : color = "#A330C9";

                        break

                    }
                    return (
                      <Text style = {{color:color}}>
                       {name}
                      </Text>
                    );
                  }
              }
             />

             <Column  width = "23%" align="center"  title={maxHPSTitle} dataIndex="max" key="max"
              sorter= {(a, b) => a.max.toString().localeCompare(b.max.toString())}
             />
             <Column  width = "23%" align="center"  title={averageHPSTitle} dataIndex="average" key="average"
             sorter= {(a, b) => a.average.toString().localeCompare(b.average.toString())}
             />
             <Column  width = "23%" align="center" title={totalKillsTitle} dataIndex="totalKills" key="totalKills"
              sorter= {(a, b) => a.totalKills.toString().localeCompare(b.totalKills.toString())}
             />


            </StyledTable>
        )
    }
}

/* const MenuComponent = (props) =>{
        const [collapsed, setCollapsed] = useState(true);
        const toggleCollapsed = () => {
            collapsed ? setCollapsed(false) : setCollapsed(true);
        };
        let language = props.language;
        let updateText2 = "Update Ratings Data"


        if(language === "UA"){
             updateText2 = "Оновити Рейтинги"
        }

        if(props.user !== null && !isAdmin(props.user) ){
            let adminMenu = document.getElementById('admin');
            if(adminMenu != null){
               adminMenu.style.display = 'none';
            }
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
            .then(data => setData(data));
        }

        const setData = (data) =>{

            let mainDiv = document.getElementById('mainDiv');
            if(mainDiv != null){
               mainDiv.className = 'main_div_enabled';
            }
            var bosses = [];
            if(data != null && data != undefined){
                var bossesSet = new Set();
                for(var i = 0; i < data.length; i++){
                   var ranks = data[i].ranks;
                   for(var j = 0; j < ranks.length; j++){
                        bossesSet.add(ranks[j].boss);
                   }
                }
                for(const value of bossesSet){
                    bosses.push(value);
                }

            }

            props.setRaidsData(bosses, false);
            props.setData(data)

            props.setLoading(false);
        }

        return (<Sider  collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <Affix offsetTop ={5}>
          <Menu
            defaultSelectedKeys={['1']}
            mode="inline"

            inlineCollapsed={collapsed}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<ReloadOutlined style={{color:'#1a854f', fontSize:'150%'}}/>}>
             <Link style={{color:'#1a854f', fontSize:'100%'}} onClick = {updateRankingData}>
               {updateText2}
             </Link>
             </Menu.Item>

          </Menu>
          </Affix>
        </Sider>)

} */

const showError = (response, setLoading) =>{
    if(setLoading != null && setLoading != undefined){
        setLoading(false);
    }
    message.error("Oooops, something goes wrong. \n error: " + response.status + "\n error description: " + response.statusText)
}



const StyledTable = styled(Table)`
    backgroundColor:red !important;
    font-family: "Trebuchet MS";
    border-radius: 25px !important;
    overflow: 'hidden'
    `



function MainContent (props){
    languageLocal = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";
    const [form] = Form.useForm();
    const [collapsed, setCollapsed] = useState(false);
    const [currentLanguage, setLanguage] = useState(languageLocal);
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState([])
    const [raids, setRaids] = useState(null);
    const [currentRaid, setCurrentRaid] = useState(null);
    const [bosses, setBosses] = useState(null);
    const [raidBosses, setRaidBosses] = useState(null);
    const [currentBoss, setCurrentBoss] = useState(null);
    const [user, setUser] = useState(null);
    const [difficultyText, setDifficultyText] = useState("");
    const [metricText, setMetricText] = useState("");



    let patchName = window.location.pathname;



    const setMembersData = (value) =>{
        ALLRANKEDCHARACTERS = value;
        value = getFilteredMembers(value);
        setMembers(value);
        MEMBERS = value;

        setLoading(false);
    }

    const getFilteredMembers = (data) =>{
        var result = []
        var key = 0;
        if(data != null && data != undefined){
            for(var i = 0; i < data.length; i++){
                var characterRanks = data[i].ranks;
                for(var j = 0; j < characterRanks.length; j++){
                    if(characterRanks[j].boss.name === currentBossLocal && characterRanks[j].boss.difficulty.toString() === currentDifficultyNumber.toString() && characterRanks[j].metric === currentMetric){

                        var characterRank = {
                            key:key,
                            id:data[i].id,
                            name:data[i].name,
                            classEn:data[i].classEn,
                            max:characterRanks[j].maxAmount,
                            average:characterRanks[j].average,
                            totalKills:characterRanks[j].totalKills,
                            ranks:characterRanks[j].ranks

                        }

                        result.push(characterRank);
                        key++;
                    }
                }
            }
        }

        result.sort(function(a, b) {
          return b.max - a.max;
        });

        return result;
    }

        difficulties = []
        criteria = []

        if(currentLanguage === "EN"){
            difficulties.push(<Option style={{color:"#194d33"}} key={"5"}>Mythic</Option>)
            difficulties.push(<Option style={{color:"#194d33"}} key={"4"}>Heroic</Option>)
            difficulties.push(<Option style={{color:"#194d33"}} key={"3"}>Normal</Option>)
            criteria.push(<Option style={{color:"#194d33"}} key={"dps"}>DPS</Option>)
            criteria.push(<Option style={{color:"#194d33"}} key={"hps"}>HPS</Option>)

        }
        if(currentLanguage === "UA"){
            difficulties.push(<Option style={{color:"#194d33"}} key={"5"}>Міфічний</Option>)
            difficulties.push(<Option style={{color:"#194d33"}} key={"4"}>Героїчний</Option>)
            difficulties.push(<Option style={{color:"#194d33"}} key={"3"}>Нормал</Option>)
            criteria.push(<Option style={{color:"#194d33"}} key={"dps"}>УЗС</Option>)
            criteria.push(<Option style={{color:"#194d33"}} key={"hps"}>ВЗС</Option>)

        }


    const setRaidsData = (value, isPageLoading) =>{

        if(value != null && value != undefined && value.length > 0){
            setBosses(value);
            let raidsSelections = [];

            let currentBossesSet = new Set();
            let bossesSelector = [];
            let allBossesSet = new Set();
            let Raids = [];
            for(var i = 0; i < value.length; i++){
                Raids.push(value[i].zone);
            }
            const key = "zoneName"



            var uniqueRaids = [...new Map(Raids.map(item=>[item[key], item])).values()]

            uniqueRaids.sort(function(a, b) {

              return b.maxLevel - a.maxLevel;
            });



            RAIDS = uniqueRaids;
            setCurrentRaid(uniqueRaids[0].zoneName);
            for(var k = 0; k < value.length; k++){
                allBossesSet.add(value[k].name);
                if(value[k].zone.zoneName === uniqueRaids[0].zoneName){
                    currentBossesSet.add(value[k].name);
                }
            }
            BOSSES = Array.from(value);

            let currentBosses = Array.from(currentBossesSet);
            for(var l = 0; l < uniqueRaids.length; l++){
                raidsSelections.push(<Option style={{color:"#194d33"}} key={uniqueRaids[l].zoneName}>{uniqueRaids[l].zoneName}</Option>);
            }

            setRaids(raidsSelections);
            setBossesByRaid(uniqueRaids[0].zoneName);

            getRankedMembers();

        }
        setLoading(false);
    }





    useEffect(() => {

        setLoading(true)
        setMetricText("dps");
        setDifficultyText("5");

        fetch('/get_user')
        .then(response=> response.status !== 200 ? showError(response, setLoading) : response.url.includes("login_in") ? window.location.href = "/login_in" : response.json())
        .then(data=>setUserData(data));

        /* fetch('/get_bosses',{
        })
            .then(response => response.status !== 200 ? showError(response) : response.json())
            .then(data => setRaidsData(data,true)) */

        setRaidsData(props.bosses, true);

    }, []);

    const setUserData = (data) =>{
        if (data !== null && data !== undefined){
            setUser(data[0])
        }
    }

    const getRankedMembers = () =>{
        fetch('/get_ranked_members')
        .then(response=> response.status !== 200 ? showError(response, setLoading) : response.url.includes("login_in") ? window.location.href = "/login_in" : response.json())
        .then(data=>setMembersData(data));

    }

    const onSearch = value => {
        let str = value.currentTarget.value.trim();


        if(str ===''){
            setMembers(MEMBERS);

        }else{
            let foundMembers = [];
            for(var i = 0; i < MEMBERS.length; i++){
                var stringObject = MEMBERS[i].name + " " + MEMBERS[i].classEn + "" + MEMBERS[i].classRu + "" + MEMBERS[i].level + "" + MEMBERS[i].rank + "" + MEMBERS[i].race + "" +
                MEMBERS[i].regionEn + "" + MEMBERS[i].regionRu;
                if(stringObject.toLowerCase().includes(str.toLowerCase())){
                    foundMembers.push(MEMBERS[i]);
                }

            }
        setMembers (foundMembers);
        }
    }

    const setBossesByRaid = (raidName) =>{
        var raidBossesSet = new Set();
        var raidBossesSelector = [];
        for(var i = 0; i < BOSSES.length; i++){
            if(BOSSES[i].zone.zoneName === raidName){
                raidBossesSet.add(BOSSES[i].name)
            }
        }


        for (const value of raidBossesSet){
            raidBossesSelector.push(<Option style={{color:"#194d33"}} key={value}>{value}</Option>)
        }



        setRaidBosses(raidBossesSelector);
        setCurrentBoss(Array.from(raidBossesSet)[0]);
        currentBossLocal = Array.from(raidBossesSet)[0];

    }

    const handleChange = (value) => {

    }

    const setRaid = (data) =>{
        setBossesByRaid(data);
        setCurrentRaid(data);
        setMembersData(ALLRANKEDCHARACTERS);
    }
    const setBoss = (data) =>{
        setCurrentBoss(data);
        currentBossLocal = data;
        setMembersData(ALLRANKEDCHARACTERS);
    }
    const setDifficulty = (data) =>{
        console.log(data);
        if(data != null && data != undefined){
            setDifficultyText(data) ;
            currentDifficultyNumber = data;
            setMembersData(ALLRANKEDCHARACTERS);
        }
    }

    const setMetric = (data) =>{
        if(data != null && data != undefined){
            setMetricText(data) ;
            currentMetric = data;
            setMembersData(ALLRANKEDCHARACTERS);
        }
    }



   return (
                    <>

                        <Input className = "search_style"  style={{position:" relative", top:'24px', left:"2%", width:'340px'}} placeholder="input search text" onChange={onSearch} enterButton />

                        <Select className = "custom_selector" disabled = {loading} style={{position:" relative", top:'24px', left:"3%", width:'200px', backgroundColor:"#e7dba2"}}

                           placeholder="Please select"
                           onChange={setRaid}
                           value = {currentRaid}

                         >
                           {raids}
                         </Select>
                         <Select className = "custom_selector" disabled = {loading} style={{position:" relative", top:'24px', left:"6%", width:'200px', backgroundColor:"#e7dba2"}}
                            placeholder="Please select"
                            onChange={setBoss}
                            value = {currentBoss}
                          >
                            {raidBosses}
                          </Select>

                          <Select className = "custom_selector" disabled = {loading} style={{position:" relative", top:'24px', left:"9%", width:'200px', backgroundColor:"#e7dba2"}}
                            placeholder="Please select"
                            onChange={setDifficulty}
                            value = {difficultyText}

                          >
                            {difficulties}
                          </Select>

                          <Select className = "custom_selector" disabled = {loading} style={{position:" relative", top:'24px', left:"12%", width:'200px', backgroundColor:"#e7dba2"}}
                            placeholder="Please select"
                            onChange={setMetric}
                            value = {metricText}

                          >
                            {criteria}
                          </Select>

                          <MembersList currentLanguage = {currentLanguage} members = {members}/>



                    </>
         );
}



export default function MembersPage(props){
return <MainContent {... props}/>

}