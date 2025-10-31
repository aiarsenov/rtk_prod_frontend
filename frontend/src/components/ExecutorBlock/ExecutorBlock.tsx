import { IMaskInput } from "react-imask";

const ExecutorBlock = ({ contanct, deleteBlock, mode, type }) => {
    const { id, full_name, phone, position, email } = contanct;
    const PhoneMask = "+{7}(000) 000 00 00";

    return (
        <li className="project-card__executors-item">
            <div>
                <b>{full_name}</b>
                <span>{position}</span>
            </div>

            <div>
                <span>
                    <IMaskInput
                        mask={PhoneMask}
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        placeholder="+7 999 999 99 99"
                        readOnly
                    />
                </span>
                <span>{email}</span>
            </div>

            {mode == "edit" && (
                <div className="project-card__executors-item__actions">
                    <button
                        className="project-card__executors-item__delete"
                        type="button"
                        title="Удалить исполнителя"
                        onClick={() => deleteBlock(id, type)}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5.834 7.5v9.167h8.333V7.5h1.667v10c0 .46-.373.833-.833.833H5a.833.833 0 01-.834-.833v-10h1.667zm3.333 0V15H7.501V7.5h1.666zm3.334 0V15h-1.667V7.5h1.667zm0-5.833c.358 0 .677.23.79.57l.643 1.929h2.733v1.667H3.334V4.167l2.732-.001.644-1.93a.833.833 0 01.79-.57h5zM11.9 3.333H8.101l-.278.833h4.354l-.277-.833z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                </div>
            )}
        </li>
    );
};

export default ExecutorBlock;
