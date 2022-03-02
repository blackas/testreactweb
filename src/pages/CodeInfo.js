import React, { Component, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CodeSearch from '../components/CodeSearch';
import CodeChart from '../components/CodeChart';
import { DartList, RT_DartList } from '../components/DartList';
import Strategy from '../components/Strategy';
import axios from 'axios';
import { KAKAO_ADD_FRIENDS } from "../components/Kakao/Config";
import { TypeChooser } from "react-stockcharts/lib/helper";
import { timeParse } from "d3-time-format";

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
  })
);

function StrategyEvent(props) {
	if(props.showflag){
		return null;
	}
    return null;
	return (
		<Strategy code={props.code}/>
	);
}

function RealTimeDart(props){
    if(props.showflag){
        return <RT_DartList showflag={props.showflag} />
    }
    else{
         return null;
    }
}

class CodeChartRender extends Component{
    constructor(props){
        super(props);

        this.state = {
            data : [],
        }
    }


    componentDidMount(){
        if(this.props.code !== ""){
            let api_url = process.env.REACT_APP_STOCK_API_URL+"/codes/"+this.props.code+"/sortflag/asc/price";
            let obj_data = {}
            fetch(api_url)
                .then(res => res.json())
                .then(data =>{
                    for (let i = 0; i < data["price_list"].length; i++) {
                        data["price_list"][i].date = new Date(data["price_list"][i].date)
                    }

                    obj_data["data"] = data["price_list"]
                    //this.setState({ data:obj_data, sr_data : obj_data, support : data["support"], resistance : data["resistance"] });
                    this.setState({ data:obj_data, support : data["support"], resistance : data["resistance"], increase_volume : data["increase_volume"] });
                });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.code !== this.props.code){
            let api_url = process.env.REACT_APP_STOCK_API_URL+"/codes/"+this.props.code+"/sortflag/asc/price";
            let obj_data = {}
            fetch(api_url)
                .then(res => res.json())
                .then(data =>{
                    for (let i = 0; i < data["price_list"].length; i++) {
                        data["price_list"][i].date = new Date(data["price_list"][i].date)
                    }
                    obj_data["support"] = data["support"]
                    obj_data["resistance"] = data["resistance"]
                    obj_data["chartdata"] = data["price_list"]
                    obj_data["increase_volume"] = data["increase_volume"]
                    this.setState({ data:obj_data });
                });
        }
    }

    render(){
        return (
            <div>
            { Object.keys(this.state.data).length > 0 ? (
                <TypeChooser>
                    {type => <CodeChart type={type} data={this.state.data} code={this.props.code}/>}
                </TypeChooser>
                ) : (null)
            }
            </div>
        )
    }
}

class CodeInfo extends Component {
    constructor(props){
        super(props);
        let code = new URL(window.location.href).searchParams.get('code')
        let state = new URL(window.location.href).searchParams.get('state')

        this.state = {
            selectedCode:"",
			showflag:true,
            kakaocode : code,
            user_state : localStorage.getItem('user_state'),
            usernick : localStorage.getItem('usernick'),
            updstate : state,
            delay : 1000,
            searchflag : true,
            codedata : [],
            isSearch : false,
            direction : "column",
        }

        if(state !== undefined && state !== null){
            this.setState({user_state : state})
        }

		this.handleToggleClick = this.handleToggleClick.bind(this);
        this.CallKakaoFriends  = this.CallKakaoFriends.bind(this);
    }
	
	handleToggleClick = (showflag)=>{
		this.setState(state => ({
			showflag: !state.showflag
		}));
	}

    componentDidMount(){
        /*
        if(localStorage.getItem('userid') !== null && localStorage.getItem('userid') !== undefined){
            let api_url = process.env.REACT_APP_STOCK_API_URL+"/usercheck?userid="+localStorage.getItem('userid');
            fetch(api_url)
                .then(res => res.json())
                .then(data =>{
                    if(data["error"] == 0){
                        window.localStorage.setItem('user_state',data["user_state"]);
                        this.setState({user_state : data["user_state"]})
                        if(data["user_state"] === "logout"){
                            window.localStorage.clear();
                        }
                    }
                    else{
                        alert("유저정보 확인 실패 : " + data.error_description)
                    }

                });
        }
        */
    }

    componentDidUpdate(prevProps, prevState){
    }

    handleSelectedCode = (selectedCode)=>{
        this.setState({selectedCode : selectedCode, showflag : false, isSearch : true});
    }

    CallKakaoFriends = () => {
        window.location.href = KAKAO_ADD_FRIENDS
    }

    toggleButtonState = () => {
        window.location.href = KAKAO_ADD_FRIENDS;
        if (window.localStorage.getItem('user_state') !== "login"){
            alert("로그인 후 시도해주세요")
            return
        }
        
        if (this.state.selectedCode === undefined || this.state.selectedCode === "" ){
            alert("종목 검색 후 시도해주세요. 한 종목씩 추가 가능")
            return
        }
        if ( window.localStorage.getItem('userid') !== undefined && window.localStorage.getItem('userid') !== ""){
            let api_url = process.env.REACT_APP_STOCK_API_URL+"/addkakaodart?userid=" + window.localStorage.getItem('userid') + "&code="+this.state.selectedCode;
                fetch(api_url)
                    .then(res => res.json())
                    .then(data =>{
                        if(data["error"] == 0){
                            alert("성공");
                        }
                        else{
                            alert("실패, 실패사유 : " + data.error_description);
                        }
                    });
        }
  };

    render(){
        return(
            <div>
                <div>
                    <CodeSearch code={this.state.selectedCode} handleSelectedCode={this.handleSelectedCode} />
                </div>
			    <Grid container spacing={2}>
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        <button onClick={this.handleToggleClick}>{this.state.showflag ? '실시간 공시 숨기기' : '실시간 공시 보기'}</button>
                        <button onClick={this.toggleButtonState}>카톡 공시정보받기</button>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        <RealTimeDart showflag={this.state.showflag} />
                    </Grid>
				    <Grid item lg={6} md={6} sm={12} xs={12} >
					    <CodeChartRender code={this.state.selectedCode} isSearch={this.state.isSearch} />
				    </Grid>
					<Grid item lg={6} md={6} sm={12} xs={12} >
                        <DartList code={this.state.selectedCode}/>
				    </Grid>
				</Grid>
            </div>
        );
    }
}

export default CodeInfo;