import React from "react";
import { Component } from "react/cjs/react.production.min";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { estRetTime: 0.0 };
    this.AAInput = React.createRef();
    this.calculateRetTime = this.calculateRetTime.bind(this);
  }

  /**
   * calcualteRetTime()
   * 
   * PURPOSE: calculate the estimated retention time of the peptide entered into the textbox 
   *          and update this.state.estRetTime with that value
   */
  calculateRetTime() {
    const a = 0.21; // experimental value 'a' from the Peptide Retention Prediction equation
    const b = -0.766; // "free term"
    var retCoeffSum = 0.0; // sum of the retention coefficients of the amino acids in the peptide
    var estTime = 0.0; // estimated retention time to be calculated

    // Retention coeffiecients of amino acids - taken from "Gilar_model_2022.xls"
    var retCoeff = {
      "A": 2.527,
      "R": -0.488,
      "N": 0.500,
      "D": 1.530,
      "C": 2.046,
      "Q": 1.438,
      "E": 1.685,
      "G": 1.374,
      "H": -1.742,
      "I": 8.553,
      "L": 9.281,
      "K": -0.805,
      "M": 5.321,
      "F": 11.082,
      "P": 3.696,
      "S": 1.367,
      "T": 2.102,
      "W": 12.386,
      "Y": 5.824,
      "V": 5.909
    };

    // Get the string containing the peptide and convert to uppercase
    var peptide = this.AAInput.current.value;
    peptide = peptide.toUpperCase();

    // Only process the peptide string if it is not empty
    if (peptide === "") {
      this.setState({estRetTime: 0});
      return;
    }

    // Get the sum of the retention coefficients for each amino acid in the peptide
    for (var acid of peptide) {
      // Only update the retention coefficient sum if acid is a valid amino acid,
      // otherwise set estRetTime to 0 and return
      if (acid in retCoeff) {
        retCoeffSum += retCoeff[acid];
      }
      else{
        this.setState({estRetTime: 0});
        return;
      }
    }

    // Calculate the estimated retention time using the Peptide Retention Prediction equation, rounded to 2 decimal points
    estTime = ((1 - (a * Math.log(peptide.length))) * (retCoeffSum + b)).toFixed(2);

    // Update the estRetTime state variable
    this.setState({ estRetTime: estTime });
  }

  render() {
    return (
      <>
        <h1>Peptide Retention Time Calculator</h1>
        <p>Enter peptide:</p>
        <input ref={this.AAInput} type={"text"} onChange={this.calculateRetTime}></input>
        <p>Estimated Retention Time (min):</p>
        <p>{this.state.estRetTime}</p>
      </>
    );
  }

}

export default App;
