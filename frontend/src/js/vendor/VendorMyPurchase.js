import React, {useRef, useLayoutEffect, useEffect, useState} from 'react';
import { forwardRef } from 'react';
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
import Axios from "axios";
import * as firebase from "firebase";


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



export default function MaterialTableDemo(props) {

    //Create state for the current size of the table
    const targetRef = useRef();
    const [dimensions, setDimensions] = useState({ width:0, height: 0 });

    //Get the current size
    useLayoutEffect(() => {
        if (targetRef.current) {
            setDimensions({
                width: targetRef.current.offsetWidth,
                height: targetRef.current.offsetHeight
            });
        }
    }, []);


    //Compare the table size to the recommended size for phone and output true or false
    function isPhone() {
        if(dimensions.width < 541){
            return true;
        }else {
            return false;
        }
    }

    const currentUser = firebase.auth().currentUser;
    const email = props.match.params.email;
    // const test = () =>setGet("Quan");
    // console.log("GetStart:", get);
    console.log("Props: ", props);
    console.log("Email: ", email);



        /*const { isPhone } = this.state;*/

        return (
            <div>
                //Get the current size of the table
                <div ref={targetRef}>

                    <p hidden={true}>{dimensions.width}</p>
                    <p hidden={true}>{dimensions.height}</p>

                </div>

            <MaterialTable
                tableLayout = 'auto'
                icons={tableIcons}
                title="Purchase History"
                columns={[
                    {
                        title: 'Product', field: 'prod',
                        cellStyle: {
                            width: 20,
                            maxWidth: 20
                        },
                        headerStyle: {
                            width:20,
                            maxWidth: 20
                        }},
                    /*Hidden attribute (boolean) will call the function isPhone
                    *If the size of table is small then hide the non required fields*/
                    { title: 'Amount', field: 'amount', type: 'numeric', hidden: isPhone(),
                        cellStyle: {
                            width: 20,
                            maxWidth: 20
                        },
                        headerStyle: {
                            width:20,
                            maxWidth: 20
                        }},
                    { title: 'Price', field: 'value' , initialEditValue: '$ ', hidden: isPhone(),
                        cellStyle: {
                            width: 20,
                            maxWidth: 20
                        },
                        headerStyle: {
                            width:20,
                            maxWidth: 20
                        }},
                    { title: 'Category', field: 'cate',
                        cellStyle: {
                            width: 20,
                            maxWidth: 20
                        },
                        headerStyle: {
                            width:20,
                            maxWidth: 20
                        }},
                    { title: 'Date of Purchase', field: 'dop', type: 'date',
                        cellStyle: {
                            width: 20,
                            maxWidth: 20
                        },
                        headerStyle: {
                            width:20,
                            maxWidth: 20
                        }},
                    { title: 'Supplier', field: 'sup',
                        cellStyle: {
                            width: 20,
                            maxWidth: 20
                        },
                        headerStyle: {
                            width:20,
                            maxWidth: 20
                        }}
                ]}
                /*data={[
                    {prod: 'Dio', amount: '1554', value: '$ 1616' , dop: 1997, sup: 'Gotham', cate: 'food'},
                    {prod: 'Quan', amount: '1554', value: '$ 1616' , dop: 1997, sup: 'Richboi', cate: 'food'},
                    {prod: 'Rice', amount: 305, value: '$ 1616' , dop: 1997, sup: 'Gotham', cate: 'food'},
                    {prod: 'Old Rice', amount: 452,value: '$ 1616' , dop: 1997, sup: 'Gotham', cate: 'food'},
                    {prod: 'New Rice', amount: 262, value: '$ 1616' , dop: 1997, sup: 'Gotham', cate: 'food'},
                    {prod: 'Some Rice', amount: 159, value: '$ 1616' , dop: 1997, sup: 'Gotham', cate: 'food'},
                    {prod: 'Fried Rice', amount: 356, value: '$ 1616' , dop: 1997, sup: 'Gotham', cate: 'food'},
                    {prod: 'Broken Rice', amount: 408, value: '$ 1616' , dop: 1997, sup: 'Gotham', cate: 'food'},
                    {prod: 'Expensive Rice', amount: 237, value: '$ 1616' , dop: 1997, sup: 'Gotham', cate: 'food'},
                    {prod: 'Sticky Rice', amount: 375, value: '$ 1616' , dop: 1997, sup: 'Gotham', cate: 'food'},
                    {prod: 'Other Rice', amount: 518, value: '$ 1616' , dop: 1997, sup: 'Gotham', cate: 'food'},
                    {prod: 'Another Rice', amount: 392, value: '$ 1616' , dop: 1997, sup: 'Gotham', cate: 'food'},
                    {prod: 'Good Rice', amount: 318, value: '$ 1616' , dop: 1997, sup: 'Gotham', cate: 'food'},
                    {prod: 'Better Rice', amount: 360, value: '$ 1616' , dop: 1997, sup: 'Gotham', cate: 'food'},
                    {prod: 'Best Rice', amount: 437, value: '$ 1616' , dop: 1997, sup: 'Gotham', cate: 'food'}
                    ]}*/

                data={() =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            Axios.interceptors.request.use(request => {
                                console.log('Starting Request', request)
                                return request
                            });

                            Axios.get("http://localhost:8080/GetVendorPurchase", {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'email': email
                                    }
                                }
                            )
                                .then(result => {
                                    console.log("Result: ", result)
                                    console.log("Result data", result.data.products)
                                    resolve({
                                        data: result.data.products,
                                        page: 0,
                                        totalCount: 0,
                                    })
                                })
                                .catch((err) => {
                                        console.log("Error", err);
                                    }
                                )
                        },6000)

                    })
                }

            />
            </div>
        )



}


