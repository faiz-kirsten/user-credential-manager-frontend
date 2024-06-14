import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { updateUser } from "../utils/http";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loading2 } from "../components/Loading2";
import { FaKey } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";

export const Users = ({ users, showRequestedUsers }) => {
    const storedToken = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleUsersRequest = async (userId, requestedDivision) => {
        setLoading(true);

        const updatedUser = await updateUser(
            {
                userId,
                properties: {
                    division: requestedDivision,
                    requestedDivision: null,
                },
                accept: true,
            },
            false,
            storedToken
        );

        navigate(0);
        setLoading(false);
    };
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
                    {users.map((user) => (
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
                                {showRequestedUsers ? (
                                    <>
                                        {loading ? (
                                            <Loading2 />
                                        ) : (
                                            <Button
                                                style="primary"
                                                onClick={() =>
                                                    handleUsersRequest(
                                                        user._id,
                                                        user.requestedDivision
                                                    )
                                                }>
                                                Accept
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex gap-1 items-center">
                                        <Link
                                            to={`/users/${user._id}/credentials?division=${user.division}`}
                                            className="underline underline-offset-4  hover:text-blue-600 bg-white text-gray-700">
                                            <FaKey />
                                        </Link>
                                        <Link
                                            to={`/users/${user._id}/profile`}
                                            className="underline underline-offset-4  hover:text-blue-600 bg-white text-gray-700">
                                            <FaUser />
                                        </Link>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
