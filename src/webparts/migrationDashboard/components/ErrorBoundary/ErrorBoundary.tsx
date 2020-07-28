import * as React from "react";

export default class ErrorBoundary extends React.Component<any,
    { hasError: boolean; error: any; errorInfo: any }>{
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: "", errorInfo: "" };
    }

    public componentDidCatch(error: any, errorInfo: any) {
        this.setState({
            hasError: true,
            error,
            errorInfo,
        });
        console.warn(error);
        console.info(errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    boxShadow: "3px 3px",
                    border: "1px solid #888",
                    padding: "10px",
                }}>
                    <h1>Sorry, something went wrong</h1>
                    <details style={{ whiteSpace: "pre-wrap" }}>
                        <summary style={{ cursor: "pointer", fontSize: "18px" }}> View error details 🐞 </summary>
                        <pre>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo.componentStack}
                        </pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}
