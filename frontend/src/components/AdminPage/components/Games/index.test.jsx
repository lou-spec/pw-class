import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as hookGet from "../../hooks/useGetData";
import * as hookPost from "../../hooks/usePostData";
import { TabContext } from "../../contexts/TabProvider/TabContext";
import Games from ".";
import { add, set } from "lodash";

describe("Games", () => {
    let setGamesCountMock;
    let addDataMock;

    const renderComponent = (
        component,
        value= { setGamesCount: setGamesCountMock }
    ) => {
        return <TabContext.Provider value={value}>{component}</TabContext.Provider>;
    };

    beforeEach(() => {
        vi.spyOn(hookGet, "useGetData").mockReturnValue({
            data:{
                games: [],
            },
            isLoading: false,
        });

        addDataMock = vi.fn(() => {});
        setGamesCountMock = vi.fn();
    });

    it("renders the component", () => {
        const {container} = render(renderComponent(<Games />));
       
        expect(container).toMatchSnapshot();
    });

    describe("when the data has games", () => {
            beforeEach(() => {
                // A opção de beforeEach major termos determinados valores,
                // e assim não temos que alterar manualmente o caso é diferente.
                // neste caso a nossa resposta vai ter objectos (jogos)
                vi.spyOn(hookGet, "useGetData").mockReturnValue({
                    data: {
                        games: [
                            {
                                id: 1,
                                date: "22/10/2025",
                                name: "Nome",
                                image: "url",
                                local: "local",
                                visitors: "visitor",
                                home: "home"
                            },
                        ],
                    },
                    isLoading: false,
                });
            });

            it("know must call the setState", () => {
                render(renderComponent(<Games />));

                expect(setGamesCountMock).toHaveBeenCalledWith(1);
            });
        });

    describe("when is loading games", () => {
            beforeEach(() => {
                // Mais uma vez atrávamos a resposta, mas desta vez queremos fingir que estamos a carregar
                vi.spyOn(hookGet, "useGetData").mockReturnValue({
                    data: {
                        games: [],
                    },
                    isLoading: true,
                });
            });

            it("renders the component with loading", () => {
                render(renderComponent(<Games />));

                expect(screen.getByText("Is Loading")).toBeInTheDocument();
            });
        });

    describe("when is happens an error", () => {
            beforeEach(() => {
                // Mais uma vez alteramos a resposta, mas desta vez queremos fingir que temos algum tipo de erro
                vi.spyOn(hookGet, "useGetData").mockReturnValue({
                    data: {
                        games: [],
                    },
                    isError: true,
                });
            });

            it("renders the component with error", () => {
                render(renderComponent(<Games />));

                expect(screen.getByText("UPPSSSS")).toBeInTheDocument();
            });
        });

    describe("when is posting", () => {
            beforeEach(() => {
                // Mais uma vez alteramos a resposta de um hook diferente
                vi.spyOn(hookPost, "usePostData").mockReturnValue({
                    addData: () => {},
                    isLoading: true,
                });
            });

            it("renders the component with loading", () => {
                render(renderComponent(<Games />));

                expect(screen.getByText("is Loading")).toBeInTheDocument();
            });
        });

    describe("when add data and want post success values", async () => {
            // Vamos simular o input de texto onde nos irá o nome
            let inputElement = {};

            beforeEach(() => {
                // já vimos esta linha anteriormente
                vi.spyOn(hookPost, "usePostData").mockReturnValue({
                    addData: addDataMock,
                    isLoading: false,
                });

                // Como acabamos de entrar vai valer falso, "vou fazer o reset do mock"
                addDataMock.mockClear();

                const { getByTestId } = render(renderComponent(<Games />));

                // vamos buscar o input usando o testId, que ja criamos antes
                inputElement = screen.getByRole("textbox", { name: /name/i });

                // vamos buscar o input usando o getByPlaceholder;
                expect(inputElement).toBeInTheDocument();
            });

            describe("input", () => {
                it("add text to the input", async () => {
                    await userEvent.type(inputElement, "Name");

                    // quando acaba de escrever vamos verificar se o que escrevemos está lá ou não
                    // vamos verificar o output atraves do text.value, ou o node.value
                    expect(inputElement.value).toBe("Name");
                });
            });



            describe("Submit button", () => {
                it("renders the submit button", () => {
                    const typeButton = screen.getByTestId("submitButton");
                    expect(typeButton).toBeInTheDocument();
                    expect(typeButton.value).toBe("Add Game");
                });
            });

            it("how will add when with value", () => {
                // expect(...).getByRole()
                // ... anything()
            });
        });
});