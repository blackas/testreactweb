import React from 'react'; 
import { Card, CardActions, CardContent, Typography, Button } from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ListIcon from '@material-ui/icons/List';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
//import WordSearch from '../components/WordSearch';

const useStyles = {
  root: {
    minWidth: 275,
	maxWidth: 300
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  bottom:{
   width: "100%",
   position: "fixed",
   bottom: "10",
 }
};

function fetchAPI(param) {
  // param is a highlighted word from the user before it clicked the button
  return fetch("http://api.seibro.or.kr/openapi/service/FnTermSvc/getFinancialTermMeaning?numOfRows=5&pageNo=1&ServiceKey=fjGWMMABZnp7n8Wg67jbCDcry6FAX4qXzjLFhZ4r37WEoOjnrlrnDogxE7HPexyDmcJveyyy7%2F75nue9VbpL%2Fw%3D%3D&term=" + param);
}

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state={
            value:0,
			userinput:'',
			result:[],
        }
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };
	
	handleUserInput = (e) => {
		this.setState({ userinput:e.target.value });
	};
	
	toggleButtonState = () => {
        fetchAPI(this.state.userinput).then(result => {
            this.setState({ result });
        });
    };

    render() {
        const { value } = this.state.value;
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav.Link href="#action1">Home</Nav.Link>
                            <Nav.Link href="#action2">Link</Nav.Link>
                            <NavDropdown title="Link" id="navbarScrollingDropdown">
                            <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action5">Something else here</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#" disabled>
                            Link
                        </Nav.Link>
                    </Navbar.Collapse>
                </Navbar>
                <div className={useStyles.root}>
                    <div>
                        
                    </div>
                    <Card className={useStyles.root}>
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
                        showLabels className={useStyles.bottom}>
                        <BottomNavigationAction label="종목정보" value={0} icon={<ListIcon />} />
                        <BottomNavigationAction label="매매이력" value={1} icon={<ShoppingCartIcon/>} />
                    </BottomNavigation>
                </div>
            </div>
        );
    }
}

export default Login;
