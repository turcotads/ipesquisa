import { ISearchOption, IReturnedData } from "../src/components/IPesquisa";
import { converterResultToIReturnedData } from "../utils/converter";

export const apiFakeGetEstados = (
  term: string,
  limit: number = 10,
  offset: number = 0,
  selectedSearchOption: ISearchOption
) =>
  new Promise<IReturnedData>((resolve) => {
    setTimeout(() => {
      const startSlice = offset;
      const endSlice = offset + limit;

      fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then((response) => response.json())
        .then((data) => {
          const defaultOptionsEstados = data;

          if (term) {
            let filteredData: any[] = [];

            if (selectedSearchOption.field === "nome") {
              filteredData = defaultOptionsEstados.filter((d: any) =>
                d.nome.toLowerCase().includes(term.toLowerCase())
              );
            }

            if (selectedSearchOption.field === "sigla") {
              filteredData = defaultOptionsEstados.filter((d: any) =>
                d.sigla.toLowerCase().includes(term.toLowerCase())
              );
            }

            if (selectedSearchOption.field === "id") {
              filteredData = defaultOptionsEstados.filter(
                (d: any) => d.id === Number(term)
              );
            }

            const convertedData = converterResultToIReturnedData(filteredData);

            resolve({
              data: convertedData.data.slice(startSlice, endSlice),
              moreOption:
                convertedData.data.slice(endSlice, endSlice + 1).length > 0
            });
          } else {
            const convertedData = converterResultToIReturnedData(
              defaultOptionsEstados
            );
            resolve({
              data: convertedData.data.slice(startSlice, endSlice),
              moreOption:
                convertedData.data.slice(endSlice, endSlice + 1).length > 0
            });
          }
        });
    }, 1200);
  });
