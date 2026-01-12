import { UserList } from "../components/UserList"

export const UserListPage = () => {
    return (
        <div className="pt-5">
            <h2 className="text-6xl font-bold mb-6 pb-8 text-center bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
                Users
            </h2>
            <UserList />
        </div>
    )
}