import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Container, Grid, Button, TextField, FormControl } from '@material-ui/core';
import { useHistory } from "react-router";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import socket from '../socket';




import './MainPage.styles.scss';
import {showAlert} from "../store/appHelpers/actions/appHelpersActions";
import * as actionTypes from "../store/apiData/actionTypes";

function MainPage() {

  const history = useHistory();

  // get state in STORE

  // const chat = useSelector(state => state.api.chat);

  // END get state in STORE

  const dispatch = useDispatch();
  // dispatch(hideLoader())

  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');


  const submitFormHandler = async (e) => {
    e.preventDefault();
    if(roomId.trim() && userName.trim()){
      await axios.post('/rooms', {userName, roomId})
        .then(res => {
          console.log('POST', res.data);
        });
      setRoomId('');
      setUserName('');
      dispatch({
        type: actionTypes.SET_IS_AUTH,
        payload: true
      });
      history.push('/room/'+ roomId + '/' + userName);
      socket.emit('ROOM:JOIN', {
        roomId,
        userName
      });
      toast.success('Welcome in room!');
    }
  };


  return (
    <React.Fragment>

      <Container maxWidth="xl" className="live-chat__container">
        <h1>Create privat chat</h1>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <form className="form" noValidate autoComplete="off" onSubmit={submitFormHandler}>
              <div>
                <FormControl fullWidth className="input-wrapper" variant="outlined">
                  <TextField
                    className="name-input"
                    id="name-input"
                    label="Your name"
                    value={userName}
                    name="userName"
                    onChange={e => setUserName(e.target.value)}
                    variant="outlined"
                  />
                  <TextField
                    className="room-input"
                    id="room-input"
                    label="Room name"
                    name="roomId"
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
                <Button type="submit" variant="contained" color="secondary">
                  Go to room
                </Button>
              </div>
            </form>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export default MainPage;
