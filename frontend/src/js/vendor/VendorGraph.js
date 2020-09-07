import React,{Component} from 'react'
import {Card} from 'antd'

import echarts from 'echarts/lib/echarts'

import 'echarts/lib/chart/line'

import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'

const data =
    [{
        date: "01-09-2020",
        revenue: 150
    },
        {
            date: "19-08-2020",
            revenue: 140
        },
        {
            date: "18-08-2020",
            revenue: 150
        },
        {
            date: "29-08-2020",
            revenue: 630.
        },
        {
            date: "18-08-2020",
            revenue: 150
        },
        {
            date: "18-08-2020",
            revenue: 150
        },
        {
            date: "18-08-2020",
            revenue: 150
        },
        {
            date: "18-08-2020",
            revenue: 150
        },
        {
            date: "18-08-2020",
            revenue: 150
        },
        {
            date: "18-08-2020",
            revenue: 150
        },
        {
            date: "18-08-2020",
            revenue: 150
        },
        {
            date: "18-08-2020",
            revenue: 150
        },
        {
            date: "18-08-2020",
            revenue: 150
        },
        {
            date: "18-08-2020",
            revenue: 150
        },
        {
            date: "18-08-2020",
            revenue: 150
        },
        {
            date: "18-08-2020",
            revenue: 150
        }];

class LineA extends Component {

    componentWillMount(){
        
    }

    getOption = ()=>{
        let option = {
            title: {  
                text: 'Order Revenue',
                x: 'center',
                textStyle: { 
                    color: '#ccc'
                }
            },
            tooltip:{ 
                trigger: 'axis'
            },
            xAxis: { 
             name:'date',  
             data:data.map(function(d){return  d.date}) 
            },
            yAxis: {
                type: 'value' 
            },
            series : [
                {
                  name:'Revenue', 
                  type:'line', 
                  data:data.map(function(d){return d.revenue})  
                }
            ]
        }
        return option;
    }

    render() {
        return (
            <Card.Grid className="line_a">
                <ReactEcharts option={this.getOption()} theme="ThemeStyle" />
            </Card.Grid>
        )
    }

    
}
export default LineA;

import React, { Component } from "react";
import { Card } from "antd";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import ReactEcharts from "echarts-for-react";
const data = [
  {
    date: "01-09-2020",
    revenue: 15.0
  },
  {
    date: "19-08-2020",
    revenue: 140
  },
  {
    date: "18-08-2020",
    revenue: 15.0
  },
  {
    date: "29-08-2020",
    revenue: 630.0
  }
];
export default class BarA extends Component {
  getOption = () => {
    let option = {
      title: {
        text: "Customer orders Amount"
      },
      tooltip: {
        trigger: "axis"
      },
      xAxis: {
        data: data.map(function (d) {
          return d.date;
        })
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "Order amount",
          type: "bar",
          barWidth: "60%",
          data: data.map(function (d) {
            return d.revenue;
          })
        }
      ]
    };
    return option;
  };
  render() {
    return (
      <Card.Grid className="bar_a">
        <ReactEcharts option={this.getOption()} />
      </Card.Grid>
    );
  }
}
