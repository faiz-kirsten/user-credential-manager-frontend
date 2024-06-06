export const Button = ({ style, children, ...props }) => {
    let styles = "py-1 px-3 ";

    if (style === "primary") {
        styles +=
            " border-solid border-gray-700 border rounded bg-gray-700 text-gray-200 hover:bg-gray-200 hover:text-gray-700 hover:border-gray-700";
    } else if (style === "secondary") {
        styles +=
            " underline underline-offset-4 hover:text-gray-800 hover:text-blue-600 bg-white text-gray-700 ";
    } else {
        styles +=
            " text-gray-600 hover:underline hover:underline-offset-4 hover:text-blue-600";
    }

    return (
        <button className={styles} {...props}>
            {children}
        </button>
    );
};
