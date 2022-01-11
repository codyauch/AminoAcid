import "@testing-library/jest-dom"
import { render, screen, fireEvent} from "@testing-library/react"
import App from "./App"

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
    test("textbox starts empty", async () => {
        render(<App />);
        const textbox = screen.getByRole("textbox");
        expect(textbox.value).toBe("");
    });
});

describe("Functionality", () => {
    test("textbox value changes", async () => {
        render(<App />);
        const textbox = screen.getByRole("textbox");
        fireEvent.change(textbox, { target: {value: "test"}});
        expect(textbox.value).toBe("test");
    });
});


