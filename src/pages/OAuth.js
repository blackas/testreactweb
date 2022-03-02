import React, { useState, useEffect } from 'react'; 

export default function Navigation(props) {
	const code = new URL(window.location.href).searchParams.get('code')
	const [user_state,setUserState] = useState(new URL(window.location.href).searchParams.get('state'));

	useEffect(() => {
		if (code === null || code === undefined){
			alert("잘못된 접근입니다.")
			window.herf = process.env.REACT_APP_HOST
		}
		if((localStorage.getItem('user_state') !== "login")){
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
                    
                    window.herf = process.env.REACT_APP_HOST
                });
        }
    });
}