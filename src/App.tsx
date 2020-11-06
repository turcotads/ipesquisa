import { Page, LayoutPage, Card } from "@furg/layout-react-lib";
import React from "react";
import { useForm } from "react-hook-form";
import IPesquisa, {
  IData,
  IReturnedData,
  ISearchOption
} from "./components/IPesquisa";

const searchOptions: ISearchOption[] = [
  { label: "Identificador", field: "id", defaultSelected: false },
  { label: "Nome", field: "nm_pessoa", defaultSelected: true }
];

const defaultOptions: IData[] = [
  { id: 1, value: "Maria" },
  { id: 2, value: "João" },
  { id: 3, value: "Fátima" },
  { id: 4, value: "José" },
  { id: 5, value: "Maria" },
  { id: 6, value: "Ana" }
];

const loadOptions = (
  term: string,
  limit: number = 1,
  offset: number = 0,
  selectedSearchOption: ISearchOption
) =>
  new Promise<IReturnedData>((resolve) => {
    setTimeout(() => {
      const startSlice = offset;
      const endSlice = offset + limit;

      if (term) {
        let filteredData: IData[] = [];

        if (selectedSearchOption.field === "nm_pessoa") {
          filteredData = defaultOptions.filter((d: IData) =>
            d.value.toLowerCase().includes(term.toLowerCase())
          );
        }

        if (selectedSearchOption.field === "id") {
          filteredData = defaultOptions.filter(
            (d: IData) => d.id === Number(term)
          );
        }

        resolve({
          data: filteredData.slice(startSlice, endSlice),
          moreOption: filteredData.slice(endSlice, endSlice + 1).length > 0
        });
      } else {
        resolve({
          data: defaultOptions.slice(startSlice, endSlice) as IData[],
          moreOption: defaultOptions.slice(endSlice, endSlice + 1).length > 0
        });
      }

      resolve();
    }, 1200);
  });

const App: React.FC = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => console.log(data);

  return (
    <>
      <LayoutPage>
        <Page title="Texugo" subtitle="Casuar">
          <Card title="Texugão">
            <span>Dados a serem consultados:</span>
            <pre>{defaultOptions && JSON.stringify(defaultOptions)}</pre>
            <hr />

            <form onSubmit={handleSubmit(onSubmit)}>
              <label>Teste: </label>
              <input name="teste" ref={register} />
              <br />

              <IPesquisa
                ref={register}
                label="IPessoa"
                name="id_pessoa"
                loadOptions={loadOptions}
                searchOptions={searchOptions}
                defaultValue={1}
              />
              <br />

              <button type="submit">Enviar</button>
            </form>
          </Card>
        </Page>
      </LayoutPage>
    </>
  );
};

export default App;
