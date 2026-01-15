import { useLayoutEffect, useRef, useState } from "react";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const ReferenceItemExtended = ({
    mode,
    data,
    bookId,
    handleOpenEditPopup,
    handleOpenDeletePopup,
}: {
    mode: object;
    data: object;
    bookId: string;
    handleOpenEditPopup: () => void;
    handleOpenDeletePopup: () => void;
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
            <td className="align-top max-w-[300px]">
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
                                <td className="min-w-[180px] max-w-[300px] w-full relative">
                                    <div className="extended__info first-block h-full">
                                        <div>{contact.full_name}</div>
                                        <span>{contact.position}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            {bookId !== "suppliers-with-reports" &&
                bookId !== "lead-contacts" && (
                    <td className="align-top" style={{ padding: 0 }}>
                        <table className="w-full">
                            <tbody>
                                {data.contacts.map((contact, index) => (
                                    <tr
                                        key={index}
                                        ref={(el) =>
                                            (projectsRefs.current[index] = el)
                                        }
                                        className={
                                            hoveredIndex === index
                                                ? "hovered"
                                                : ""
                                        }
                                        onMouseEnter={() =>
                                            setHoveredIndex(index)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredIndex(null)
                                        }
                                    >
                                        <td className="min-w-[180px] max-w-[300px] w-full relative">
                                            <div className="extended__info h-full">
                                                <div>
                                                    {contact.projects_count}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </td>
                )}

            <td className="align-top" style={{ padding: 0 }}>
                <table className="w-full">
                    <tbody>
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
                                <td className="min-w-[180px] max-w-[300px] w-full relative">
                                    <div className="extended__info h-full">
                                        <div>{contact.phone}</div>
                                        <div>{contact.email}</div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            <td className="align-top" style={{ padding: 0 }}>
                <table className="w-full">
                    <tbody>
                        {data.contacts.map((contact, index) => (
                            <tr
                                key={index}
                                ref={(el) =>
                                    (lastChangeRefs.current[index] = el)
                                }
                                className={
                                    hoveredIndex === index ? "hovered" : ""
                                }
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <td className="min-w-[180px] max-w-[300px] w-full relative">
                                    <div className="extended__info h-full">
                                        <div>
                                            {bookId !== "lead-contacts" &&
                                                (contact?.last_updated_at
                                                    ? format(
                                                          parseISO(
                                                              contact.last_updated_at
                                                          ),
                                                          "d MMMM yyyy, HH:mm",
                                                          { locale: ru }
                                                      )
                                                    : "-")}

                                            {bookId == "lead-contacts" &&
                                                (contact?.updated_at
                                                    ? format(
                                                          parseISO(
                                                              contact.updated_at
                                                          ),
                                                          "d MMMM yyyy, HH:mm",
                                                          { locale: ru }
                                                      )
                                                    : "-")}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            <td className="align-top" style={{ padding: 0 }}>
                <table className="w-full">
                    <tbody>
                        {data.contacts.map((contact, index) => (
                            <tr
                                key={index}
                                ref={(el) => (authorRefs.current[index] = el)}
                                className={
                                    hoveredIndex === index ? "hovered" : ""
                                }
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <td className="min-w-[180px] max-w-[300px] w-full relative">
                                    <div className="extended__info h-full">
                                        <div>
                                            {bookId !== "lead-contacts"
                                                ? contact.author || "-"
                                                : contact?.updated_by?.name ||
                                                  "-"}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            <td className="align-top" style={{ padding: "0 15px 0 0" }}>
                <table className="w-full">
                    <tbody>
                        {data.contacts.map((contact, index) => (
                            <tr
                                key={contact.id}
                                ref={(el) => (actionsRefs.current[index] = el)}
                                className={
                                    hoveredIndex === index ? "hovered" : ""
                                }
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <td className="relative">
                                    <div className="registry-table__item-actions registry-table__item-actions_col">
                                        {mode.edit === "full" && (
                                            <button
                                                onClick={() => {
                                                    if (
                                                        bookId ===
                                                        "suppliers-with-reports"
                                                    ) {
                                                        let updatedData =
                                                            contact;
                                                        updatedData.contactId =
                                                            data.id;

                                                        handleOpenEditPopup(
                                                            updatedData
                                                        );
                                                    } else if (
                                                        bookId ===
                                                        "lead-contacts"
                                                    ) {
                                                        let updatedData =
                                                            contact;

                                                        updatedData.leadId =
                                                            data.id;

                                                        handleOpenEditPopup(
                                                            updatedData
                                                        );
                                                    } else {
                                                        handleOpenEditPopup(
                                                            findObjectById(
                                                                contact.id
                                                            )
                                                        );
                                                    }
                                                }}
                                                className="edit-button"
                                                title="Изменить контакт"
                                            ></button>
                                        )}

                                        {mode.delete === "full" && (
                                            <button
                                                onClick={() => {
                                                    if (
                                                        bookId ===
                                                        "suppliers-with-reports"
                                                    ) {
                                                        handleOpenDeletePopup({
                                                            id: data.id,
                                                            contact: contact.id,
                                                        });
                                                    } else if (
                                                        bookId ===
                                                        "lead-contacts"
                                                    ) {
                                                        handleOpenDeletePopup({
                                                            leadId: data.id,
                                                            contact: contact.id,
                                                        });
                                                    } else {
                                                        handleOpenDeletePopup({
                                                            id: contact.id,
                                                        });
                                                    }
                                                }}
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
                                        )}
                                    </div>
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
