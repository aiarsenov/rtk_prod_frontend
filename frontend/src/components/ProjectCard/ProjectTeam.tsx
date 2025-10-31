const ProjectTeam = ({ teamData }) => {
    return (
        <ul className="project-card__team-list">
            {teamData.length > 0 ? (
                teamData?.map((teammate) => (
                    <li
                        key={teammate.id}
                        className="project-card__team-list-item"
                    >
                        <b>{teammate.name}</b>
                        <span>
                            {teammate.type === "person"
                                ? "Сотрудник"
                                : "Подрядчик"}
                        </span>

                        <span>{teammate.role_name}</span>
                    </li>
                ))
            ) : (
                <li className="project-card__team-list-nodata">Нет данных</li>
            )}
        </ul>
    );
};

export default ProjectTeam;
