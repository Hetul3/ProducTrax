import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";

export default function Notes() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [clientSide, setClientSide] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    setClientSide(true);
  }, []);

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const fetchNotes = async () => {
    const response = await fetch("/api/notes");
    const data = await response.json();
    setNotes(data);
    console.log(data);
  };

  const handleCreate = async () => {
    try {
      const userSession = await getSession();
      console.log(userSession);

      const userID = userSession.user.id;
      const noteTitle = title;
      const noteText = note;

      const noteData = {
        noteTitle,
        noteText,
        userID,
      };

      const response = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify({ noteData }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        fetchNotes();
        console.log(data);
      } else {
        console.error("Failed to create note");
      }
    } catch (error) {
      console.error("Error when fetching session:", error);
    }
    setAddingNote(false);
  };

  const handleCancel = () => {
    setTitle("");
    setNote("");
    setAddingNote(false); // Exit adding note mode
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      router.replace("/404");
    }
  }, [status, router]);

  return (
    <>
      <h1 className="notes-header">Long Form Notes to Manage Information</h1>
      <hr />
      {addingNote ? (
        <div className="note-interactibles">
          <input
            className="notes-title-form"
            id="title-input"
            type="text"
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={30}
          />
          <hr />
          <textarea
            className="notes-text-form"
            rows="10"
            id="note-input"
            type="text"
            placeholder="Add note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={2500}
          />
          <button className="notes-button" onClick={handleCreate}>
            Click to submit
          </button>
          <button className="notes-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="notes-button-container">
          <button
            className="notes-add-button"
            onClick={() => setAddingNote(true)}
          >
            {clientSide && status === "authenticated" && session
              ? "Add"
              : "Add"}
            <AiOutlinePlus />
          </button>
        </div>
      )}
      <div className="post-it-parent-container">
        {notes.map((note) => (
          <div key={note.id}>
            {clientSide && status === "authenticated" && session ? (
              <Link href={`/notes/${session.user.id}/${note.id}`}>
                <div className="post-it">
                  <h1>{note.title}</h1>
                  <p className="post-it-text">
                    {note.text.length > 100
                      ? `${note.text.slice(0, 100)}...`
                      : note.text}
                  </p>
                </div>
              </Link>
            ) : (
              <div>
                <h1 className="post-it-header">{note.title}</h1>
                <p className="post-it-text">
                  {note.text.length > 100
                    ? `${note.text.slice(0, 100)}...`
                    : note.text}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
