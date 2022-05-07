import AppNavbar from './../nav_bar/GeneralNavBar.jsx';
import { Table, Tag, Space, Popconfirm, Menu, Button, message, Upload, Layout, Input, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import {
  PlusCircleOutlined,
  DownloadOutlined,
  MehTwoTone ,
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';

const { Search } = Input;
const { Sider, Content } = Layout;
const { Column, ColumnGroup } = Table;
const cookies = new Cookies();
const {pagination, Return, handleStandardTableChange} = Table;
const userRolesFilter =[]
const userActiveFilter =[]
let Users = []
let languageLocal;




userActiveFilter.push({text:"true",value:"true"})
userActiveFilter.push({text:"false",value:"false"})


userRolesFilter.push({text:"USER",value:"USER"})
userRolesFilter.push({text:"ADMIN",value:"ADMIN"})


function DeleteButton(props){
    const remove = () => props.deleteFunction(props.id);
    return (<Space>
         <Popconfirm onConfirm={remove} title="Are you sure delete this user?" okText="Yes" cancelText="No">
           <a title={props.deleteButtonText}>{props.deleteButtonText}</a>
         </Popconfirm>
       </Space>
    );

}

const UserList = (props) =>{
    const [users, setUsers] = useState(null);

    if(props.language === "EN"){
        props.setSearchPlaceHolder ("input search text");
        props.setEditButtonText ("Edit");
        props.setDeleteButtonText  ("Delete");
        props.setActionColumnName("Action");
        props.setActiveColumnName("Is Active")
        props.setTypeColumnName ( "Roles")
        props.setEmailColumnName ("Email")
        props.setLoginColumnName ("User Login")
    }

    if(props.language === "UA"){
        props.setSearchPlaceHolder  ("введіть текст пошуку");
        props.setEditButtonText  ("Ред.");
        props.setDeleteButtonText  ("Видалити");
        props.setActionColumnName  ("Дії");
        props.setActiveColumnName  ("Активність")
        props.setTypeColumnName  ("Ролі")
        props.setEmailColumnName  ("Пошта");
        props.setLoginColumnName ( "Логін");
    }

    const updateUsers = (data) =>{
        let newArray = Object.entries(data)
        let map = new Map(newArray);
        if(map.keys().next().value === 'Deleted' || map.keys().next().value === 'Saved' || map.keys().next().value === 'Successful'){
            message.success(map.keys().next().value);
        }else{
            message.error(map.keys().next().value);
        }
        setUsers(map.values().next().value);
        Users = map.values().next().value;

    }
    const updateUsers2 = (data) =>{
        setUsers(data);
        Users = data;
    }

    useEffect(() => {
        fetch('/get_users',{

        })
            .then(response => response.json())
            .then(data => updateUsers2(data))

    }, []);
    const remove = (id) =>{
        const XSRFToken  = cookies.get('XSRF-TOKEN')
             fetch('/delete_user/' + id, { method: 'DELETE',
                headers: {
                  'X-XSRF-TOKEN': XSRFToken,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                credentials: 'include',

            })
            .then(response => response.json())
            .then(data => updateUsers(data));

    };

    const onSearch = value => {
        let str = value.currentTarget.value.trim();

        if(str ===''){
            setUsers(Users);

        }else{
            let searchUsers = [];
            for(var i = 0; i < Users.length; i++){
                var stringObject = Users[i].username + ', ' + Users[i].email + ', ' + Users[i].roles + ', ' + Users[i].isActive;
                if(stringObject.toLowerCase().includes(str.toLowerCase())){
                    searchUsers.push(Users[i]);
                }

            }
            setUsers(searchUsers);

        }
    }


   return (
       <Layout style={{width:'80%', position:'relative', left:'10%', marginTop:'5%'}}>
          <Layout style={{ padding: '0 24px 24px' }}>
              <Content
                  style={{minHeight:850}}
              >
              <br/>

              <Search style={{width:'240px'}} placeholder={props.searchPlaceHolder} onChange={onSearch} enterButton />
              <Table  dataSource={users}
                  sticky


                  pagination= { {pageSizeOptions: ['10', '20', '40', '50' ,'70' ,'100'], showSizeChanger: true}}
              >

                <Column title={props.loginColumnName} dataIndex="username" key="user_name"
                    fixed= 'left'
                    sorter= {(a, b) => a.username.localeCompare(b.username)}
                />
                <Column title={props.emailColumnName} dataIndex="email" key="email"
                    sorter= {(a, b) => a.email.localeCompare(b.email)}
                />
                <Column title={props.typeColumnName} dataIndex="roles" key="roles"
                    render= {roles => (
                          <Row gutter={[2, 3]}>
                            {roles.map(role => {
                              let color = 'orange';
                              if(role.includes("ADMIN")){
                                color = 'green'
                              }else{
                                if(role.includes("RAIDER")){
                                    color = 'red'
                                }else{
                                    if(role.includes('OFFICER')){
                                        color = '#0693e3'
                                    }
                                }
                              }

                              return (
                               <Col >
                                <Tag color={color} key={role}
                                  filters={userRolesFilter}
                                  onFilter={ (value, record) => record.role.indexOf(value) === 0}
                                >
                                  {role.toUpperCase()}
                                </Tag>
                               </Col>
                              );
                            })}
                          </Row>
                        )
                    }
                />
                <Column id='is_active' title={props.activeColumnName} dataIndex="enabled" key="is_active"
                    accessor = {d => d.toString()}
                    filters={userActiveFilter}
                    onFilter={ (value, record) => record.enabled.toString().indexOf(value) === 0}
                    render= {enabled => {
                           let color = enabled.toString().includes('true') ? 'green' : 'red';
                              return (<Tag color={color}>
                                       {enabled.toString()}
                                      </Tag>
                              )
                    }}

                />

                <Column
                  fixed="right"
                  title={props.actionColumnName}
                  key="action"
                  render={(text, record) => (
                    <Space key="space" size="small">
                      <Link title={props.editButtonText}  type="link" to={'/edit_user/' + record.id}>{props.editButtonText}</Link>

                      <DeleteButton id={record.id} deleteFunction={remove} deleteButtonText = {props.deleteButtonText} key="delete"/>
                    </Space>
                  )}
                />
               </Table>
              </Content>

           </Layout>
       </Layout>
   );


}




const Admin = () =>{
    languageLocal = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";
    const [currentLanguage, setLanguage] = useState(languageLocal);
    const [loginColumnName, setLoginColumnName] = useState('');
    const [emailColumnName, setEmailColumnName] = useState('');
    const [typeColumnName, setTypeColumnName] = useState('');
    const [activeColumnName, setActiveColumnName] = useState('');
    const [actionColumnName, setActionColumnName] = useState('');
    const [deleteButtonText, setDeleteButtonText] = useState('');
    const [editButtonText, setEditButtonText] = useState('');
    const [searchPlaceHolder, setSearchPlaceHolder] = useState('');
    let patchName = window.location.pathname;



   return (
          <Layout>
            <AppNavbar setFunction={setLanguage} patchName = {patchName}/>
            <UserList
                language ={currentLanguage}
                setLanguage = {setLanguage}
                loginColumnName = {loginColumnName}
                setLoginColumnName = {setLoginColumnName}
                emailColumnName = {emailColumnName}
                setEmailColumnName = {setEmailColumnName}
                typeColumnName = {typeColumnName}
                setTypeColumnName = {setTypeColumnName}
                activeColumnName = {activeColumnName}
                setActiveColumnName = {setActiveColumnName}
                actionColumnName = {actionColumnName}
                setActionColumnName = {setActionColumnName}
                deleteButtonText = {deleteButtonText}
                setDeleteButtonText = {setDeleteButtonText}
                editButtonText = {editButtonText}
                setEditButtonText = {setEditButtonText}
                searchPlaceHolder = {searchPlaceHolder}
                setSearchPlaceHolder = {setSearchPlaceHolder}
            />
           </Layout>
         );
}



export default function AdminPage(){

return <Admin />

}