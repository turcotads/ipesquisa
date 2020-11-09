import { IReturnedData, IData } from "../components/IPesquisa";

export function converterResultToIReturnedData(result: any[]): IReturnedData {
  let ret: IReturnedData = {
    data: [] as IData,
    moreOption: false
  } as IReturnedData;

  result.forEach(({ id, sigla, nome }) => {
    ret.data = [...ret.data, { id, value: `${sigla} - ${nome}` }];
  });

  console.log(ret);

  return ret;
}
