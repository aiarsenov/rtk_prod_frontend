import { useEffect, useState } from "react";
import getData from "../../utils/getData";

import ReferenceBooksMainGridItem from "./ReferenceBooksMainGridItem";
import Loader from "../Loader";
import AccessDenied from "../AccessDenied/AccessDenied";

import "./ReferenceBooks.scss";

const ReferenceBooks = () => {
    const [booksItems, setBooksItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setHasAccess(true);

        getData(`${import.meta.env.VITE_API_URL}dictionaries`, {
            Accept: "application/json",
        })
            .then((response) => {
                if (response.status == 200) {
                    setBooksItems(response.data.dictionaries);
                }
            })
            .catch((error) => {
                if (error.status === 403) {
                    setHasAccess(false);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    if (!hasAccess) {
        return <AccessDenied message="У вас нет прав для просмотра раздела справочников" />;
    }

    return (
        <main className="page">
            <div className="container reference-books__container">
                <div className="registry__header">
                    <h1 className="title">Реестр справочников</h1>
                </div>

                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="reference-books__main-grid">
                        {booksItems.length > 0 &&
                            booksItems.map((item) => (
                                <ReferenceBooksMainGridItem
                                    key={item.alias}
                                    data={item}
                                />
                            ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default ReferenceBooks;
