import {
  IData,
  ISearchOption,
  IReturnedData
} from "../src/components/IPesquisa";

const defaultOptions: IData[] = [
  { id: 1, value: "Maria" },
  { id: 2, value: "João" },
  { id: 3, value: "Fátima" },
  { id: 4, value: "José" },
  { id: 5, value: "Maria" },
  { id: 6, value: "Ana" }
];

export const apiFakeGetPessoas = (
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
