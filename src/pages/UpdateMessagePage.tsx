import { UpdateMessage } from "../components/UpdateMessage";


export const UpdateMessagePage = () => {
  return (
    <div className="pt-5">
      <h2 className="text-6xl font-bold mb-6 pb-8 text-center bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
            Update Message
      </h2>
      <UpdateMessage />
    </div>
  );
};