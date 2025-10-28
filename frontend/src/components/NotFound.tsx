import { useLocation } from "react-router-dom";

const NotFound = () => {
    const location = useLocation();
    const {
        message = "Страница не найдена",
        errorCode = 404,
        additionalInfo = "",
    } = location.state || {};

    return (
        <main className="page grid min-h-full place-items-center">
            <div className="container">
                <div className="text-center">
                    <p className="font-semibold text-blue-400 text-5xl">404</p>
                    <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
                        {message}
                    </h1>
                    {additionalInfo && <p className="block my-2">{additionalInfo}</p>}
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="/"
                            className="block rounded-md bg-blue-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                        >
                            Вернуться на главную
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default NotFound;
