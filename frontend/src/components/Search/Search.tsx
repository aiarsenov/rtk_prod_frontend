import "./Search.scss";

const Search = ({
    onSearch,
    className = "",
    placeholder = "Поиск",
}: {
    onSearch: (event: { value: string }) => void;
    className?: string;
    placeholder?: string;
}) => {
    return (
        <search className="search">
            <form className={className}>
                <input
                    type="text"
                    className="form-field"
                    placeholder={placeholder}
                    onChange={(event) =>
                        onSearch({ value: event.target.value })
                    }
                />
            </form>
        </search>
    );
};

export default Search;
