import "./Search.scss";

const Search = ({ onSearch, className, placeholder }) => {
    return (
        <search>
            <form className={className ? `search ${className}` : "search"}>
                <input
                    type="text"
                    placeholder={placeholder || 'Поиск'}
                    onChange={(event) => onSearch(event.target)}
                />
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 50 50"><path d="M21 4C11.082 4 3 12.082 3 22s8.082 18 18 18a17.87 17.87 0 009.82-2.938l12.559 12.56 4.242-4.243-12.396-12.397C37.58 29.938 39 26.135 39 22c0-9.918-8.082-18-18-18zm0 4c7.756 0 14 6.244 14 14s-6.244 14-14 14S7 29.756 7 22 13.244 8 21 8z" fill="currentColor"/></svg>
                </span>
            </form>
        </search>
    );
};

export default Search;
