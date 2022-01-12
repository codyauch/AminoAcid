import React, { Component } from "react";
import './App.css';
import Header from "./Header.js"
import Footer from "./Footer.js"
import Calculator from "./Calculator.js"

class App extends Component {

  constructor(props) {
    super(props);
  }


  render() {
    return (
    <div className="App">
      <Header/>
      <Calculator/>
      <Footer/>
    </div>
    );
  }
}

export default App;
