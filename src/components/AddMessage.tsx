import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";

// The shape of the message input 
interface MessageInput {
  content: string;
  user_name: string;
  user_id: string;
}

// Function to add a message to Supabase
const addMessage = async (message: MessageInput) => {
  const { data, error } = await supabase
    .from("messages") // In messages table
    .insert([message]) // Insert the new message
    .select(); // Return the inserted message

  // If there's an error, throw it
  if (error) {
    throw error;
  }

  return data;
};

export const AddMessage = () => {
  const [content, setContent] = useState<string>(""); // State to hold message content
  const { user } = useAuth(); // Get current user from auth context

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: MessageInput) => {
      return addMessage(data); // Call addMessage function
    },
    onSuccess: () => {
      setContent(""); // Clear the content field
      console.log("Message added successfully!");
    },
    onError: (error) => {
      console.error("Error adding message:", error); // Log any errors
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior

    // If no user is logged in, alert and return
    if (!user) {
      alert("You must be logged in to post a message");
      return;
    }

    // Call mutate to add the message
    mutate({
      content,
      user_name: user.user_metadata?.user_name || user.email || "Anonymous",
      user_id: user.user_metadata?.id || user.id || "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="content" className="text-black block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)} // Update content state on change
          className="w-full border border-black/10 bg-transparent p-2 rounded text-black"
          rows={5}
          required
        />
      </div>
      <button
        type="submit"
        disabled={isPending || !user} // Disable button if pending or no user
        className="bg-blue-700 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Creating..." : "Create Message"}
      </button>

      {isError && (
        <p className="text-red-500">Error creating message. Please try again.</p>
      )}
      
      {!user && (
        <p className="text-blue-700">Please sign in to post a message.</p>
      )}
    </form>
  );
};