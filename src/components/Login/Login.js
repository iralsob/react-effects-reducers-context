import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

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
    props.onLogin(stateEmail.value, statePassword.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            stateEmail.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={stateEmail.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            statePassword.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={statePassword.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
