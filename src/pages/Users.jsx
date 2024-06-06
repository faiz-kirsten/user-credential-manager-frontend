export const Users = ({ otherUsers }) => {
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-ss-lg">
            <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                    <tr scope="col" className="">
                        <th scope="col" className="px-6 py-3">
                            Username
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Surname
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Roles
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Operations
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {otherUsers.map((user) => (
                        <tr key={user.username} className="bg-white border-b">
                            <td
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {user.username}
                            </td>
                            <td scope="row" className="px-6 py-4">
                                {user.name}
                            </td>
                            <td scope="row" className="px-6 py-4">
                                {user.surname}
                            </td>
                            <td scope="row" className="px-6 py-4">
                                {user.title}
                            </td>
                            <td
                                scope="row"
                                className="flex gap-0.5 items-center px-6 py-4">
                                {user.roles.map((role) => (
                                    <div
                                        key={role}
                                        className="bg-gray-200 px-1 rounded text-gray-700">
                                        {role}
                                    </div>
                                ))}
                            </td>
                            <td scope="row" className="px-6 py-4">
                                View Edit
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
