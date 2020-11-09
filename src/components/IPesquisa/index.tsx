import React from "react";

export interface IData {
  id: number;
  value: string;
}

export interface ISearchOption {
  label: string;
  field: string;
  defaultSelected: boolean;
}

export interface IReturnedData {
  data: IData[];
  moreOption: boolean;
}

interface IProps extends React.HTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  initValue: IData;
  searchOptions: ISearchOption[];
  loadOptions: (
    term: string,
    limit: number,
    offset: number,
    selectedSearchOption: ISearchOption
  ) => Promise<IReturnedData>;
  limitOptions: number;
  offsetOptions: number;
}

const IPesquisa = React.forwardRef<HTMLInputElement, IProps>(
  (
    {
      loadOptions,
      name,
      label,
      initValue = {} as IData,
      placeholder = "Pesquisar",
      limitOptions = 2,
      offsetOptions = 0,
      searchOptions
    },
    ref
  ) => {
    const [term, setTerm] = React.useState<string>("");
    const [selected, setSelected] = React.useState<IData>(initValue);
    const [data, setData] = React.useState<IData[]>();
    // const [loading, setLoading] = React.useState<boolean>(true); // Estava true por conta de obter os dados ao montar o component
    const [loading, setLoading] = React.useState<boolean>(false);
    const [showData, setShowData] = React.useState<boolean>(false);

    const [offset, setOffset] = React.useState<number>(offsetOptions);
    const [moreData, setMoreData] = React.useState<boolean>(false);

    const [selectedSearchOption, setSelectedSearchOption] = React.useState<
      ISearchOption
    >({} as ISearchOption);

    React.useEffect(() => {
      setSelectedSearchOption(
        searchOptions.filter((option) => option.defaultSelected)[0]
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      setTerm(selected.value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSelect = (id: number) => {
      const select: IData = data?.filter((d: IData) => d.id === id)[0] as IData;

      if (!select) {
        setSelected({} as IData);
      } else {
        setTerm(select.value);
        setSelected(select);
      }

      setShowData(false);
      setData([]);
      setOffset(0);
    };

    const onSearch = async function () {
      setLoading(true);

      setSelected({} as IData);

      const res: IReturnedData = (await loadOptions(
        term,
        limitOptions,
        offset,
        selectedSearchOption
      )) as IReturnedData;
      setData(res.data as IData[]);
      setMoreData(res.moreOption ?? false);
      setShowData(true);

      setLoading(false);
    };

    const handleKeyPressTerm = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onSearch();
      } else {
        setSelected({} as IData);
        setShowData(false);
        setOffset(0);
      }
    };

    const handleOnClickSearch = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      event.stopPropagation();
      onSearch();
    };

    const handleChangeTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(event.target.value);
    };

    const handleBlurTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();
      const isNotSelected = !Object.keys(selected).length;
      const isNotData = !data?.length;

      // se não tem nada selecionado e pesquisado
      if (isNotSelected && isNotData) {
        setTerm("");
        setOffset(0);
        setShowData(false);
      }
    };

    const handleMoreData = async function (
      event: React.MouseEvent<HTMLButtonElement>
    ) {
      event.preventDefault();

      const newOffsetOptions: number = offset + limitOptions;

      setLoading(true);

      const res: IReturnedData = (await loadOptions(
        term,
        limitOptions,
        newOffsetOptions,
        selectedSearchOption
      )) as IReturnedData;
      setData((prev) => (prev ? [...prev, ...res.data] : undefined));
      setMoreData(res?.moreOption ?? false);

      setLoading(false);

      setOffset(newOffsetOptions);
    };

    const handleChangeOptionToSerach = (
      event: React.ChangeEvent<HTMLSelectElement>
    ) => {
      event.stopPropagation();
      setSelectedSearchOption(
        searchOptions.filter((option) => option.field === event.target.value)[0]
      );
    };

    return (
      <>
        <label>{label}: </label>
        <input type="hidden" ref={ref} name={name} defaultValue={selected.id} />
        <input
          type="text"
          placeholder={placeholder}
          value={term}
          onChange={handleChangeTerm}
          onKeyPress={handleKeyPressTerm}
          onBlur={handleBlurTerm}
        />

        <button type="button" onClick={handleOnClickSearch}>
          Buscar
        </button>

        <select
          value={selectedSearchOption.field}
          onChange={handleChangeOptionToSerach}
        >
          {searchOptions.map((option) => (
            <option key={option.field} value={option.field}>
              {option.label}
            </option>
          ))}
        </select>

        {loading && <p>Loading...</p>}

        {!loading && (
          <>
            {showData && data?.length !== 0 && (
              <ul>
                {data?.map((d) => (
                  <li key={d.id}>
                    {d.id} - {d.value} -{" "}
                    <button onClick={() => onSelect(d.id)}>Selecionar</button>
                  </li>
                ))}
                {moreData && (
                  <button type="button" onClick={handleMoreData}>
                    Mais dados
                  </button>
                )}
              </ul>
            )}

            {showData && data?.length === 0 && (
              <p>Nenhum resultado encontrado!</p>
            )}
          </>
        )}
      </>
    );
  }
);

export default IPesquisa;
