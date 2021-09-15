import React, { Component } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CodeSearch from '../components/CodeSearch';
import CodeChart from '../components/CodeChart';
import { DartList, RT_DartList } from '../components/DartList';
import Strategy from '../components/Strategy';
import axios from 'axios';
import { KAKAO_AUTH_URL } from "../components/Kakao/OAuth";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
  }),
);

function StrategyEvent(props) {
	if(props.showflag){
		return null;
	}
	return (
		<Strategy code={props.Code}/>
	);
}

class CodeInfo extends Component {
    constructor(props){
        super(props);
        let code = new URL(window.location.href).searchParams.get('code')
        this.state = {
            selectedCode:"",
			showflag:true,
            kakaocode : code,
            delay : 1000
        }
		this.handleToggleClick = this.handleToggleClick.bind(this);
        this.CallKakaoAuth = this.CallKakaoAuth.bind(this);
    }
	
	handleToggleClick = (showflag)=>{
		console.log(showflag)
		this.setState(state => ({
			showflag: !state.showflag
		}));
	}

	CallKakaoAuth = () => {
      window.location.href = KAKAO_AUTH_URL
    }

    componentDidMount(){
        this.interval = setInterval(this.tick, this.state.delay);
        if(this.state.kakaocode !== "" || this.state.kakaocode != undefined || this.state.kakaocode != null ){
            console.log(this.state.kakaocode)
            let api_url = process.env.REACT_APP_STOCK_API_URL+"/GetKakaoAccessToken?kakaocode="+this.state.kakaocode;
            fetch(api_url)
                .then(res => res.json())
                .then(data =>{
                    console.log("result", data);
                });
        }

    }
    componentDidUpdate(prevProps, prevState){
        if (prevState.delay !== this.state.delay) {
            clearInterval(this.interval);
            this.interval = setInterval(this.tick, this.state.delay);
        }
    }
    handleSelectedCode = (selectedCode)=>{
        console.log("CodeInfo handleSelectedCode", selectedCode);
        this.setState({selectedCode});
    }
    render(){
        return(
            <div>
                <div>
                    <CodeSearch code={this.state.selectedCode} handleSelectedCode={this.handleSelectedCode} />
                </div>
                <button onClick={this.CallKakaoAuth}>카카오톡 공시정보받기</button>
                <RT_DartList />
                <Grid item xs={12}>
				    <Grid container spacing={10}>
					    <Grid item>
						    <DartList code={this.state.selectedCode}/>
					    </Grid>
						<Grid item>
						    <CodeChart code={this.state.selectedCode}/>
					    </Grid>
					</Grid>
                </Grid>
                <StrategyEvent showflag={this.state.showflag} Code={this.state.selectedCode} />
                <button onClick={this.handleToggleClick}>
				  {this.state.showflag ? '이평선 매매 전략 보기' : '숨기기'}
				</button>
            </div>
        );
    }
}

export default CodeInfo;