import React from "react";

class App extends React.Component {

  constructor() {
    super();
    this.state = { reversed: "" };
    this.reverseString = this.reverseString.bind(this);
    this.AAInput = React.createRef();
  }

  reverseString() {
    // This method will reverse the string value that was input into the text box and update this.reversed

    var toReverse = "test"; //this.AAInput.current; // get the string to reverse

    toReverse = toReverse.split("").reverse().join(""); // split string into an array, reverse it, and join back into a string

    this.reversed = toReverse; // update the state variable with the newly reversed string
    
  }

  render() {
    return <>
      <h1>Peptide Reverser</h1>
      <p>Enter Amino Acids:</p>
      <input ref={this.AAInput} type={"text"} onChange={this.reverseString()}></input>
      <p>Reversed:</p>
      <p>{this.reversed}</p>
    </>;
  }
}

export default App;
