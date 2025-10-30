const EmployeeItem = ({
    name,
    position,
}: {
    name: string;
    position: string;
}) => {
    return (
        <li className="indicators__employees-list__item">
            <div>{name}</div>
            <span>{position?.name}</span>
        </li>
    );
};

export default EmployeeItem;
