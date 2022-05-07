import { Form, Input, Button, Checkbox, message, Space} from 'antd';
import AppNavbar from './../nav_bar/LoginNavBar.jsx';
import 'antd/dist/antd.css';
import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import  './Auth.css';


const cookies = new Cookies();
const XSRFToken  = cookies.get('XSRF-TOKEN')
let language = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";

const getLogin = (data, language) =>{
    let mess = cookies.get("message");

    if(mess === "DoesNotExist"){

        if(language == "UA"){
            message.warning("Користувач із зазначеним іменем не існує ");
        }
        if(language == "EN"){
            message.warning("The user with the specified name does not exist");
        }

    }else{
        if(mess === "WrongPassword"){
            console.log("here");
            if(language == "UA"){
                message.warning("Неправильний пароль");
            }

            if(language == "EN"){
                message.warning("Wrong password");
            }
        }else{
            if(mess === "Successful"){
                window.location.href = "/home";
            }
        }
    }


}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const LoginForm = (props) =>{
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
      let username = values.username;
      let password = values.password;
      fetch('/perform_login?username=' + username + '&password=' + password,{
            method: 'POST',
            mode:'cors',
            headers: {
              'X-XSRF-TOKEN': XSRFToken,
            credentials: 'include'
            },
            }).then(response=> response.status !=200 ? message.error("Something goes wrooong. status:" + response.status + ", status text:" + response.statusText) :
            getLogin(response, props.currentLanguage));
    }

    if(props.currentLanguage === "EN"){
      props.setBtnText("Log in");
      props.setPassErrText("Please input your password!");
      props.setPassLabelText("Password");
      props.setUserErrText("Please input your username!");
      props.setUserLabelText("UserName");
      props.setRegText("or register");
    }
    if(props.currentLanguage === "UA"){
      props.setBtnText("Увійти");
      props.setPassErrText("Будь ласка, введіть Ваш пароль");
      props.setPassLabelText("Пароль");
      props.setUserErrText("Будь ласка, введіть Ваш логін");
      props.setUserLabelText("Логін");
      props.setRegText("або зареєструватися");
    }


    return (<div className="login_form">
        <Form form = {form}
          {...layout}
          name="basic"
          onFinish={onFinish}
        >
          <Form.Item
            label={props.userLabelText}
            name="username"
            rules={[{ required: true, message: props.userErrText }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={props.passLabelText}
            name="password"
            rules={[{ required: true, message: props.passErrText }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space>
            <Button type="primary" htmlType="submit">
              {props.btnText}
            </Button>
            <Link to="/registration">{props.regText}</Link>
            </Space>
          </Form.Item>
        </Form>
    </div>)

}

const LoginPage = () => {

  const [currentLanguage, setLanguage] = useState(language);
  const [userLabelText, setUserLabelText] = useState("");
  const [passLabelText, setPassLabelText] = useState("");
  const [userErrText, setUserErrText] = useState("");
  const [passErrText, setPassErrText] = useState("");
  const [btnText, setBtnText] = useState("");
  const [regText, setRegText] = useState("");

  return (

  <div>
    <AppNavbar setFunction={setLanguage}/>

    <LoginForm
        currentLanguage = {currentLanguage}
        setUserLabelText = {setUserLabelText}
        setPassLabelText = {setPassLabelText}
        setUserErrText = {setUserErrText}
        setPassErrText = {setPassErrText}
        setBtnText = {setBtnText}
        userLabelText = {userLabelText}
        passLabelText = {passLabelText}
        userErrText = {userErrText}
        passErrText = {passErrText}
        btnText = {btnText}
        regText = {regText}
        setRegText = {setRegText}
    />
  </div>
  );
};

export default function Login(){
    return (
        <LoginPage/>
)
}