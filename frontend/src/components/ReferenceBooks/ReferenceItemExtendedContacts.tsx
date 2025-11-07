import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const ReferenceItemExtendedContacts = ({
    data,
    mode = "read",
    handleOpenEditPopup,
    handleOpenDeletePopup,
    setPopupState,
    setnewElem,
}) => {
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
                                        {contact.full_name?.toString() || "—"}
                                    </div>
                                    <span className="text">
                                        {contact.position?.toString() || "—"}
                                    </span>
                                </div>
                            </td>

                            <td className="px-4 py-5 min-w-[180px] max-w-[200px]">
                                <div className="flex flex-col gap-1">
                                    <div>
                                        {contact.phone?.toString() || "—"}
                                    </div>
                                    <span>
                                        {contact.email?.toString() || "—"}
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
                                                let updatedData = contact;
                                                updatedData.contactId = data.id;

                                                handleOpenEditPopup(
                                                    updatedData
                                                );
                                            }}
                                            className="edit-button"
                                            title="Изменить контакт"
                                        ></button>

                                        <button
                                            onClick={() =>
                                                handleOpenDeletePopup({
                                                    id: data.id,
                                                    contact: contact.id,
                                                })
                                            }
                                            className="delete-button extended"
                                            title="Удалить контакт"
                                        >
                                            <svg
                                                width="20"
                                                height="21"
                                                viewBox="0 0 20 21"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M5.833 8v9.166h8.333V8h1.667v10c0 .46-.373.833-.833.833H5A.833.833 0 014.166 18V8h1.667zm3.333 0v7.5H7.5V8h1.666zM12.5 8v7.5h-1.667V8H12.5zm0-5.833c.358 0 .677.229.79.57l.643 1.929h2.733v1.667H3.333V4.666h2.733l.643-1.93a.833.833 0 01.79-.57h5zm-.601 1.666H8.1l-.278.833h4.354l-.277-.833z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </button>
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
                    <td className="px-4 py-5 min-w-[180px] max-w-[200px]">
                        {data?.updated_by?.name}
                    </td>
                    <td className="px-4 py-5 min-w-[50px]"></td>
                </tr>
            )}
        </>
    );
};

export default ReferenceItemExtendedContacts;
