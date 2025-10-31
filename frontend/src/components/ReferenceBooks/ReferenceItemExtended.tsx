import { useLayoutEffect, useRef, useState } from "react";

import { IMaskInput } from "react-imask";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const ReferenceItemExtended = ({
    mode,
    data,
    editContragentAndCreditorContact,
    deleteContact,
}) => {
    const PhoneMask = "+{7} (000) 000 00 00";

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
        <tr className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer">
            <td className="pl-4">{data.name}</td>

            <td className="align-top">
                <table className="w-full">
                    <tbody className="flex flex-col gap-3">
                        {data.contacts.map((contact, index) => (
                            <tr
                                key={index}
                                ref={(el) => (targetRefs.current[index] = el)}
                            >
                                <td className="py-3 px-4 min-w-[180px] w-full flex flex-col gap-1">
                                    {mode === "read" ? (
                                        <>
                                            <div className="text-xl p-1 border border-transparent">
                                                {contact.full_name}
                                            </div>
                                            <div className="text-xl p-1 border border-transparent">
                                                {contact.position}
                                            </div>
                                        </>
                                    ) : (
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
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            <td className="align-top">
                <table className="w-full">
                    <tbody className="flex flex-col gap-3">
                        {data.contacts.map((contact, index) => (
                            <tr
                                key={index}
                                ref={(el) => (projectsRefs.current[index] = el)}
                            >
                                <td className="py-3 px-4 min-w-[180px]">
                                    {contact.projects_count}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            <td className="align-top">
                <table className="w-full">
                    <tbody className="flex flex-col gap-3">
                        {data.contacts.map((contact, index) => (
                            <tr
                                key={index}
                                ref={(el) => (phoneRefs.current[index] = el)}
                            >
                                <td className="py-3 px-4 min-w-[180px] w-full flex flex-col gap-1">
                                    {mode === "read" ? (
                                        <>
                                            <div className="text-xl p-1 border border-transparent">
                                                {contact.phone}
                                            </div>
                                            <div className="text-xl p-1 border border-transparent">
                                                {contact.email}
                                            </div>
                                        </>
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
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>

            <td className="align-top">
                <div
                    className="py-3 px-4 min-w-[180px]"
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
                    className="py-3 px-4 min-w-[180px]"
                    ref={(el) => (authorRefs.current[0] = el)}
                >
                    {data.author || "-"}
                </div>
            </td>

            <td className="align-top">
                <table className="w-full">
                    <tbody className="flex flex-col gap-3">
                        {data.contacts.map((contact, index) => (
                            <tr
                                key={contact.id}
                                ref={(el) => (actionsRefs.current[index] = el)}
                            >
                                <td className="py-3 px-4 min-w-[50px] text-center">
                                    {mode === "edit" && (
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() =>
                                                    editContragentAndCreditorContact(
                                                        findObjectById(
                                                            contact.id
                                                        )
                                                    )
                                                }
                                                className="delete-button save-icon"
                                                title="Изменить контакт"
                                            ></button>
                                            <button
                                                onClick={() =>
                                                    deleteContact(contact.id)
                                                }
                                                className="delete-button delete-icon"
                                                title="Удалить контакт"
                                            ></button>
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
