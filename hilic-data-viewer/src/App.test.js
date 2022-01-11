import "@testing-library/jest-dom"
import { render, screen, fireEvent} from "@testing-library/react"
import App from "./App"
import { DataGrid } from "@mui/x-data-grid";

describe("Helper Functions", () => {
    const testApp = new App();
    test("parsePeptides()", async () => {
        let normalTestData = "GLVK";
        let normalTestData2 = "GLVK, AAAGTKR";
        let edgeTestData = "";
        let edgeTestData2 = ",,";
        let edgeTestData3 = " ";
        let edgeTestData4 = "GLVK, AAAGTKR";

        expect(testApp.parsePeptides(normalTestData)).toEqual(["GLVK"]);
        expect(testApp.parsePeptides(normalTestData2)).toEqual(["GLVK", "AAAGTKR"]);
        expect(testApp.parsePeptides(edgeTestData)).toEqual([]);
        expect(testApp.parsePeptides(edgeTestData2)).toEqual([]);
        expect(testApp.parsePeptides(edgeTestData3)).toEqual([]);
        expect(testApp.parsePeptides(edgeTestData4)).toEqual(["GLVK", "AAAGTKR"]);
    });

    test("getRetentionTime()", async () => {
        let normalTestData = "GLVK";
        let edgeTestData = "";
        let edgeTestData2 = " ";

        expect(testApp.getRetentionTime(normalTestData)).toEqual(10.63);
        expect(testApp.getRetentionTime(edgeTestData)).toEqual(undefined);
        expect(testApp.getRetentionTime(edgeTestData2)).toEqual(undefined);
    });

    test("getCharge()", async () => {
        let normalTestData = "GLVK";
        let normalTestData2 = "AAAGTKR";
        let normalTestData3 = "KRHKRH"
        let edgeTestData = "";
        let edgeTestData2 = "ZZZ"

        expect(testApp.getCharge(normalTestData)).toEqual(2);
        expect(testApp.getCharge(normalTestData2)).toEqual(3);
        expect(testApp.getCharge(normalTestData3)).toEqual(7);
        expect(testApp.getCharge(edgeTestData)).toEqual(undefined);
        expect(testApp.getCharge(edgeTestData2)).toEqual(undefined);
    });

    test("populateTable()", async () => {
        let normalTestData = ["GLVK"];
        let normalExpected = [
            [{field: "index", headerName: "Index"},
            {field: "seq", headerName: "Sequence", flex: 1},
            {field: "length", headerName: "Length", flex: 1},
            {field: "charge", headerName: "Charge", flex: 1},
            {field: "retTime", headerName: "Retention Time", flex: 1}],

            [{
                id: 0, 
                index: 1, 
                seq: "GLVK", 
                length: 4, 
                charge: 2,
                retTime: 10.63
            }]
        ];
        let normalTestData2 = ["GLVK", "AAAGTKR"];
        let normalExpected2 = [
            [{field: "index", headerName: "Index"},
            {field: "seq", headerName: "Sequence", flex: 1},
            {field: "length", headerName: "Length", flex: 1},
            {field: "charge", headerName: "Charge", flex: 1},
            {field: "retTime", headerName: "Retention Time", flex: 1}],

            [{
                id: 0, 
                index: 1, 
                seq: "GLVK", 
                length: 4, 
                charge: 2,
                retTime: 10.63
            },
            {
                id: 1, 
                index: 2, 
                seq: "AAAGTKR", 
                length: 7, 
                charge: 3,
                retTime: 5.32
            }]
        ];

        let edgeTestData = [];
        let edgeTestExpected = [
            [{field: "index", headerName: "Index"},
            {field: "seq", headerName: "Sequence", flex: 1},
            {field: "length", headerName: "Length", flex: 1},
            {field: "charge", headerName: "Charge", flex: 1},
            {field: "retTime", headerName: "Retention Time", flex: 1}],
            []
        ]

        expect(testApp.populateTable(normalTestData)).toEqual(normalExpected);
        expect(testApp.populateTable(normalTestData2)).toEqual(normalExpected2);
        expect(testApp.populateTable(edgeTestData)).toEqual(edgeTestExpected);
    });

    test("packageTableData()", async () => {
        let normalTestData = ["GLVK", "AAAGTKR"];
        let initialExpected = [
            [
                { label: "Index", key: "index" },
                { label: "Sequence", key: "seq" },
                { label: "Length", key: "length" },
                { label: "Charge", key: "charge" },
                { label: "Retention Time", key: "retTime" }
            ],
            []
        ];
        let normalExpected = [
            [
                { label: "Index", key: "index" },
                { label: "Sequence", key: "seq" },
                { label: "Length", key: "length" },
                { label: "Charge", key: "charge" },
                { label: "Retention Time", key: "retTime" }
            ],
            [
                {
                    id: 0, 
                    index: 1, 
                    seq: "GLVK", 
                    length: 4, 
                    charge: 2,
                    retTime: 10.63
                },
                {
                    id: 1, 
                    index: 2, 
                    seq: "AAAGTKR", 
                    length: 7, 
                    charge: 3,
                    retTime: 5.32
                }
            ]
        ];

        // Initial Conditions
        expect(testApp.packageTableData()).toEqual(initialExpected);

        // Conditions which require modified state
        testApp.state.tableData = testApp.populateTable(normalTestData);
        expect(testApp.packageTableData()).toEqual(normalExpected);

    });
});

describe("Components render", () => {

    test("heading rendered", async () =>{
        render(<App />);
        const header = screen.getByRole("heading");
        expect(header).toBeInTheDocument();
    });
    
    test("textbox rendered", async () => {
        render(<App />);
        const textbox = screen.getByRole("textbox");
        expect(textbox).toBeInTheDocument();
    });

    test("submit button rendered", async () => {
        render(<App />);
        const submitButton = screen.getByText(/submit/i);
        expect(submitButton).toBeInTheDocument();
    });

    test("export button rendered", async () => {
        render(<App />);
        const exportButton = screen.getByText(/export to csv/i);
        expect(exportButton).toBeInTheDocument();
    });

});

describe("Initial Conditions", () => {
    let testApp = new App();

    test("textbox starts empty", async () => {
        render(<App />);
        const textbox = screen.getByRole("textbox");
        expect(textbox.value).toBe("");
        expect(testApp.state.input).toEqual("");
    });

    test("tableData initialized with column data", () => {

        let initialTableData = [
            [{field: "index", headerName: "Index"},
            {field: "seq", headerName: "Sequence", flex: 1},
            {field: "length", headerName: "Length", flex: 1},
            {field: "charge", headerName: "Charge", flex: 1},
            {field: "retTime", headerName: "Retention Time", flex: 1}],

            []
        ];
        expect(testApp.state.tableData).toEqual(initialTableData);
    })

    test("csvData initialized to be empty", () => {
        let initialCSVData = [[], []];
        expect(testApp.state.csvData).toEqual(initialCSVData);
    })
});

describe("Functionality", () => {
    test("textbox value changes", async () => {
        render(<App />);
        const textbox = screen.getByRole("textbox");
        fireEvent.change(textbox, { target: {value: "test"}});
        expect(textbox.value).toBe("test");
    });
});


