const ReferenceItemWorkingHours = ({
    data,
    columns,
    mode = "read",
    handleInputChange,
}) => {
    return (
        <tr className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer">
            {columns.map(({ key }) => {
                const value = data[key];

                if (Array.isArray(value) && value.length > 0) {
                    return (
                        <td
                            className="py-7 min-w-[180px] max-w-[200px]"
                            key={key}
                        >
                            <table className="w-full">
                                <tbody className="flex flex-col gap-3">
                                    {Array.isArray(value) ? (
                                        value.map((item, index) => (
                                            <tr
                                                className={`${
                                                    index !== value.length - 1
                                                        ? "border-b border-gray-300 pb-2"
                                                        : ""
                                                }`}
                                                key={`${key}_${index}`}
                                            >
                                                <td className="px-4">
                                                    {typeof item === "object" &&
                                                        item !== null &&
                                                        Object.entries(
                                                            item
                                                        ).map(
                                                            ([field, val]) => {
                                                                if (
                                                                    field ===
                                                                        "id" ||
                                                                    field ===
                                                                        "updated_at" ||
                                                                    field ===
                                                                        "last_updated"
                                                                ) {
                                                                    return null;
                                                                }

                                                                return (
                                                                    <div
                                                                        key={
                                                                            field
                                                                        }
                                                                    >
                                                                        {val?.toString() ||
                                                                            "—"}
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="px-4">—</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                    );
                } else {
                    return (
                        <td
                            className="px-4 py-7 min-w-[180px] max-w-[200px]"
                            key={key}
                        >
                            {mode === "edit" && key === "hours" ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        className={`w-full max-w-[80px] px-2 py-1 transition-colors border ${
                                            mode === "read"
                                                ? "border-transparent"
                                                : "border-gray-300"
                                        }`}
                                        value={value?.toString() || "—"}
                                        onChange={(e) =>
                                            handleInputChange(e, key, data.id)
                                        }
                                    />
                                </div>
                            ) : (
                                value?.toString() || "—"
                            )}
                        </td>
                    );
                }
            })}
        </tr>
    );
};

export default ReferenceItemWorkingHours;
