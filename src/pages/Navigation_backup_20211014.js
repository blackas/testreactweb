import React, { Component, useState } from 'react'; 
import PropTypes from 'prop-types';
import { Card, CardActions, CardContent, Typography, Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Badge from '@material-ui/core/Badge';
import InputBase from '@material-ui/core/InputBase';

import ListIcon from '@material-ui/icons/List';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CodeInfo from './CodeInfo';

import { alpha, withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';

const styles = theme => ({
  root: {
    minWidth: 275,
    maxWidth: 300
  },
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
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
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
});

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
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

class Navigation extends Component {
    constructor(props){
        super(props);
        this.state={
            value:0,
			userinput:'',
			result:[],
            anchorEl : null,
            mobileMoreAnchorEl : null
        }
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };
	
	handleUserInput = (e) => {
		this.setState({ userinput:e.target.value });
	};
	
	toggleButtonState = () => {
        let api_url = process.env.REACT_APP_STOCK_API_URL+"/searchword?term=" + this.state.userinput;
            let obj_data = {}
            fetch(api_url)
                .then(res => res.json())
                .then(data =>{
                    console.log(data)
                    /*
                    for (let i = 0; i < data["price_list"].length; i++) {
                        data["price_list"][i].date = new Date(data["price_list"][i].date)
                    }
                    obj_data["support"] = data["support"]
                    obj_data["resistance"] = data["resistance"]
                    obj_data["chartdata"] = data["price_list"]
                    */
                });
        //FetchAPI(this.state.userinput).then(result => {
        //    this.setState({ result });
        //});
    };

    setAnchorEl = (anchorEl) => {
        this.setState({ anchorEl });
    }

    setMobileMoreAnchorEl = (mobileMoreAnchorEl) => {
        this.setState({ mobileMoreAnchorEl });
    }

    handleProfileMenuOpen = (event) => {
        this.setAnchorEl(event.currentTarget);
    };

    handleMobileMenuClose = () => {
        this.setMobileMoreAnchorEl(null);
    };

    handleMenuClose = () => {
        this.setAnchorEl(null);
        this.handleMobileMenuClose();
    };

    handleMobileMenuOpen = (event) => {
        this.setMobileMoreAnchorEl(event.currentTarget);
    };

    render() {
        const { value } = this.state.value;

        const { classes } = this.props;
        const isMenuOpen = Boolean(this.anchorEl);
        const isMobileMenuOpen = Boolean(this.mobileMoreAnchorEl);

        const menuId = 'primary-search-account-menu';
        const renderMenu = (
        <Menu
          anchorEl={this.anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={menuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={this.handleMenuClose}
        >
          <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
        </Menu>
        );

        const mobileMenuId = 'primary-search-account-menu-mobile';
        const renderMobileMenu = (
        <Menu
          anchorEl={this.mobileMoreAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={mobileMenuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMobileMenuOpen}
          onClose={this.handleMobileMenuClose}
        >
          <MenuItem>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>
          <MenuItem>
            <IconButton aria-label="show 11 new notifications" color="inherit">
              <Badge badgeContent={11} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={this.handleProfileMenuOpen}>
            <IconButton
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>Profile</p>
          </MenuItem>
        </Menu>
        );                

        return (
            <div>
            <React.Fragment>
              <CssBaseline />
              <HideOnScroll {...this.props}>
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
                            Material-UI
                        </Typography>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <div className={classes.grow} />
                            <div className={classes.sectionDesktop}>
                                <IconButton aria-label="show 4 new mails" color="inherit">
                                <Badge badgeContent={4} color="secondary">
                                    <MailIcon />
                                </Badge>
                                </IconButton>
                                <IconButton aria-label="show 17 new notifications" color="inherit">
                                    <Badge badgeContent={17} color="secondary">
                                    <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={this.menuId}
                                    aria-haspopup="true"
                                    onClick={this.handleProfileMenuOpen}
                                    color="inherit"
                                >
                                <AccountCircle />
                                </IconButton>
                            </div>
                            <div className={classes.sectionMobile}>
                                <IconButton
                                    aria-label="show more"
                                    aria-controls={this.mobileMenuId}
                                    aria-haspopup="true"
                                    onClick={this.handleMobileMenuOpen}
                                    color="inherit"
                                >
                                <MoreIcon />
                                </IconButton>
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
                {this.renderMobileMenu}
                {this.renderMenu}
            </HideOnScroll>
            <Toolbar />
            <Container>
                <Box my={2}>
                    <div className={classes.root}>
                        <div>
                            {this.state.value === 0?
                                (<CodeInfo/>) : (<CodeInfo/>)
                            }
                        </div>
                        <Card>
                            <CardContent>
                                <Typography component="h2">
                                <input type="search" placeholder="검색어를 입력해주세요." onChange={this.handleUserInput}/>
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={this.toggleButtonState}>검색</Button>
                            </CardActions>
                        </Card>
                        <BottomNavigation value={this.state.value} onChange={this.handleChange} 
                            showLabels className={classes.bottom}>
                            <BottomNavigationAction label="종목정보" value={0} icon={<ListIcon />} />
                            <BottomNavigationAction label="매매이력" value={1} icon={<ShoppingCartIcon/>} />
                        </BottomNavigation>
                    </div>
                </Box>
              </Container>
            </React.Fragment>
            </div>
        );
    }
}

export default Navigation;
