import React, {useState, useEffect} from 'react';
import {Container, Grid, Button, TextField, FormControl } from '@material-ui/core';
import {useHistory, useParams} from "react-router";
import toast from 'react-hot-toast';
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";


import './LiveChat.styles.scss';
import socket from '../socket';
import * as actionTypes from '../store/apiData/actionTypes';
import Paper from "@material-ui/core/es/Paper/Paper";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import CustomNotificationMsg from '../components/CustomNotificationMsg'


function LiveChat() {

  const dispatch = useDispatch();
  const history = useHistory();
  const {roomId, userName} = useParams();

  const users = Object.values( useSelector(state => state.api.users) );
  const isAuth = useSelector(state => state.api.isAuth);
  const messages = useSelector(state => state.api.messages);
  console.log('USERS', users);

  const [textMsg, setTextMsg] = useState('');

  useEffect(() => {

    console.log('isAuth', isAuth);
    if(!isAuth) history.push('/');

    socket.emit('ROOM:INIT_RUN', roomId);
    socket.on('ROOM:INIT_GET', data => {
      console.log('ROOM:INIT_GET', data);
      setUsers(data.users);
      setMessages(data.messages);
    });

    socket.on('ROOM:JOINED', data => {
      console.log('NEW room', data);
      toast.success('New user (' + data.newUser + ') is connected!');
      setUsers( data.users );
    });
    socket.on('ROOM:NEW_MESSAGE', data => {
      console.log('NEW_MESSAGE', data);

      const audio = new Audio('/fb_chat_pop_sound.mp3');
      audio.play();
      addMessage(data);
      if(document.querySelector('#msgField')){
        document.querySelector('#msgField').scrollTo({
          top: 99999,
          behavior: "smooth"
        });
        toast.success('New message from (' + data.userName + ') !');

      }else{
        toast.custom((t) => (<CustomNotificationMsg data={data} t={t} history={history} />));
      }
    });
    socket.on('ROOM:LEAVE', data => {
      console.log('LEAVE USER', data);
      toast.success('User (' + data.leaveUser + ') is disconnected!');
      setUsers( data.users );
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

  const sendMsg = () => {
    if(!textMsg) return;
    const obj = {
      userName,
      roomId,
      text: textMsg,
      date: (new Date()).toString()
    };
    addMessage(obj);
    setTimeout(function () {
      document.querySelector('#msgField').scrollTo({
        top: 99999,
        behavior: "smooth"
      });
    }, 100);
    socket.emit('ROOM:NEW_MESSAGE', obj);
    setTextMsg('');
  }

  const submitFormHandler = (e) => {
    e.preventDefault();
    sendMsg();
  };
  const submitFormByEnterHandler = (e) => {
    if(e.key === 'Enter' && e.type === "keypress" && !e.shiftKey){
      console.log('enter press here! ', e);
      sendMsg();
    }
  };

  return (
    <div className="live-chat">
      {/*<Link to="/">Go to another Chat</Link>*/}
      <h1>Private Chat</h1>
      <Container maxWidth="md" className="live-chat__container">
        <Grid container spacing={3} className="wrap-block">
          <Grid item xs={4} className="users-block">
            <h3>{users && users.length} users in room {roomId} </h3>
            {users && users.map((el) => (
              <p key={el.socketId}>{el.userName} : <Tooltip title={el.online ? "Online" : "Offline"} placement="bottom">
                <span className={['user-status', el.online ? "online" : "offline"]}></span>
              </Tooltip></p>
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
                    onKeyPress={submitFormByEnterHandler}
                    // disabled={error}
                  />
                </FormControl>
                <Button type="submit" variant="contained" color="secondary" disabled={!textMsg}>
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
