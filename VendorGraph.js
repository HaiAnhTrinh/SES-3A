import React, {useEffect, useState} from 'react';
import Axios from "axios";

import 'echarts/lib/chart/line'

import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
import Hidden from "@material-ui/core/Hidden";

export default function Graph(){

    const [data, setData] = useState([]);

    useEffect(() => {
        Axios.get("http://localhost:8080/GetGraphData",
            { headers: {'Content-Type': 'application/json', 'email': 'quannguyen365@gmail.com'}})
            .then(response => {
                const sorted = response.data.data.sort((a,b) => new Date(a.date) - new Date(b.date));
                console.log("sorted ", sorted);

                setData(sorted);
            })
            .catch(error => console.log(error));
    }, []);

    const getOption = ()=>{
        let option = {
            title: {
                text: 'Revenue',
                x: 'center',
                textStyle: {
                    color: 'black',
                }
            },
            dataZoom: [
                {
                    type: 'inside',
                    throttle:'50',
                    minValueSpan:4,
                    start: 0,
                    end: 15
                }
            ],
            tooltip:{
                trigger: 'axis'
            },
            xAxis: {
                name:'date',
                nameLocation: 'middle',
                nameGap: 50,
                axisLabel: {
                    interval: 0,
                    rotate: 20
                },
                data:data.map((d) => {return  d.date})
                // data:['2020-09-03', '2020-09-03','2020-09-03','2020-09-03','2020-09-03','2020-09-03','2020-09-03','2020-09-03']
            },
            yAxis: {
                type: 'value'
            },
            series : [
                {
                    name:'Revenue',
                    type:'line',
                    data:data.map((d) => {return d.revenue})
                }
            ]
        }
        return option;
    }

    return(
        <div>
            <Hidden smUp implementation="css">
                <ReactEcharts option={getOption()} theme="ThemeStyle" style={{height: '300px', width: "auto"}}/>
            </Hidden>
            <Hidden xsDown implementation="css">
                <ReactEcharts option={getOption()} theme="ThemeStyle" style={{height: '500px', width: "auto"}}/>
            </Hidden>
        </div>
    );
}