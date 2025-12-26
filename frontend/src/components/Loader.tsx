const Loader = ({
    bgColor = "",
    absolute = false | true,
}: {
    bgColor?: string;
    absolute?: boolean;
}) => {
    return (
        <div
            className={`loader ${absolute ? "absolute" : ""}`}
            style={{ background: bgColor }}
        >
            <div className="loader__icon"></div>
        </div>
    );
};

export default Loader;
