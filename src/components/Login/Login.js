import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../context/auth-context';
import Input from '../UI/Input/Input';

const reducerEmail = (state, action) => {
  console.log('reducer Email');
  if(action.type === 'INPUT_EMAIL') {
    return {value: action.val, isValid: action.val.includes('@')};
  }
  if(action.type === 'BLUR_EMAIL'){
    return {value: state.value, isValid: state.value.includes('@')};
  }
  return {value: '', isValid: false};
}

const reducerPassword = (state, action) => {
  if(action.type === 'INPUT_PWD'){
    return {value: action.val, isValid: action.val.trim().length > 6}
  }
  if(action.type === 'BLUR_PWD'){
    return {value: state.value, isValid: state.value.trim().length > 6};
  }
  return {value: '', isValid: false};
}


const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [stateEmail, dispatchEmail] = useReducer(reducerEmail, {value: '', isValid: null});
  const [statePassword, dispatchPassword] = useReducer(reducerPassword, {value: '', isValid: null});

  const loginCtx = useContext(AuthContext);

  const emailRef = useRef();
  const passwordRef = useRef();


  useEffect(()=> {
    const timerId = setTimeout(()=>{
      console.log('VALIDATION');
      setFormIsValid(
        stateEmail.isValid && statePassword.isValid
      );
    },500);
    
    return ()=>{
      console.log('CLEAN UP');
      clearTimeout(timerId);
    }
  }, [stateEmail.isValid, statePassword.isValid]);

  const emailChangeHandler = (event) => {

    dispatchEmail({type: 'INPUT_EMAIL', val: event.target.value});

  };

  const passwordChangeHandler = (event) => {

    dispatchPassword({type:"INPUT_PWD", val: event.target.value});

  };

  const validateEmailHandler = () => {
    dispatchEmail({type: 'BLUR_EMAIL'});
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'BLUR_PWD'});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid) {
      loginCtx.onLogin(stateEmail.value, statePassword.value);
    } else if(!stateEmail.isValid) {
      emailRef.current.focus();
      
    } else if (!statePassword.isValid) {
      passwordRef.current.focus();
    }
    
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailRef}
          id={'email'}
          label={'E-Mail'}
          type={'email'}
          isValid={stateEmail.isValid}
          value={stateEmail.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordRef}
          id={'password'}
          label={'Password'}
          type={'password'}
          isValid={statePassword.isValid}
          value={statePassword.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
