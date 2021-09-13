import React, { Component } from 'react';

class GetAccessToken extends Component{
    constructor(props){
        super(props);
        console.log("GetAccessToken")
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        console.log(this.props.kakaocode)
        if(prevProps.kakaocode !== this.props.kakaocode){
            let api_url = process.env.REACT_APP_STOCK_API_URL+"/GetKakaoAccessToken?kakaocode="+this.props.kakaocode;
            fetch(api_url)
                .then(res => res.json())
                .then(data =>{
                    console.log("result : ", data);
                });
        }
    }
    render(){
        return  (
            <div>

            </div>
         );
    }
}

export default GetAccessToken;