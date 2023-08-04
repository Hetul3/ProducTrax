import { useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AiOutlineCheck } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function CommentsPage() {
  const router = useRouter();
  const { date: session, status } = useSession();

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [updateCommentId, setUpdateCommentId] = useState(null);
  const [updatedText, setUpdatedText] = useState("");
  const [updatedDate, setUpdatedDate] = useState({});
  const [isClient, setIsClient] = useState(false);
  const scrollContainerRef = useRef(null);

  const numberToMonth = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const fetchComments = async () => {
    const response = await fetch("/api/comments");
    const data = await response.json();
    setComments(data);
    console.log(data.date);
  };

  const handleComment = async () => {
    const current = new Date();
    const temp_month = current.getMonth();
    const temp_day = current.getDate();
    const temp_hour = current.getHours();
    const temp_minute = current.getMinutes();
    const temp_seconds = current.getSeconds();
    const now = {
      temp_month,
      temp_day,
      temp_hour,
      temp_minute,
      temp_seconds,
    };
    const commentData = {
      comment,
      now,
    };

    const response = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ commentData }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    fetchComments();
    console.log(data);
  };

  const handleUpdate = async (commentId) => {
    const commentToUpdate = comments.find((c) => c.id === commentId);
    const current = new Date();
    const temp_month = current.getMonth();
    const temp_day = current.getDate();
    const temp_hour = current.getHours();
    const temp_minute = current.getMinutes();
    const temp_seconds = current.getSeconds();
    const now = {
      temp_month,
      temp_day,
      temp_hour,
      temp_minute,
      temp_seconds,
    };
    setUpdatedDate(now);

    if (updateCommentId === commentId) {
      const index = comments.findIndex((c) => c.id === commentId);
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        body: JSON.stringify({
          text: updatedText,
          index,
          date: {
            month: updatedDate.temp_month,
            day: updatedDate.temp_day,
            hour: updatedDate.temp_hour,
            minute: updatedDate.temp_minute,
            seconds: updatedDate.temp_seconds,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        // Update the local comments state to reflect the updated comment
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  text: updatedText,
                  date: {
                    month: updatedDate.temp_month,
                    day: updatedDate.temp_day,
                    hour: updatedDate.temp_hour,
                    minute: updatedDate.temp_minute,
                    seconds: updatedDate.temp_seconds,
                  },
                } // Update the date in the local state
              : comment
          )
        );

        setUpdateCommentId(null);
        setUpdatedText(""); // Clear the updated text
        setUpdatedDate({});
      } else {
        console.error("Failed to update comment.");
      }
    } else {
      setUpdateCommentId(commentId);
      setUpdatedText(commentToUpdate.text);
      setUpdatedDate(now);
    }
  };

  const deleteComment = async (commentId) => {
    const index = comments.findIndex((c) => c.id === commentId);
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
      body: JSON.stringify({ index }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } else {
      console.error("Failed to delete comment.");
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

  useEffect(() => {
    if (status !== "authenticated") {
      router.replace("/404");
    }
  }, [status, router]);

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
                                <div className="todo-list-item-mega-parent-container">
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
                                        onClick={() =>
                                          deleteComment(comment.id)
                                        }
                                      >
                                        <AiOutlineCheck />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="date-text">
                                    {numberToMonth[comment.date.month]} /{" "}
                                    {comment.date.day} / {comment.date.hour}:
                                    {comment.date.minute
                                      .toString()
                                      .padStart(2, "0")}
                                    :
                                    {comment.date.seconds
                                      .toString()
                                      .padStart(2, "0")}
                                  </p>
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
