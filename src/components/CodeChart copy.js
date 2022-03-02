import React, { Component } from 'react';

import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { utcDay } from "d3-time";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";
 

class CodeChart extends Component {
    constructor(props){
        super(props)
        this.state = {
            dataPoints1:[],
      			dataPoints2:[],
      			dataPoints3:[],
      			isLoaded:false
        };
    }
    componentDidMount(){

    }

    componentDidUpdate(prevProps, prevState, snapshot){
		function fnTodate(strDate){
			var yyyyMMdd = String(strDate);
			var strYear  = yyyyMMdd.substring(0,4);
			var strMonth = yyyyMMdd.substring(4,6);
			var strDay   = yyyyMMdd.substring(6,8);
			return new Date(Number(strYear), Number(strMonth), Number(strDay))
		}
       if(prevProps.code !== this.props.code){
            //console.log("CodeChart componentDidupdate", this.props.code);
            let api_url = process.env.REACT_APP_STOCK_API_URL+"/codes/"+this.props.code+"/sortflag/asc/price";
            fetch(api_url)
                .then(res => res.json())
                .then(data =>{
					var count = data["count"]
					var price_info = []
					price_info = data["price_list"]
					var dps1 = [], dps2 = [], dps3 =[];
					for (var i = 0; i < price_info.length; i++){
						dps1.push({
							x:fnTodate(price_info[i].date),
							y:[
								Number(price_info[i].open),
								Number(price_info[i].high),
								Number(price_info[i].low),
								Number(price_info[i].close)
								]
						});
						dps2.push({
							x:fnTodate(price_info[i].date),
							y:Number(price_info[i].volume_usd)
						});
						dps3.push({
							x:fnTodate(price_info[i].date),
							y:Number(price_info[i].close)
						});
						this.setState({
						isLoaded : true,
						dataPoints1 : dps1,
						dataPoints2 : dps2,
						dataPoints3 : dps3
					});
					}
                });
        }
    }

    render(){
      const options = {
      theme: "light2",
      title:{
        text:"주식 차트"
      },
      charts: [{
		height: 200,
        axisX: {
          lineThickness: 5,
          tickLength: 0,
          labelFormatter: function(e) {
            return "";
          },
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
            labelFormatter: function(e) {
              return "";
            }
          }
        },
        axisY: {
          title: "주가",
          tickLength: 0
        },
        toolTip: {
          shared: true
        },
        data: [{
          name: "가격 (in KRW)",
          yValueFormatString: "#,###.##원",
          type: "candlestick",
          dataPoints : this.state.dataPoints1
        }]
      },{
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true
          }
        },
        axisY: {
          title: "누적거래량",
          tickLength: 0
        },
        toolTip: {
          shared: true
        },
        data: [{
          name: "Volume",
          yValueFormatString: "#,###.##",
          type: "column",
          dataPoints : this.state.dataPoints2
        }]
      }],
      navigator: {
		animationEnabled: true,
        data: [{
          dataPoints: this.state.dataPoints3
        }],
        slider: {
          minimum: new Date("2018-05-01"),
          maximum: new Date("2018-07-01")
        }
      }
    };
    const containerProps = {
      width: "50%",
      height: "600px",
      margin: "auto"
    };
        return (
            <div>
			{
            // Reference: https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator
            this.state.isLoaded && 
            <CanvasJSStockChart containerProps={containerProps} options = {options}
              /* onRef = {ref => this.chart = ref} */
            />
            }
			
            </div>
        );
    }
}

CodeChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CodeChart.defaultProps = {
  type: "svg",
};
CodeChart = fitWidth(CodeChart);

export default CodeChart;