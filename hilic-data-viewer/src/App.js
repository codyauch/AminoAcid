import React, { Component } from "react";
import './App.css';
import Header from "./components/Header/Header.js";
import Footer from "./components/Footer/Footer.js";
import Calculator from "./components/Calculator/Calculator.js";
import Home from "./pages/Home.js"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/calculator" element={<Calculator/>} />
          </Routes>
          <Footer />
        </Router>

      </div>
    );
  }
}

export default App;
