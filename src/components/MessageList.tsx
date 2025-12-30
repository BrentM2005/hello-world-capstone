import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";
import { useAuth } from "../context/AuthContext";

export interface Message {
  message_id: number; 
  content: string;
  created_at: string;
  user_name: string;
  user_id: string;
}

const fetchMessages = async (): Promise<Message[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as Message[];
};

const deleteMessage = async (messageId: number) => {
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("message_id", messageId); 

  if (error) {
    throw error;
  }
};

export const MessageList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: fetchMessages,
    refetchInterval: 5000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error) => {
      console.error("Error deleting message:", error);
      alert("Failed to delete message. You may not have permission.");
    },
  });

  const handleDelete = (messageId: number) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMutation.mutate(messageId);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading messages...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error loading messages: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {data && data.length > 0 ? (
        data.map((message: Message) => {
          const isOwner = user?.id === message.user_id;
          
          return (
            <div
              key={message.message_id} 
              className="p-4 border border-white/10 rounded bg-blue-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-white">{message.content}</p>
                  <p className="text-sm text-white mt-2">
                    Posted by {message.user_name} on{" "}
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
                
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