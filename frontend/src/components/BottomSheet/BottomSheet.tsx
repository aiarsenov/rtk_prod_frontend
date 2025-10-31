// import { useRef } from "react";

import "./BottomSheet.scss";

const BottomSheet = ({ children, onClick, className }) => {
    // const startY = useRef(null);
    // const isScrolling = useRef(false);

    // const handleTouchStart = (e) => {
    //     startY.current = e.touches[0].clientY;
    //     isScrolling.current = false;
    // };

    // const handleTouchMove = (e) => {
    //     const scrollableEl = e.target.closest(".reports__list");
    //     if (scrollableEl) {
    //         const { scrollTop, scrollHeight, clientHeight } = scrollableEl;

    //         if (scrollTop > 0 && scrollTop < scrollHeight - clientHeight) {
    //             isScrolling.current = true;
    //         }
    //     }
    // };

    // const handleTouchEnd = (e) => {
    //     if (isScrolling.current) return;
    //     const endY = e.changedTouches[0].clientY;
    //     if (endY - startY.current > 50) {
    //         onClick();
    //     }
    // };

    return (
        <div
            className={`bottom-sheet ${className}`}
            onClick={onClick}
            // onTouchStart={handleTouchStart}
            // onTouchMove={handleTouchMove}
            // onTouchEnd={handleTouchEnd}
        >
            <div
                className="bottom-sheet__wrapper"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bottom-sheet__icon"></div>

                <div className="bottom-sheet__body">
                    <button
                        type="button"
                        className="bottom-sheet__close-btn"
                        onClick={onClick}
                        title="Закрыть активное окно"
                    >
                        <span></span>
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BottomSheet;
