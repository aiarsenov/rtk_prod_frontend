import { useState } from "react";
import { NavLink } from "react-router-dom";

import formatToFullDate from "../../utils/formatToFullDate";

const ReferenceBooksMainGridItem = ({ data }: { data: object }) => {
    const [imageExists, setImageExists] = useState(true);

    return (
        <NavLink
            to={`/reference-books/${data.alias}`}
            className="reference-books__main-grid__item grid-item"
            title={`Открыть справочник ${data.name}`}
            aria-label={`Открыть справочник ${data.name}`}
        >
            <div className="grid-item__name">
                {data.name} ({data.items_count})
            </div>

            {imageExists && (
                <img
                    className="grid-item__icon"
                    src={`/dictionaries/${data.alias}.svg`}
                    alt={data.name}
                    onError={() => setImageExists(false)}
                />
            )}

            <div className="grid-item__info">
                <span>Последние изменения:</span>
                <br />

                <div>
                    <span>{data.last_updated_by}</span>
                    {data.last_updated_by && data.last_updated && "•"}
                    <span>{formatToFullDate(data.last_updated)}</span>
                </div>
            </div>
        </NavLink>
    );
};

export default ReferenceBooksMainGridItem;
