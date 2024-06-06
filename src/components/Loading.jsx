export const Loading = ({ loadingMessage }) => {
    return (
        <div className="text-center text-2xl">
            <div className="lds-hourglass"></div>
            <div>{loadingMessage}</div>
        </div>
    );
};
