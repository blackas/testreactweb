import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';

class CodeSearch extends Component{
    constructor(props){
        super(props);
        console.log("WordSearch constructor");
        this.state = { 
            selectedOption:'',
            options : [],
            SearchResult : [],
			SearchWord : '',
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.userinput !== this.props.userinput){
            console.log("CodePrice componentDidupdate", this.props.userinput);
			/*
            let api_url = "http://127.0.0.1:5000/codes/"+this.props.code+"/sortflag/des/price";
            fetch(api_url)
                .then(res => res.json())
                .then(data =>{
                    console.log("price didupdate fetch", data);
                    this.setState({columns : [{title:"날짜", field:"date"}, 
                                            {title:"시가", field:"open"}, 
                                            {title:"고가", field:"high"},
                                            {title:"저가", field:"low"},
                                            {title:"종가", field:"close"},
											{title:"누적거래량", field:"volume_usd"}]})
                    this.setState({data:data["price_list"]});
                }); */
        }
    }
    render(){
        const { selectedOption, options, filteredOptions } = this.state;
        console.log("CodeSearch render", options);
        return  (
            <div>

            </div>
         );
    }
}

export default CodeSearch;