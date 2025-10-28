const Loader = ({ transparent = false }: { transparent?: boolean }) => {
    return (
        <div className={`loader ${transparent ? "transparent" : ""}`}>
            <div className="loader__icon"></div>
        </div>
    );
};

export default Loader;
