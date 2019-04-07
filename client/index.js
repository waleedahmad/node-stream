import React from "react";
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap';
require('./index.scss');
import Root from './components/Root.js';

if(document.getElementById('root')){
    ReactDOM.render(
        <BrowserRouter>
            <Root/>
        </BrowserRouter>,
        document.getElementById('root')
    );
}

