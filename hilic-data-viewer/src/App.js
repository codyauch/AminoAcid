import React, { Component } from "react";
import ReactTable from 'react-table';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleSubmit(event){
    event.preventDefault();
  }

  handleChange(event){
    event.preventDefault();
    this.setState({data: event.target.value})
  }

  render() {
    return (<div className="App">
      <h1>HILIC Peptides Analysis</h1>
      <br></br>
      <p>--------------------</p>
      <br></br>
      <p>SEQUENCE LIST</p>
      <form onSubmit={this.handleSubmit}>
        <input type={"text"} onChange={this.handleChange}></input>
        <button type="submit">Submit</button>
      </form>
    </div>);
  }
}

export default App;
