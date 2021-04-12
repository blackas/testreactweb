import React, { Component } from 'react';

class Strategy extends Component{
    constructor(props){
        super(props);
        console.log("Strategy constructor");
        this.state = { 
			columns : [],//"date", "open", "high", "low", "close"],
            data:"",
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot){
		console.log("Strategy componentDidUpdate" + prevProps);
        if(prevProps.code !== this.props.code){
            //console.log("DartList componentDidupdate", this.props.userinput);
            let api_url = "http://127.0.0.1:5000/strategy?code="+this.props.code;
            fetch(api_url)
                .then(res => res.json())
                .then(data =>{
                    console.log("Strategy fetch", data);
					this.setState({data:data["html"]});
                });
        }
    }
    render(){
        return  (
			<div dangerouslySetInnerHTML={{ __html: this.state.data }} />
         );
    }
}

export default Strategy;