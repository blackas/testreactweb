import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

class CodeSearch extends Component{
    constructor(props){
        super(props);
        this.state = { 
            selectedOption:'',
            options : [],
            filteredOptions : [],
			value:'all',
        };
    }
	
    handleSelectChange = (selectedOption)=>{
        this.props.handleSelectedCode(selectedOption.code);
    }

    handleRadioChange = (event) =>{
		this.state.value = event.target.value;
        if(event.target.value==="코스피"){
            this.setState({
                filteredOptions:this.state.options.filter(item=>item.market==='1' && item.is_etf === "0")
            })
        }else if(event.target.value==="코스닥"){
            this.setState({
                filteredOptions:this.state.options.filter(item=>item.market==='2' && item.is_etf === "0")
            })
        }else if(event.target.value==="etf"){
            this.setState({
                filteredOptions:this.state.options.filter(item=>item.is_etf==='1')
            })
        }else if(event.target.value==="all"){
            this.setState({
                filteredOptions:[],
            })
        }
        //spec은 is_spec 설정..
    }
    componentDidMount(){
        let api_url = process.env.REACT_APP_STOCK_API_URL+"/codes";
        let options = [];
        fetch(api_url)
            .then(res => res.json())
            .then(data =>{
                data["code_list"].map(function(item){
                    item["value"] = item["code"]
                    item["label"] = item["name"] + "(" + item["code"] +")"
                    item["market"] = item["market"] 
                    item["is_etf"] = item["is_etf"]
                    item["is_spac"] = item["is_spac"]
                });
                this.setState({options:data["code_list"]})
            });
    }
    render(){
        const { selectedOption, options, filteredOptions } = this.state;
        return  (
            <div>
            {
                <Select
                    onChange={this.handleSelectChange}
                    options={filteredOptions.length > 0?
                                filteredOptions:options}
                    maxMenuHeight={100}
                />
            }
            {
                <RadioGroup
					value = {this.state.value}
                    onChange={this.handleRadioChange}
                    row
                >
                <FormControlLabel
                    value="all"
                    control={<Radio color="primary" />}
                    label="전체"
                    labelPlacement="end"
                />
                <FormControlLabel
                    value="코스피"
                    control={<Radio color="primary" />}
                    label="코스피"
                    labelPlacement="end"
                />
                <FormControlLabel
                    value="코스닥"
                    control={<Radio color="primary" />}
                    label="코스닥"
                    labelPlacement="end"
                />
                <FormControlLabel
                    value="etf"
                    control={<Radio color="primary" />}
                    label="etf"
                    labelPlacement="end"
                />
                </RadioGroup>
            }
            </div>
         );
    }
}

export default CodeSearch;