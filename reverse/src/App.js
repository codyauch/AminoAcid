import React from "react";

class App extends React.Component {

  constructor() {
    super();
    this.state = { reversed : "" };
    this.reverseString = this.reverseString.bind(this);
    this.AAInput = React.createRef();
  }

  /**
   * reverseString()
   * 
   * PURPOSE: reverse the text entered into the textbox referenced by this.AAInput and update the this.state.reversed variable
   */
  reverseString(input) {

    var toReverse = this.AAInput.current.value; // get the string to reverse

    toReverse = toReverse.split("").reverse().join(""); // split string into an array, reverse it, and join back into a string

    this.setState({reversed: toReverse}); // update the state variable with the newly reversed string
    
  }

  render() {
    return <>
      <h1>Peptide Reverser</h1>
      <p>Enter Amino Acids:</p>
      <input ref={this.AAInput} type={"text"} onChange={this.reverseString}></input>
      <p>Reversed:</p>
      <p>{this.state.reversed}</p>
    </>;
  }
}

export default App;
