import React, {useState, useEffect} from 'react';
import {Container, Grid, Button, TextField, FormControl } from '@material-ui/core';
import {useHistory, useParams} from "react-router";
import toast from 'react-hot-toast';
import {useDispatch, useSelector} from "react-redux";

import './LiveChat.styles.scss';
import socket from '../socket';
import * as actionTypes from '../store/apiData/actionTypes';
import Paper from "@material-ui/core/es/Paper/Paper";



function LiveChat() {

  const dispatch = useDispatch();
  const history = useHistory();
  const {roomId, userName} = useParams();

  const users = Object.values( useSelector(state => state.api.users) );
  const isAuth = useSelector(state => state.api.isAuth);
  const messages = useSelector(state => state.api.messages);
  console.log('USERS', users);

  // const [ loading, setLoading ] = useState(true);
  const [textMsg, setTextMsg] = useState('');
  // const [ socket, setTextMsg ] = useState(null);
  // const [ arrMsgs, setArrMsgs ] = useState([]);
  // const [ color, setColor ] = useState('#' + Math.floor(Math.random()*16777215).toString(16));
  // const [ error, setError ] = useState('');
  // const [ invite, setInvite ] = useState(null);



  useEffect(() => {

    console.log('isAuth', isAuth);
    if(!isAuth) history.push('/');

    socket.emit('ROOM:INIT_RUN', roomId);
    socket.on('ROOM:INIT_GET', data => {
      console.log(data);
      setUsers(data.users);
      setMessages(data.messages);
    });

    socket.on('ROOM:JOINED', data => {
      console.log('NEW USER', data);
      toast.success('New user (' + data.newUser + ') is connected!');
      setUsers(data.users);
    });
    socket.on('ROOM:NEW_MESSAGE', data => {
      console.log('NEW_MESSAGE', data);
      toast.success('New message from (' + data.userName + ') !');
      addMessage(data);
      document.querySelector('#msgField').scrollTo({
        top: 99999,
        behavior: "smooth"
      });
    });
    socket.on('ROOM:LEAVE', data => {
      console.log('LEAVE USER', data);
      toast.success('User (' + data.leaveUser + ') is disconnected!');
      setUsers(data.users);
    });

  }, []);


  const addMessage = (data) => {
    dispatch({
      type: actionTypes.ADD_MESSAGE,
      payload: data
    })
  };
  const setUsers = (data) => {
    dispatch({
      type: actionTypes.SET_USERS,
      payload: data
    })
  };
  const setMessages = (data) => {
    dispatch({
      type: actionTypes.SET_MESSAGES,
      payload: data
    });
  };

  const submitFormHandler = (e) => {
    e.preventDefault();
    if(!textMsg) return;
    const obj = {userName, roomId, text: textMsg, date: (new Date()).toString() };
    addMessage(obj);
    setTimeout(function () {
      document.querySelector('#msgField').scrollTo({
        top: 99999,
        behavior: "smooth"
      });
    }, 100);
    socket.emit('ROOM:NEW_MESSAGE', obj);
    setTextMsg('');
  };

  return (
    <div className="live-chat">
      <h1>Private Chat</h1>
      <Container maxWidth="md" className="live-chat__container">
        <Grid container spacing={3} className="wrap-block">
          <Grid item xs={4} className="users-block">
            <h3>Online {users && users.length} users</h3>
            {users && users.map((el) => (
              <p key={el}>{el}</p>
            ))}
          </Grid>
          <Grid item xs={8} className="messages-block">
            <h3>Chat Area</h3>
            <div id="msgField">
              {messages.map((el, ind) => (
              <Paper className="chat-msg" elevation={3} key={ind} style={{background: 'lightgrey', marginLeft: el.userName === userName && '40px', marginRight: el.userName === userName && '0'}} >
                <span>{el.userName}</span>
                <p>{el.text}</p>
                <span className="chat-timestamp">{new Date(el.date).toISOString()}</span>
              </Paper>
              ))}
            </div>
            <hr />
            <form className="form" noValidate autoComplete="off" onSubmit={submitFormHandler}>
              <div>
                <FormControl fullWidth className="input-wrapper" variant="outlined">
                  <TextField
                    className="msg-input"
                    id="outlined-multiline-static"
                    label="Type here!"
                    multiline
                    rows={1}
                    value={textMsg}
                    onChange={e => setTextMsg(e.target.value) }
                    variant="outlined"
                    // disabled={error}
                  />
                </FormControl>
                <Button type="submit" variant="contained" color="secondary">
                  Send
                </Button>
              </div>
            </form>
          </Grid>
    </Grid>
      </Container>

    </div>
  );
}


export default LiveChat;
