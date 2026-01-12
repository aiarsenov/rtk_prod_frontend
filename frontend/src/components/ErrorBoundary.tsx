import React from "react";

class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error(error, info);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Что-то пошло не так</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
