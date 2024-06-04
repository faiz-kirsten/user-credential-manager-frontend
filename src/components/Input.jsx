export default function Input({ label, id, error, ...props }) {
    return (
        <div className="">
            <label htmlFor={id}>{label}</label>
            <input id={id} {...props} />
            <div className="">{error && <p>{error}</p>}</div>
        </div>
    );
}
