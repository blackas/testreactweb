import React, { useState, useEffect } from 'react'; 
import PropTypes from 'prop-types';
import { Card, CardActions, CardContent, Typography, Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Badge from '@material-ui/core/Badge';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Tooltip from '@material-ui/core/Tooltip';

import CodeInfo from './CodeInfo';
import MyCalendar from '../components/Calender';
import { KAKAO_AUTH_URL, KAKAO_LOGOUT_URL } from "../components/Kakao/OAuth";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  bottom:{
   width: "100%",
   position: "fixed",
   bottom: "10",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

function HideOnScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({ target: window ? window() : undefined });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /*
    * Injected by the documentation to work in an iframe.
    * You won't need it on your project.
    */
    window: PropTypes.func,
};

export default function Navigation(props) {

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const [userinput, setUserInput] = useState("");

    //로그인 관련
    const [user_state,setUserState] = useState(new URL(window.location.href).searchParams.get('state'));
    const code = new URL(window.location.href).searchParams.get('code')

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };

    const CallKakaoAuth = () => {
        handleMenuClose()
        window.location.href = KAKAO_AUTH_URL
    }

    const CallKakaoLogout = () => {
        handleMenuClose()
        window.location.href = KAKAO_LOGOUT_URL
    }
    
    const toggleButtonState = () => {
        let api_url = process.env.REACT_APP_STOCK_API_URL+"/searchword?term=" + userinput;
            let obj_data = {}
            fetch(api_url)
                .then(res => res.json())
                .then(data =>{
                    console.log(data)
                });
    };
    /*
    useEffect(() => {
        if(localStorage.getItem('userid') !== null && localStorage.getItem('userid') !== ""){
            let api_url = process.env.REACT_APP_STOCK_API_URL+"/usercheck?userid="+localStorage.getItem('userid');
            fetch(api_url)
                .then(res => res.json())
                .then(data =>{
                    if(data["error"] == 0){
                        window.localStorage.setItem('user_state',data["user_state"]);
                        setUserState(data["user_state"])
                        if(data["user_state"] === "logout"){
                            window.localStorage.clear();
                        }
                    }
                    else{
                        alert("유저정보 확인 실패 : " + data.error_description)
                    }

                });
        }
    });
    */
    useEffect(() => {
        if(user_state === "logout"){
            if( user_state !== "" && user_state !== null && localStorage.getItem('user_state') === "login" ){
                let api_url = process.env.REACT_APP_STOCK_API_URL+"/userupdate?userid=" + window.localStorage.getItem('userid') + "&user_state="+user_state;
                fetch(api_url)
                    .then(res => res.json())
                    .then(data =>{
                        if(data["error"] == 0){
                            if(data["user_state"] === "logout"){
                                window.localStorage.clear();
                            }
                            else{
                                window.localStorage.setItem('user_state',data["user_state"]);
                            }
                            setUserState({user_state : data["user_state"]})
                        }
                        else{
                            alert("로그아웃 실패 : " + data.error_description)
                        }
                    });
            }
        }
        else{
            if(code !== "" && code !== null && localStorage.getItem('user_state') !== "login"){
                let api_url = process.env.REACT_APP_STOCK_API_URL+"/GetKakaoAccessToken?kakaocode="+code;
                fetch(api_url)
                    .then(res => res.json())
                    .then(data =>{
                        if(data["error"] == 0){
                            window.localStorage.setItem('userid',data["userid"]);
                            window.localStorage.setItem('usernick',data["usernick"]);
                            window.localStorage.setItem('user_state',"login");
                            setUserState("login")
                        }
                        else{
                            alert("로그인 실패 : " + data.error_description)
                        }

                    });
            }
        }
    });

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={localStorage.getItem('user_state') === "login" ? CallKakaoLogout : CallKakaoAuth }>{localStorage.getItem('user_state') === "login" ? "Logout" : "Login" }</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton aria-label="show 0 new notifications" color="inherit">
                    <Badge badgeContent={0} max={99} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={localStorage.getItem('user_state') === "login" ? CallKakaoLogout : CallKakaoAuth }>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <p>{localStorage.getItem('user_state') === "login" ? "로그아웃" : "로그인" }</p>
            </MenuItem>
        </Menu>
    );

    return (
        <div className={classes.grow}>
        <React.Fragment>
            <CssBaseline />
            <HideOnScroll {...props} >
            <AppBar>
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                    >
                    <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        주린이 닷컴
                    </Typography>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <IconButton aria-label="show 0 new notifications" color="inherit">
                            <Badge badgeContent={0} max={99} color="secondary">
                            <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Tooltip title="계정 정보">
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                            <AccountCircle />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                        <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            </HideOnScroll>
            {renderMobileMenu}
            {renderMenu}
            <Toolbar />
            <Container>
                <Box>
                    <div>
                        <div>
                            {localStorage.getItem('user_state') === "login" ? <p>{window.localStorage.getItem('usernick')}님 환영합니다.</p> : <p>방문자님 환영합니다.</p> }
                            <CodeInfo/>
                        </div>
                        <Card>
                            <CardContent>
                                <Typography component="h2">
                                <input type="search" placeholder="검색어를 입력해주세요." />
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" >검색</Button>
                            </CardActions>
                        </Card>
                    </div>
                </Box>
            </Container>
        </React.Fragment>
        </div>
    );
}