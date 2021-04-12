import React, { Component, forwardRef } from 'react';
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

class DartList extends Component{
    constructor(props){
        super(props);
        console.log("WordSearch constructor");
        this.state = { 
			columns : [],//"date", "open", "high", "low", "close"],
            data:[],
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.code !== this.props.code){
            //console.log("DartList componentDidupdate", this.props.userinput);
            let api_url = "http://127.0.0.1:5000/dart?corpcls=K&code="+this.props.code;
            fetch(api_url)
                .then(res => res.json())
                .then(data =>{
                    console.log("price didupdate fetch", data);
                    this.setState({columns : [{title:"날짜", field:"rcept_dt"}, 
                                            {title:"보고서명", field:"report_nm"}, 
                                            {title:"보고서번호", field:"rcept_no", render:data => <a href={'http://dart.fss.or.kr/dsaf001/main.do?rcpNo='+data.rcept_no} target='_blank'>{data.rcept_no}</a>},
                                            {title:"공시제출인명", field:"flr_nm"},
                                            {title:"비고", field:"rm"}]})
                    this.setState({data:data["dart_list"]});
                });
        }
    }
    render(){
        return  (
            <div>
                { this.state.data.length >0?
                    (<MaterialTable
                        icons={tableIcons}
                        title={"종목 공시 정보"}
                        data={this.state.data}
                        columns={this.state.columns}
                    />):<p>검색된 공시 정보가 없습니다.</p>
                }
            </div>
         );
    }
}

export default DartList;