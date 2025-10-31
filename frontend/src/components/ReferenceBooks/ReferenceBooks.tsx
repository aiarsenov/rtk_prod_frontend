import { useEffect, useState } from "react";
import getData from "../../utils/getData";
import ReferenceItem from "./ReferenceItem";

const ReferenceBooks = () => {
    const [booksItems, setBooksItems] = useState([]);

    useEffect(() => {
        getData(`${import.meta.env.VITE_API_URL}dictionaries`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setBooksItems(response.data.dictionaries);
            }
        });
    }, []);

    const COLUMNS = [
        { label: "Наименование", key: "name" },
        { label: "Кол-во элементов", key: "items_count" },
        { label: "Последнее изменение", key: "last_updated" },
        { label: "Автор измнения", key: "author" },
    ];

    return (
        <main className="page">
            <div className="container py-8">
                <div className="flex justify-between items-center gap-6 mb-8">
                    <h1 className="text-3xl font-medium">
                        Реестр справочников
                    </h1>
                </div>

                <div className="overflow-x-auto w-full pb-5">
                    <table className="table-auto w-full border-collapse border-b border-gray-300 text-sm">
                        <thead className="text-gray-400 text-left">
                            <tr className="border-b border-gray-300">
                                {COLUMNS.map(({ label, key }) => (
                                    <th
                                        className="text-base px-4 py-2 min-w-[180px] max-w-[200px]"
                                        rowSpan="2"
                                        key={key}
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {booksItems.length > 0 &&
                                booksItems.map((item, index) => (
                                    <ReferenceItem
                                        key={index}
                                        data={item}
                                        columns={COLUMNS}
                                    />
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default ReferenceBooks;
