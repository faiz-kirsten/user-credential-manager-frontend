export default function Input({ label, id, error, ...props }) {
    let styles = "w-full h-10 px-2 rounded bg-gray-100";
    if (error) {
        styles += " border border-red-500 border-solid";
    }
    return (
        <div className="grid gap-1.5">
            <label htmlFor={id} className="text-gray-700">
                {label}
            </label>
            <div>
                <input id={id} {...props} className={styles} />
            </div>
            <div className="">{error && <p>{error}</p>}</div>
        </div>
    );
}
