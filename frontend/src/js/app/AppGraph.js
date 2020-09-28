import React from 'react';
import Axios from "axios";

export default function Cart(){
    console.log("VENDOR Cart");

    const btnClick = () =>{
        Axios.get("http://localhost:8080/GetCart",
            { headers: {'Content-Type': 'application/json', 'email': 'e7ee777@gmail.com'}})
            .then(response => {
                console.log(response);
            })
            .catch(error => console.log(error));
    }

    return(
        <div>
            <button onClick={btnClick}>cart demo</button>
        </div>
    );
}
