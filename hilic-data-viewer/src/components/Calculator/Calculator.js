import React, { Component } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { CSVLink } from "react-csv";

class Calculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
          input: "",
          tableData: [[], []],
          csvData: [[], []]
        };
    
        // tableData Structure:
        // [0] -> column data
        // [1] -> row data
    
        // csvData Structure
        // [0] -> header data
        // [1] -> row data
    
        this.downloadRef = React.createRef(); // reference to the CSVLink component
    
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleExport = this.handleExport.bind(this);
        this.parsePeptides = this.parsePeptides.bind(this);
        this.getRetentionTime = this.getRetentionTime.bind(this);
        this.getCharge = this.getCharge.bind(this);
        this.populateTable = this.populateTable.bind(this);
        this.packageTableData = this.packageTableData.bind(this);
        this.processDownload = this.processDownload.bind(this);
    
    
        // Set up the columns for the table
        const columns = [
          {field: "index", headerName: "Index"},
          {field: "seq", headerName: "Sequence", flex: 1},
          {field: "length", headerName: "Length", flex: 1},
          {field: "charge", headerName: "Charge", flex: 1},
          {field: "retTime", headerName: "Retention Time", flex: 1}
        ];
    
        // Add the table columns to the tableData state variable
        var tableDataWithColumns = this.state.tableData;
        tableDataWithColumns[0] = columns;
        this.state.tableData = tableDataWithColumns;
    
    }

    handleSubmit(event) {
        event.preventDefault();

        // Get the list of peptides entered, analyze and fill the table with the results
        var peptideList = this.parsePeptides(this.state.input);
        this.setState({ tableData: this.populateTable(peptideList) });
    }

    handleChange(event) {
        event.preventDefault();

        this.setState({ input: event.target.value }); // update the state variable "input" with whatever is entered in the textbox
    }

    handleExport(event) {
        event.preventDefault();

        this.setState({ csvData: this.packageTableData() }); // update state with rearranged data to make it more convenient for csv
        this.processDownload(); // trigger a download of the csv
    }

    /**
     * packageTableData()
     * 
     * PURPOSE: format the table data to prepare it for export to csv
     * 
     * @returns {Array} 2D array containing the header data [0] and row data [1]
     */
    packageTableData() {
        var csvData = this.state.tableData[1];
        var csvHeaders = [];
        var packagedData = [];

        // Prepare csv headers
        for (var header of this.state.tableData[0]) {
            csvHeaders.push({ label: header.headerName, key: header.field });
        }

        // Update the csvData state variable with the reformatted headers/data
        packagedData = this.state.csvData;
        packagedData[0] = csvHeaders;
        packagedData[1] = csvData;

        return packagedData;
    }

    /**
     * processDownload()
     * 
     * PURPOSE: trigger the download of the csv file by clicking the CSVLink
     */
    processDownload() {
        this.downloadRef.current.link.click();
    }

    /**
     * parsePeptides()
     * 
     * PURPOSE: Separate the input string by commas and save the peptides in an array. Set all peptides to uppercase
     * @param {string} inputString a string containing the list of peptides, comma separated
     * @returns array of uppercase peptides
     */
    parsePeptides(inputString) {
        // Check to see if inputString is undefined before proceeding
        if (inputString === undefined)
            return [];

        // Set string to all uppercase
        inputString = inputString.toUpperCase();

        // Split the input string by commas into an array
        var peptides = inputString.split(/[ ,]+/);

        // Remove any empty strings
        peptides = peptides.filter(String);

        // Return the parsed peptide list
        return peptides;
    }

    /**
     * getRetentionTime()
     * 
     * PURPOSE: calculate the estimated retention time of a given peptide
     * 
     * @param {string} peptide string containing the peptide to analyze
     * @returns {number} retention time in minutes
     */
    getRetentionTime(peptide) {
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



        // Convert the string containing the peptide to uppercase
        peptide = peptide.toUpperCase();

        // Only process the peptide string if it is not empty
        if (peptide === "") {
            return undefined;
        }

        // Get the sum of the retention coefficients for each amino acid in the peptide
        for (var acid of peptide) {
            // Only update the retention coefficient sum if acid is a valid amino acid,
            // otherwise return 0
            if (acid in retCoeff) {
                retCoeffSum += retCoeff[acid];
            }
            else {
                return undefined;
            }
        }

        // Calculate the estimated retention time using the Peptide Retention Prediction equation, rounded to 2 decimal points
        estTime = ((1 - (a * Math.log(peptide.length))) * (retCoeffSum + b));
        estTime = Math.round(estTime * 1e2) / 1e2;

        // Return the estimated retention time
        return estTime;
    }

    /**
     * getCharge()
     * 
     * PURPOSE: Calculate the charge of a given peptide
     * 
     * @param {string} peptide a string containing a peptide to calculate the charge of
     * @returns {number} charge of the peptide
     */
    getCharge(peptide) {
        // Check if the peptide is undefined before proceeding
        if (peptide === undefined || peptide === "")
            return undefined;

        const aminoAcids = "ARNDCQEGHILKMFPSTWYV"; // all valid amino acids
        const charged = "KRH"; // amino acids which affect the charge of the peptide
        var charge = 1; // charge of the peptide (accounting for end terminus)

        // Calculate the charge of the peptide
        for (var acid of peptide) {
            if (!aminoAcids.includes(acid)) {
                // Return undefined if the peptide contains an invalid amino acid
                return undefined;
            }
            if (charged.includes(acid)) {
                charge++;
            }
        }

        return charge;
    }

    /**
     * populateTable()
     * 
     * PURPOSE: fill the table with the data in peptideList
     * 
     * @param {array} peptideList array of peptides to analyze and enter into table
     * @returns {Array} 2D array containing column data [0] and row data [1]
     */
    populateTable(peptideList) {
        // Check if the array of peptides is undefined before proceeding
        if (peptideList === undefined)
            return undefined;

        var rows = [];
        for (var i = 0; i < peptideList.length; i++) {
            rows.push({
                id: i,
                index: i + 1,
                seq: peptideList[i],
                length: peptideList[i].length,
                charge: this.getCharge(peptideList[i]),
                retTime: this.getRetentionTime(peptideList[i])
            });
        }

        // Add the row data to the tableData state variable
        var tableDataWithRows = this.state.tableData;
        tableDataWithRows[1] = rows;

        return tableDataWithRows;
    }

    render() {
        return (
            <div>
                <p>SEQUENCE LIST</p>
                <form onSubmit={this.handleSubmit}>
                    <input type={"text"} onChange={this.handleChange}></input>
                    <button type="submit">Submit</button>
                </form>
                <br></br>
                <button onClick={this.handleExport}>Export to CSV</button>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid data-testid="datagrid" rows={this.state.tableData[1]} columns={this.state.tableData[0]} />
                </div>
                <CSVLink ref={this.downloadRef} data={this.state.csvData[1]} headers={this.state.csvData[0]} filename="HILIC_Peptide_Analysis.csv"></CSVLink>
            </div>
        );
    }
}

export default Calculator;