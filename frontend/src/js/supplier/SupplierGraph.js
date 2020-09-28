import React, {useEffect, useState} from 'react';
import Axios from "axios";

import 'echarts/lib/chart/line'

import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
import Hidden from "@material-ui/core/Hidden";

export default function Graph(props){

    const email = props.match.params.email;
    const [data, setData] = useState([]);

    useEffect(() => {
        Axios.get("http://localhost:8080/GetGraphData",
            { headers: {'Content-Type': 'application/json', 'email': email}})
            .then(response => {
                const sorted = response.data.data.sort((a,b) => new Date(a.date) - new Date(b.date));
                setData(sorted);
            })
            .catch(error => console.log(error));
    }, []);

    const getOption = ()=>{
        return {
            title: {
                text: 'Revenue',
                x: 'center',
                textStyle: {color: 'black'}
            },
            tooltip: {trigger: 'axis'},
            xAxis: {
                name: 'date',
                data: data.map((d) => { return d.date })
            },
            yAxis: {type: 'value'},
            series: [
                {
                    name: 'Revenue',
                    type: 'line',
                    data: data.map((d) => { return d.revenue })
                }
            ]
        };
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