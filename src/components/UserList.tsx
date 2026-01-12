import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";

const fetchUsernames = async () => {
  const { data, error } = await supabase.rpc("get_message_usernames"); // Call the RPC function

  // If there's an error, throw it 
  if (error) { 
    throw error;
  }

  // Return usernames
  return data as { user_name: string }[];
};

export const UserList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["usernames"], // Unique key for the query
    queryFn: fetchUsernames, // Function to fetch the data
  });

  // While loading, show a loading message
  if (isLoading) {
    return <p>Loading users...</p>;
  }

  // If there's an error, show an error message
  if (isError) {
    return <p className="text-red-500">Failed to load users.</p>;
  }

  // Render the list of usernames
  return (
    <div className="max-w-md mx-auto">
      <ul className="space-y-2">
        {data?.map((user, index) => ( // Loop through usernames
          <li
            key={index}
            className="border p-2 rounded bg-gray-100 text-blue-700 font-medium"
          >
            {user.user_name}
          </li>
        ))}
      </ul>
    </div>
  );
};