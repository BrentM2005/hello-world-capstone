import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";

const fetchUserMessages = async (userId: string) => {
  const { data, error } = await supabase
    .from("messages") // From messages table
    .select("message_id, content") // Select only id and content
    .eq("user_id", userId) // Where user_id matches
    .order("created_at", { ascending: false }); // Order from newest to oldest

  // If there's an error, throw it
  if (error) {
    throw error;
  }

  return data;
};

const updateMessage = async ({messageId, content}: {messageId: number; content: string;}) => {
  const { data, error } = await supabase
    .from("messages") 
    .update({ content }) // Update content
    .eq("message_id", messageId) // Where message_id matches
    .select() // Return the updated row
    .single(); // Expect a single row

  // If there's an error, throw it
  if (error) {
    console.error(error);
    throw error;
  }

  // If no data returned, throw an error
  if (!data) {
    throw new Error("Update failed: no rows updated");
  }

  return data;
};

export const UpdateMessage = () => {
  const { user } = useAuth(); // Get current user from auth context
  const queryClient = useQueryClient(); // Cache manager from React Query

  const [selectedId, setSelectedId] = useState<number | null>(null); // The ID of the selected message
  const [content, setContent] = useState(""); // The content of the selected message

  const { data: messages, isLoading } = useQuery({
    queryKey: ["userMessages", user?.id], // Unique key for this query
    queryFn: () => fetchUserMessages(user!.id), // Function to fetch messages
    enabled: !!user, // Only run if user is logged in
  });

  const updateMutation = useMutation({
    mutationFn: updateMessage, // Calls updateMessage function
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] }); // Refetch messages to update the list
      alert("Message updated!");
    },
  });

  const handleSelect = (messageId: number) => {
    // Find the selected message from the fetched messages
    const selectedMessage = messages?.find((m) => m.message_id === messageId);

    // If no message found, return
    if (!selectedMessage) {
        return;
    }

    // Set the selected message ID for updating
    setSelectedId(messageId);
    // Populate the content state with the selected message's content
    setContent(selectedMessage.content);
  };

  const handleSubmit = (e: React.FormEvent) => {
    // Prevent default form submission behavior
    e.preventDefault();

    // If no message is selected, return
    if (!selectedId) { 
        return;
    }

    // Call mutate with messageId and new content
    updateMutation.mutate({
      messageId: selectedId,
      content,
    });
  };

  // If no user is logged in
  if (!user) {
    return <p>Please sign in to update messages.</p>;
  }

  // While loading messages
  if (isLoading) {
    return <p>Loading messages...</p>;
  }

  // Form rendering
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      {/* Dropdown to select message to edit */}
      <select
        className="w-full border p-2 rounded"
        value={selectedId ?? ""}
        onChange={(e) => handleSelect(Number(e.target.value))}
      >
        <option value="" disabled>
          Select a message to edit
        </option>
        {/* Populate options with user's messages */}
        {messages?.map((msg) => (
          <option key={msg.message_id} value={msg.message_id}>
            {msg.content.slice(0, 30)}…
          </option>
        ))}
      </select>

      {/* Textarea to edit message content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)} // Update content state on change
        rows={5}
        className="w-full border p-2 rounded"
        disabled={!selectedId} // Disable if no message selected
      />

      <button
        type="submit"
        disabled={!selectedId || updateMutation.isPending} // Disable if no message selected or pending
        className="bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-500"
      >
        {updateMutation.isPending ? "Updating..." : "Update Message"}
      </button>
    </form>
  );
};