import { useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [updateCommentId, setUpdateCommentId] = useState(null);
  const [updatedText, setUpdatedText] = useState("");

  const fetchComments = async () => {
    const response = await fetch("/api/comments");
    const data = await response.json();
    setComments(data);
  };

  const handleComment = async () => {
    const response = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ comment }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    fetchComments();
    console.log(data);
  };

  const deleteComment = async (commentId) => {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });
    fetchComments();
  };

  const handleUpdate = async (commentId) => {
    if (updateCommentId === commentId) {
      // If the comment is already being updated, save the changes
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        body: JSON.stringify({ text: updatedText }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        fetchComments();
        setUpdateCommentId(null);
        setUpdatedText(""); // Clear the updated text
      } else {
        console.error("Failed to update comment.");
      }
    } else {
      // If the comment is not yet being updated, set it to update mode
      setUpdateCommentId(commentId);
      const commentToUpdate = comments.find((c) => c.id === commentId);
      setUpdatedText(commentToUpdate.text);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    deleteComment(0);
  }, []);

  const [isClient, setIsClient] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setIsClient(true); // Set to true on the client-side
    fetchComments();
  }, []);

  useEffect(() => {
    if (isClient && scrollContainerRef.current) {
      // Set the custom scroll container reference only on the client-side
      window.customScrollContainer = scrollContainerRef.current;
    }
  }, [isClient]);

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.source.index === result.destination.index) {
      return;
    }

    const updatedComments = Array.from(comments);
    const [reorderedItem] = updatedComments.splice(result.source.index, 1);
    updatedComments.splice(result.destination.index, 0, reorderedItem);

    setComments(updatedComments);
  };

  const buttonStyling = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "200px",
    height: "50px",
    backgroundColor: "#ff4081",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    margin: "auto",
    marginTop: "10px",
  };

  return (
    <>
      <button style={buttonStyling} onClick={handleComment}>
        Submit Comment
      </button>
      <div className="input-container">
        <input
          className="text-input"
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      {isClient && ( // Render the content only on the client-side
        <DragDropContext onDragEnd={handleDragEnd}>
          {comments.length > 0 ? ( // Check if comments array is not empty before rendering Droppable
            <Droppable droppableId="droppable-comments">
              {(provided, snapshot) => (
                <div
                  ref={(ref) => {
                    provided.innerRef(ref);
                    scrollContainerRef.current = ref;
                  }}
                  {...provided.droppableProps}
                  data-rbd-droppable-context-id={
                    snapshot.isUsingPlaceholder ? "droppable-context" : "1"
                  }
                >
                  {comments.map((comment, index) => (
                    <Draggable
                      key={comment.id}
                      draggableId={comment.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {updateCommentId === comment.id ? (
                            // Render the update form if the comment is being updated
                            <div>
                              <input
                                type="text"
                                value={updatedText}
                                onChange={(e) => setUpdatedText(e.target.value)}
                              />
                              <button onClick={() => handleUpdate(comment.id)}>
                                Update
                              </button>
                            </div>
                          ) : (
                            // Render the regular comment view if not being updated
                            <h2>
                              {comment.id} {comment.text}
                              <button onClick={() => handleUpdate(comment.id)}>
                                Update
                              </button>
                              <button onClick={() => deleteComment(comment.id)}>
                                Delete
                              </button>
                            </h2>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ) : (
            // Render a fallback if comments array is empty
            <></>
          )}
        </DragDropContext>
      )}
    </>
  );
}
