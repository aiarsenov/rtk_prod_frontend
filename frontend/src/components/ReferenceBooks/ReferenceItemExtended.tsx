import { useLayoutEffect, useRef, useState } from "react";

import { IMaskInput } from "react-imask";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const PhoneMask = "+{7} (000) 000 00 00";

const ReferenceItemExtended = ({
    mode,
    data,
    editContragentAndCreditorContact,
    deleteContact,
}: {
    mode: string;
    data: object;
    editContragentAndCreditorContact: () => void;
    deleteContact: () => void;
}) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const [editedContacts, setEditedContacts] = useState(() => {
        return data.contacts?.map((contact) => ({
            full_name: contact.full_name,
            position: contact.position,
            phone: contact.phone,
            email: contact.email,
            id: contact.id,
        }));
    });

    const findObjectById = (targetId) => {
        const flatData = editedContacts.flat();
        return flatData.find((obj) => obj.id === targetId);
    };

    const targetRefs = useRef([]);
    const projectsRefs = useRef([]);
    const phoneRefs = useRef([]);
    const lastChangeRefs = useRef([]);
    const authorRefs = useRef([]);
    const actionsRefs = useRef([]);

    useLayoutEffect(() => {
        requestAnimationFrame(() => {
            data.contacts?.forEach((_, index) => {
                const targetEl = targetRefs.current[index];
                if (!targetEl) return;

                const targetHeight = targetEl.getBoundingClientRect().height;

                if (targetHeight) {
                    [
                        projectsRefs,
                        phoneRefs,
                        projectsRefs,
                        lastChangeRefs,
                        authorRefs,
                        actionsRefs,
                    ].forEach((refs) => {
                        const el = refs.current[index];
                        if (el) {
                            el.style.height = `${targetHeight}px`;
                        }
                    });
                }
            });
        });
    }, [data.contacts]);

    return (
        <tr className="registry-table__item registry-table__item_extended text-left text-base">
            <td className="align-top">
                <strong>{data.name}</strong>
            </td>

            <td className="align-top" style={{ padding: 0 }}>
                <table className="w-full">
                    <tbody>
                        {data.contacts.map((contact, index) => (
                            <tr
                                key={index}
                                ref={(el) => (targetRefs.current[index] = el)}
                                className={
                                    hoveredIndex === index ? "hovered" : ""
                                }
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <td className="min-w-[180px] w-full">
                                    {/* {mode === "read" ? ( */}
                                    {/* <> */}
                                    <div className="extended__info">
                                        <div>{contact.full_name}</div>
                                        <span>{contact.position}</span>
                                    </div>

                                    {/* </> */}
                                    {/* ) : (
                                        <>
                                            <input
                                                className="text-xl border border-gray-300 p-1"
                                                value={
                                                    editedContacts[index]
                                                        ?.full_name || ""
                                                }
                                                onChange={(e) => {
                                                    const newEdited = [
                                                        ...editedContacts,
                                                    ];
                                                    newEdited[index] = {
                                                        ...newEdited[index],
                                                        full_name:
                                                            e.target.value,
                                                    };
                                                    setEditedContacts(
                                                        newEdited
                                                    );
                                                }}
                                            />
                                            <input
                                                className="text-xl border border-gray-300 p-1"
                                                value={
                                                    editedContacts[index]
                                                        ?.position || ""
                                                }
                                                onChange={(e) => {
                                                    const newEdited = [
                                                        ...editedContacts,
                                                    ];
                                                    newEdited[index] = {
                                                        ...newEdited[index],
                                                        position:
                                                            e.target.value,
                                                    };
                                                    setEditedContacts(
                                                        newEdited
                                                    );
                                                }}
                                            />
                                        </>
                                    )} */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            <td className="align-top" style={{ padding: 0 }}>
                <table className="w-full">
                    <tbody className="flex flex-col">
                        {data.contacts.map((contact, index) => (
                            <tr
                                key={index}
                                ref={(el) => (projectsRefs.current[index] = el)}
                                className={
                                    hoveredIndex === index ? "hovered" : ""
                                }
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <td className="min-w-[180px] max-w-[300px]">
                                    <div className="extended__info">
                                        {contact.projects_count}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            <td className="align-top" style={{ padding: 0 }}>
                <table className="w-full">
                    <tbody className="flex flex-col">
                        {data.contacts.map((contact, index) => (
                            <tr
                                key={index}
                                ref={(el) => (phoneRefs.current[index] = el)}
                                className={
                                    hoveredIndex === index ? "hovered" : ""
                                }
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <td className="min-w-[180px] w-full">
                                    {/* {mode === "read" ? (
                                        <> */}

                                    <div className="extended__info">
                                        <div>{contact.phone}</div>
                                        <div>{contact.email}</div>
                                    </div>

                                    {/* </>
                                    ) : (
                                        <>
                                            <IMaskInput
                                                mask={PhoneMask}
                                                className="text-xl border border-gray-300 p-1"
                                                name="phone"
                                                type="tel"
                                                inputMode="tel"
                                                value={
                                                    editedContacts[index]
                                                        ?.phone || ""
                                                }
                                                onAccept={(value) => {
                                                    const newEdited = [
                                                        ...editedContacts,
                                                    ];
                                                    newEdited[index] = {
                                                        ...newEdited[index],
                                                        phone: value,
                                                    };
                                                    setEditedContacts(
                                                        newEdited
                                                    );
                                                }}
                                            />
                                            <input
                                                className="text-xl border border-gray-300 p-1"
                                                value={
                                                    editedContacts[index]
                                                        ?.email || ""
                                                }
                                                onChange={(e) => {
                                                    const newEdited = [
                                                        ...editedContacts,
                                                    ];
                                                    newEdited[index] = {
                                                        ...newEdited[index],
                                                        email: e.target.value,
                                                    };
                                                    setEditedContacts(
                                                        newEdited
                                                    );
                                                }}
                                            />
                                        </>
                                    )} */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            <td className="align-top">
                <div
                    className="min-w-[180px] max-w-[300px]"
                    ref={(el) => (lastChangeRefs.current[0] = el)}
                >
                    {format(
                        parseISO(data.last_updated_at),
                        "d MMMM yyyy, HH:mm",
                        {
                            locale: ru,
                        }
                    ) || "-"}
                </div>
            </td>

            <td className="align-top">
                <div
                    className="min-w-[180px] max-w-[300px]"
                    ref={(el) => (authorRefs.current[0] = el)}
                >
                    {data.updated_by?.name || "-"}
                </div>
            </td>

            <td className="align-top">
                <table className="w-full">
                    <tbody className="flex flex-col">
                        {data.contacts.map((contact, index) => (
                            <tr
                                key={contact.id}
                                ref={(el) => (actionsRefs.current[index] = el)}
                            >
                                <td className="min-w-[40px]">
                                    {mode === "edit" && (
                                        <div className="registry-table__item-actions registry-table__item-actions_col">
                                            <button
                                                onClick={() =>
                                                    editContragentAndCreditorContact(
                                                        findObjectById(
                                                            contact.id
                                                        )
                                                    )
                                                }
                                                className="edit-button"
                                                title="Изменить контакт"
                                            ></button>

                                            <button
                                                onClick={() =>
                                                    deleteContact(contact.id)
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
                    </tbody>
                </table>
            </td>
        </tr>
    );
};

export default ReferenceItemExtended;
