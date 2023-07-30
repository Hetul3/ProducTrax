import { useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AiOutlineCheck } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [updateCommentId, setUpdateCommentId] = useState(null);
  const [updatedText, setUpdatedText] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const scrollContainerRef = useRef(null);

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
    const index = comments.findIndex((c) => c.id === commentId);
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
      body: JSON.stringify({ index }), // Pass the index here
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // Update the local comments state to reflect the deleted comment
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } else {
      console.error("Failed to delete comment.");
    }
  };

  const handleUpdate = async (commentId) => {
    const commentToUpdate = comments.find((c) => c.id === commentId);

    if (updateCommentId === commentId) {
      const index = comments.findIndex((c) => c.id === commentId);
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        body: JSON.stringify({ text: updatedText, index }), // Pass the index here
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Update the local comments state to reflect the updated comment
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? { ...comment, text: updatedText }
              : comment
          )
        );
        setUpdateCommentId(null);
        setUpdatedText(""); // Clear the updated text
      } else {
        console.error("Failed to update comment.");
      }
    } else {
      setUpdateCommentId(commentId);
      setUpdatedText(commentToUpdate.text);
    }
  };

  const handleKeyPress = (event, commentId) => {
    if (event.key === "Enter") {
      if (event.target.id === "main-input") {
        handleComment();
      } else if (event.target.id === "update-input") {
        handleUpdate(commentId);
      }
    }
  };

  useEffect(() => {
    fetchComments();
    deleteComment(0);
  }, []);

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

  return (
    <>
      <button className="todo-list-submit-button" onClick={handleComment}>
        Submit Comment
      </button>
      <button onClick={setDarkMode(!darkMode)}>Setup dark mode</button>
      <hr />
      <div className="todo-list-parent-container">
        <div className="todo-list-input-container">
          <input
            id="main-input"
            className="todo-list-text-input"
            type="text"
            placeholder="Add Something"
            value={comment}
            onKeyPress={handleKeyPress}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="line"></div>
        </div>
        {isClient && ( // Render the content only on the client-side
          <DragDropContext onDragEnd={handleDragEnd}>
            {comments.length > 0 ? ( // Check if comments array is not empty before rendering Droppable
              <Droppable droppableId="droppable-comments">
                {(provided, snapshot) => (
                  <div
                    className="todo-list-items-container"
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
                              <div className="todo-list-item-container">
                                <input
                                  key={comment.id}
                                  id="update-input"
                                  className="todo-list-update-input"
                                  type="text"
                                  value={updatedText}
                                  onKeyPress={(event) =>
                                    handleKeyPress(event, comment.id)
                                  } // Pass comment.id here
                                  onChange={(e) =>
                                    setUpdatedText(e.target.value)
                                  }
                                />
                                <button
                                  className="todo-list-update-button"
                                  onClick={() => handleUpdate(comment.id)}
                                >
                                  <BiSolidPencil />
                                </button>
                              </div>
                            ) : (
                              // Render the regular comment view if not being updated
                              <>
                                <div className="todo-list-item-parent-container">
                                  <div className="todo-list-item-text-container">
                                    <h2 className="todo-list-item-text">
                                      {comment.text}
                                    </h2>
                                  </div>
                                  <div className="todo-list-item-button-container">
                                    <button
                                      className="todo-list-update-button"
                                      onClick={() => handleUpdate(comment.id)}
                                    >
                                      <BiSolidPencil />
                                    </button>
                                    <button
                                      className="todo-list-delete-button"
                                      onClick={() => deleteComment(comment.id)}
                                    >
                                      <AiOutlineCheck />
                                    </button>
                                  </div>
                                </div>
                                <hr className="list-line" />
                              </>
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
      </div>
    </>
  );
}
