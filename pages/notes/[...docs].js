import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";

export default function NotePage() {
  const router = useRouter();
  const { docs } = router.query;

  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [editing, setEditing] = useState(false);
  const [updatedNote, setUpdatedNote] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");

  const fetchNote = async () => {
    const session = await getSession();
    const UID = session.user.id;
    const NID = docs[1];
    try {
      const response = await fetch(`/api/notes/${UID}/${NID}`);
      if (response.ok) {
        const data = await response.json();
        setNoteTitle(data.title);
        setNoteText(data.text);
      } else {
        console.error("Failed to fetch note");
      }
    } catch (error) {
      console.error("Error when fetching note:", error);
    }
  };

  const updateNote = async () => {
    const session = await getSession();
    const UID = session.user.id;
    const NID = docs[1];
    try {
      const response = await fetch(`/api/notes/${UID}/${NID}`, {
        method: "PUT",
        body: JSON.stringify({
          title: updatedTitle,
          text: updatedNote,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        fetchNote();
      }
    } catch (error) {
      console.error("Error when updateing", error);
    }
    setEditing(false);
  };

  const deleteNote = async () => {
    try {
      const session = await getSession();
      const UID = session.user.id;
      const NID = docs[1];
      const response = await fetch(`/api/notes/${UID}/${NID}`, {
        method: "DELETE",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.replace("/notes");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (Array.isArray(docs) && docs.length >= 2) {
      fetchNote();
    }
  }, [docs]);

  useEffect(() => {
    setUpdatedNote(noteText);
    setUpdatedTitle(noteTitle);
  }, [noteText, noteTitle]);

  const buttonStyling = {
    width: "100px",
    marginTop: "20px",
  };

  return (
    <div className="note-parent">
      {editing ? (
        <div>
          <input
            className="notes-title-form"
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            maxLength={30}
          />
          <textarea
            rows="25"
            className="notes-text-form"
            type="text"
            value={updatedNote}
            onChange={(e) => setUpdatedNote(e.target.value)}
            maxLength={2500}
          />
          <button className="notes-button" onClick={updateNote}>
            Save
          </button>
        </div>
      ) : (
        <div>
          <h2 className="note-title-style">{noteTitle}</h2>
          <p className="note-text-style">{noteText}</p>
          <hr/>
          <button
            style={buttonStyling}
            className="notes-button"
            onClick={() => setEditing(true)}
          >
            <BiSolidPencil />
          </button>
        </div>
      )}
      <button
        style={buttonStyling}
        className="notes-button"
        onClick={deleteNote}
      >
        <AiOutlineDelete />
      </button>
    </div>
  );
}
