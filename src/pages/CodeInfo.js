import React, { Component } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CodeSearch from '../components/CodeSearch';
import CodeChart from '../components/CodeChart';
import DartList from '../components/DartList';
import Strategy from '../components/Strategy';

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
	console.log("호출 됩니까??? : "+props)
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
        this.state = {
            selectedCode:"",
			showflag:true,
        }
		this.handleToggleClick = this.handleToggleClick.bind(this);
    }
	
	handleToggleClick = (showflag)=>{
		console.log(showflag)
		this.setState(state => ({
			showflag: !state.showflag
		}));
	}
	
    componentDidMount(){

    }
    componentDidUpdate(prevProps, prevState){

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