import React from "react";
import NavBar from "../NavBar/NavBar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calculator from "../Calculator/Calculator.js";
import Home from "../../pages/Home.js";

function Header() {
    return (
        <div>
            <Router>
                <NavBar />
                <Routes>
                    <Route exact path="./" component={Home} />
                    <Route path="/calculator" component={Calculator} /> 
                </Routes>
            </Router>
            <h1>HILIC Peptides Analysis</h1>
            <br></br>
            <p>--------------------</p>
            <br></br>
        </div>
    );
}

export default Header;