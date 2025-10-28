const Loader = ({
    transparent = false,
    bgColor = "",
}: {
    transparent?: boolean;
    bgColor?: string;
}) => {
    return (
        <div
            className={`loader ${transparent ? "transparent" : ""}`}
            style={{ background: bgColor }}
        >
            <div className="loader__icon"></div>
        </div>
    );
};

export default Loader;
