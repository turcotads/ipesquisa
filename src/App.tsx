import React from "react";
import { useForm } from "react-hook-form";
import IPesquisa, { ISearchOption } from "./components/IPesquisa";

import { apiFakeGetPessoas } from "../services/pessoas";
import { apiFakeGetEstados } from "../services/estados";

const searchOptionsPessoa: ISearchOption[] = [
  { label: "Identificador", field: "id", defaultSelected: false },
  { label: "Nome", field: "nm_pessoa", defaultSelected: true }
];

const searchOptionsEstados: ISearchOption[] = [
  { label: "Nome", field: "nome", defaultSelected: true },
  { label: "Sigla", field: "sigla", defaultSelected: false },
  { label: "Identificador", field: "id", defaultSelected: false }
];

const App: React.FC = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => console.log(data);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Teste: </label>
        <input name="teste" ref={register} />
        <br />

        <IPesquisa
          ref={register}
          label="IPessoa"
          name="id_pessoa"
          loadOptions={apiFakeGetPessoas}
          searchOptions={searchOptionsPessoa}
          initValue={{
            id: 1,
            value: "Maria"
          }}
        />
        <br />

        <IPesquisa
          ref={register}
          label="IEstado (UF)"
          name="id_estado"
          loadOptions={apiFakeGetEstados}
          searchOptions={searchOptionsEstados}
          limitOptions={10}
        />
        <br />

        <button type="submit">Enviar</button>
      </form>
    </>
  );
};

export default App;
