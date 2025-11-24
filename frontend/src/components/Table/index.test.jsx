import React from "react";
import { render } from "@testing-library/react";
import Table from ".";

describe("void Table", () => {
    let columns;
    let rows;
    let props;

    beforeEach(() => {
        columns = ["name", "age"];
        
        rows = {
            data: [
                {
                    name: "Costa",
                    age: "10",
                },
                {
                    name: "Helder",
                    age: "10",
                },
            ],
        };

        props = {
            columns,
            rows,
        };
    });

    it("renders the component", () => {
        const { container } = render(<Table {...props} />);

        expect(container).toMatchSnapshot();
    });

    describe("when dont exists data", () => {
        beforeEach(() => {
            rows = [];
            props = [];
        });

        it("renders the component", () => {
            const { container } = render(<Table {...props} />);

            expect(container).toMatchSnapshot();
        });
    });
});
