import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";
import { useAuth } from "../context/AuthContext";

// The shape of a Message
export interface Message {
  message_id: number; 
  content: string;
  created_at: string;
  user_name: string;
  user_id: string;
}

// Fetches messages from Supabase (the database)
const fetchMessages = async (): Promise<Message[]> => {
  const { data, error } = await supabase
    .from("messages") // From the messages table
    .select("*") // Select all columns
    .order("created_at", { ascending: false }); // Order from newest to oldest

  // If there's an error, throw it
  if (error) {
    throw error;
  }

  // Return the fetched messages
  return data as Message[];
};

// Deletes a message by its ID
const deleteMessage = async (messageId: number) => {
  const { error } = await supabase
    .from("messages")
    .delete() // Delete
    .eq("message_id", messageId); // Where message_id matches

  // If there's an error, throw it
  if (error) {
    throw error;
  }
};

export const MessageList = () => {
  const { user } = useAuth(); // Get current user from auth context
  const queryClient = useQueryClient(); // Cache manager from React Query, to invalidate queries

  // This fetches and caches data (messages)
  const { data, error, isLoading } = useQuery<Message[]>({
    queryKey: ["messages"], // Unique key for this query
    queryFn: fetchMessages, // Function to fetch messages
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage, // Function to delete a message
    onSuccess: () => {
      // If successful, refetch messages to update the list
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error) => {
      // Log error and alert user
      console.error("Error deleting message:", error);
      alert("Failed to delete message. You may not have permission.");
    },
  });

  // Called when delete button is clicked
  const handleDelete = (messageId: number) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMutation.mutate(messageId); // Trigger the delete mutation
    }
  };

  // While loading, show loading message
  if (isLoading) {
    return <div className="text-center">Loading messages...</div>;
  }

  // If there's an error, show error message
  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error loading messages: {(error as Error).message}
      </div>
    );
  }

  // Render the list of messages
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {data && data.length > 0 ? ( // If there are messages
        data.map((message: Message) => { // Loop through each message
          const isOwner = user?.id === message.user_id; // Check if current user is the owner
          
          return (
            <div
              key={message.message_id} 
              className="p-4 border border-white/10 rounded bg-blue-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-white">{message.content}</p> {/* Message content*/}
                  {/* Posted by user + date */}
                  <p className="text-sm text-white mt-2">
                    Posted by {message.user_name} on{" "} 
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
                
                {/* Show delete button only if the user is the owner */}
                {isOwner && (
                  <button
                    onClick={() => handleDelete(message.message_id)} 
                    disabled={deleteMutation.isPending}
                    className="ml-4 text-red-500 hover:text-red-600 disabled:text-gray-500 transition-colors"
                    aria-label="Delete message"
                  >
                    {deleteMutation.isPending ? (
                      <span className="text-sm">Deleting...</span>
                    ) : (
                        <p className="text-sm font-[1000]">X</p>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-black">No messages found.</div>
      )}
    </div>
  );
};