import React, { Component } from "react";
import './App.css';
import Header from "./components/Header/Header.js";
import Footer from "./components/Footer/Footer.js";
import Calculator from "./components/Calculator/Calculator.js";

class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div className="App">
      <Header/>
      {/* <Calculator/> */}
      <Footer/>
    </div>
    );
  }
}

export default App;
