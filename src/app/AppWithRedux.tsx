import React, {useEffect} from 'react';
import './App.css';
import {
  AppBar, CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography
} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {initializeAppTC, RequestStatusType} from "./app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Login} from "../features/Login/Login";
import {Redirect, Route, Switch} from "react-router-dom";
import {TodolistsList} from "../features/TodolistList/TodolistList";
import {logoutTC} from "../features/Login/auth-reducer";


export type FilterValuesType = "all" | "active" | "completed";

export function AppWithRedux() {
  const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
  const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
  let dispatch = useDispatch()
  const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)


  useEffect(() => {
    dispatch(initializeAppTC())
  }, [dispatch])

  if (!isInitialized) {
    return <div
      style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
      <CircularProgress/>
    </div>
  }
  const logout = () => {
    dispatch(logoutTC())
  }
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu/>
          </IconButton>
          <Typography variant="h6">
            News
          </Typography>
          {isLoggedIn && <Button color={"inherit"} onClick={logout}>Log out</Button>}
        </Toolbar>
        {status === 'loading' && <LinearProgress color={'secondary'}/>}
      </AppBar>
      <Container fixed>
        <Switch>
          <Route exact path={'/'} render={() => <TodolistsList/>}/>
          <Route path={'/login'} render={() => <Login/>}/>
          <Route path={'*'} render={() => <h1>404: PAGE NOT FOUND</h1>}/>
          <Redirect from={'*'} to={'/404'}/>
        </Switch>
      </Container>
      <ErrorSnackbar/>
    </div>
  );
}

