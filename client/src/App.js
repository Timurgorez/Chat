import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";

import './App.css';
import MainPage from './pages/MainPage';
import LiveChat from "./pages/LiveChat";
import LiveChatNew from "./pages/LiveChatNew";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Switch>
          <Route exact path="/" component={MainPage}/>

           {/*<Route path="/chat" exact component={LiveChatNew} />*/}


          <Route path="/room/:roomId/:userName" exact component={LiveChat}/>


          {/* User */}
          {/* {isAuthenticated(this.props) && (
           <Route path="/user/my-features" component={MyFeatures} />
           )}
           {isAuthenticated(this.props) && (
           <Route path="/user/my-profile" component={MyProfile} />
           )} */}

          {/* Admin */}

          {/* {isAdmin(this.props) && (
           <Route path="/admin/posts" exact component={AdminPosts} />
           )}
           {isAdmin(this.props) && (
           <Route path="/admin/users" exact component={Users} />
           )} */}
          {/* Auth */}
          {/* <Route path="/login" exact component={Login} />
           <Route path="/confimation" exact component={Confirmation} />
           <Route path="/registration" exact component={Registration} /> */}
          {/* No found */}
          {/*<Route render={() => <div style={{background: "url=''"}}>fvd</div>} />*/}
          {/* <Route exact component={NotFound} /> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
