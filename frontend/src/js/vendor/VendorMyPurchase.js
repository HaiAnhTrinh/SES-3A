import React, {useState, useRef, useLayoutEffect, useEffect} from 'react';
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
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

export default function MyPurchase(props) {

    //Create state for the current size of the table
    const targetRef = useRef();
    const [dimensions, setDimensions] = useState({ width:0, height: 0 });
    const [tableData, setTableData] = useState([]);

    function refreshPage() {
        window.location.reload(false);
    }

    function useWindowSize() {
        const [size, setSize] = useState([0, 0]);
        useLayoutEffect(() => {
            function updateSize() {
                setSize([window.innerWidth, window.innerHeight]);
            }
            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize);
        }, []);
        return size;
    }

    function ShowWindowDimensions() {
        const [width, height] = useWindowSize();
        return <span>Window size: {width} x {height}</span>;
    }

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
        var resizeTimeout;
        window.addEventListener('resize', function(event) {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function(){
                window.location.reload();
            }, 1500);
        });
        if(dimensions.width <= 541){
            return true;

        }else {
            return false;
        }

    }

    const email = props.match.params.email;

    var divStyle = {
        maxWidth: '5'
    };

    useEffect(() => {
        Axios.get("http://localhost:8080/GetVendorPurchase", {
                headers: {
                    'Content-Type': 'application/json',
                    'email': email
                }
            }
        ).then( result => {
            setTableData(result.data.purchaseHistory)
        }).catch( error => console.log(error));
    }, [])

    return (
        <div style={divStyle}>

            {/*Get the current size of the table*/}
            <div ref={targetRef}>

                <p hidden={true}>{dimensions.width}</p>
                <p hidden={true}>{dimensions.height}</p>

            </div>

            <MaterialTable

                maxWidth = "541"
                icons={tableIcons}
                title= {isPhone() ? "History" : "Purchase History"}
                columns={[
                    {title: 'Product', field: 'name'},
                    /*Hidden attribute (boolean) will call the function isPhone
                    *If the size of table is small then hide the non required fields*/
                    { title: 'Amount', field: 'quantity', type: 'numeric', hidden: isPhone()},
                    { title: 'Cost', field: 'cost' , initialEditValue: '$ ', hidden: isPhone() },
                    { title: 'Category', field: 'category', hidden: isPhone()},
                    { title: 'Date of Purchase', field: 'date', type: 'date'},
                    { title: 'Supplier', field: 'supplier' }
                ]}

                data={tableData}

                detailPanel={[

                    {
                        tooltip: 'Show Details',
                        disabled: !isPhone(),


                        render: rowData => {
                            return (
                                <div
                                    style={{
                                        textAlign: 'center'
                                    }}>
                                    <p>Category: {rowData.category}</p>
                                    <p>Total amount: {rowData.quantity}</p>
                                    <p>Total cost: {rowData.cost}</p>
                                </div>
                            )
                        }
                    }
                ]}
                onRowClick={(event, rowData, togglePanel) => isPhone() ? togglePanel() : ''}
            />

        </div>
    )

}