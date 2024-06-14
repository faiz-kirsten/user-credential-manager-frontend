export const ShowUserInfo = ({ fetchedUser }) => {
    return (
        <>
            <div className="grid gap-1 text-lg">
                <span className="text-gray-700">Username: </span>
                <span className="">{fetchedUser.username}</span>
            </div>
            <div className="grid gap-1 text-lg">
                <span className="text-gray-700">Name: </span>
                <span>{fetchedUser.name}</span>
            </div>
            <div className="grid gap-1 text-lg">
                <span className="text-gray-700">Surname: </span>
                <span>{fetchedUser.surname}</span>
            </div>
            <div className="grid gap-1 text-lg">
                <span className="text-gray-700">Title: </span>
                <span>{fetchedUser.title}</span>
            </div>
            {fetchedUser.division !== null ? (
                <div className="grid gap-1 text-lg">
                    <span className="text-gray-700">Division: </span>
                    <span>{fetchedUser.division.name}</span>
                </div>
            ) : (
                <div className="grid gap-1 text-lg">
                    <span className="text-gray-700">Requested Division: </span>
                    <span>{fetchedUser.requestedDivision.name}</span>
                </div>
            )}
            <div className="grid gap-1 text-lg">
                <span className="text-gray-700">Role(s): </span>
                <span className="flex gap-1 text-lg">
                    {fetchedUser.roles.map((role) => (
                        <span
                            key={role}
                            className="bg-gray-200 px-1 rounded text-gray-700">
                            {role}{" "}
                        </span>
                    ))}
                </span>
            </div>
        </>
    );
};
