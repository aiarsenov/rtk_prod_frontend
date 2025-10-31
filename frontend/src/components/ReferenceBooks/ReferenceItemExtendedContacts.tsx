import { IMaskInput } from "react-imask";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const ReferenceItemExtendedContacts = ({
    data,
    mode = "read",
    editContactElem,
    deleteContactElem,
    handleContactInputChange,
    setPopupState,
    setnewElem,
}) => {
    const PhoneMask = "+{7} (000) 000 00 00";

    return (
        <>
            {data.contacts?.length > 0 ? (
                <>
                    {data.contacts.map((contact, index) => (
                        <tr
                            key={`${data.id}_${contact.id}`}
                            className="border-b border-gray-300 text-base text-left"
                        >
                            {index === 0 && (
                                <td
                                    rowSpan={data.contacts.length}
                                    className="px-4 py-5 min-w-[180px] max-w-[200px] align-top"
                                >
                                    <div className="min-h-full flex items-center gap-2">
                                        <span className="text-xl">
                                            {data.name?.toString() || "—"}
                                        </span>
                                        {mode === "edit" && (
                                            <button
                                                type="button"
                                                className="add-button flex items-center"
                                                title="Добавить контакт"
                                                onClick={() => {
                                                    setnewElem({
                                                        contragent_id: data.id,
                                                    });
                                                    setPopupState(true);
                                                }}
                                            >
                                                <span></span>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}

                            <td className="px-4 py-5 min-w-[180px] max-w-[200px]">
                                <div className="flex flex-col gap-1">
                                    <div>
                                        <input
                                            type="text"
                                            className={`w-full text-xl p-1 border transition ${
                                                mode === "read"
                                                    ? "border-transparent"
                                                    : "border-gray-300"
                                            }`}
                                            value={
                                                contact.full_name?.toString() ||
                                                "—"
                                            }
                                            onChange={(e) =>
                                                handleContactInputChange(
                                                    e,
                                                    "full_name",
                                                    data,
                                                    contact.id
                                                )
                                            }
                                            disabled={
                                                mode === "read" ? true : false
                                            }
                                        />
                                    </div>
                                    <span className="text">
                                        <input
                                            type="text"
                                            className={`w-full p-1 border transition ${
                                                mode === "read"
                                                    ? "border-transparent"
                                                    : "border-gray-300"
                                            }`}
                                            value={
                                                contact.position?.toString() ||
                                                "—"
                                            }
                                            onChange={(e) =>
                                                handleContactInputChange(
                                                    e,
                                                    "position",
                                                    data,
                                                    contact.id
                                                )
                                            }
                                            disabled={
                                                mode === "read" ? true : false
                                            }
                                        />
                                    </span>
                                </div>
                            </td>

                            <td className="px-4 py-5 min-w-[180px] max-w-[200px]">
                                <div className="flex flex-col gap-1">
                                    <div>
                                        <IMaskInput
                                            mask={PhoneMask}
                                            className={`w-full text-xl p-1 border transition ${
                                                mode === "read"
                                                    ? "border-transparent"
                                                    : "border-gray-300"
                                            }`}
                                            name="phone"
                                            type="tel"
                                            inputMode="tel"
                                            onAccept={(value) =>
                                                handleContactInputChange(
                                                    value || "",
                                                    "phone",
                                                    data,
                                                    contact.id
                                                )
                                            }
                                            value={
                                                contact.phone?.toString() || "—"
                                            }
                                            disabled={
                                                mode === "read" ? true : false
                                            }
                                        />
                                    </div>
                                    <span>
                                        <input
                                            type="text"
                                            className={`w-full p-1 border transition ${
                                                mode === "read"
                                                    ? "border-transparent"
                                                    : "border-gray-300"
                                            }`}
                                            value={
                                                contact.email?.toString() || "—"
                                            }
                                            onChange={(e) =>
                                                handleContactInputChange(
                                                    e,
                                                    "email",
                                                    data,
                                                    contact.id
                                                )
                                            }
                                            disabled={
                                                mode === "read" ? true : false
                                            }
                                        />
                                    </span>
                                </div>
                            </td>

                            <td className="px-4 py-5 min-w-[180px] max-w-[200px] text-xl">
                                {contact.updated_at
                                    ? format(
                                          parseISO(contact.updated_at),
                                          "d MMMM yyyy, HH:mm",
                                          { locale: ru }
                                      )
                                    : "—"}
                            </td>

                            <td className="px-4 py-5 min-w-[180px] max-w-[200px] text-xl">
                                {contact.author?.toString() || "—"}
                            </td>

                            <td className="px-4 py-5 min-w-[50px] text-center">
                                {mode === "edit" && (
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => {
                                                editContactElem(
                                                    data.id,
                                                    contact.id
                                                );
                                            }}
                                            className="delete-button save-icon"
                                            title="Изменить контакт"
                                        ></button>

                                        <button
                                            onClick={() =>
                                                deleteContactElem(
                                                    data.id,
                                                    contact.id
                                                )
                                            }
                                            className="delete-button delete-icon"
                                            title="Удалить контакт"
                                        ></button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </>
            ) : (
                <tr className="border-b border-gray-300 text-base text-left">
                    <td className="px-4 py-5 min-w-[180px] max-w-[200px] align-top">
                        <div className="min-h-full flex items-center gap-2">
                            <span className="text-xl">
                                {data.name?.toString() || "—"}
                            </span>
                            {mode === "edit" && (
                                <button
                                    type="button"
                                    className="add-button flex items-center"
                                    title="Добавить контакт"
                                    onClick={() => {
                                        setnewElem({
                                            contragent_id: data.id,
                                        });
                                        setPopupState(true);
                                    }}
                                >
                                    <span></span>
                                </button>
                            )}
                        </div>
                    </td>

                    <td className="px-4 py-5 min-w-[180px] max-w-[200px]"></td>
                    <td className="px-4 py-5 min-w-[180px] max-w-[200px]"></td>
                    <td className="px-4 py-5 min-w-[180px] max-w-[200px]"></td>
                    <td className="px-4 py-5 min-w-[180px] max-w-[200px]"></td>
                    <td className="px-4 py-5 min-w-[50px]"></td>
                </tr>
            )}
        </>
    );
};

export default ReferenceItemExtendedContacts;
