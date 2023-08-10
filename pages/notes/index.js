import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Notes() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [clientSide, setClientSide] = useState(false);

  useEffect(() => {
    // Set clientSide to true after initial rendering
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
      <h1>This is a test to see if this works</h1>
      <hr />
      <input
        id="title-input"
        type="text"
        placeholder="Add title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={50}
      />
      <input
        id="note-input"
        type="text"
        placeholder="Add note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={1000}
      />
      <button onClick={handleCreate}>Click to submit</button>
      <div>
        {notes.map((note) => (
          <div key={note.id}>
            {clientSide && status === "authenticated" && session ? (
              <Link href={`/notes/${session.user.id}/${note.id}`}>
                <h2>{note.title}</h2>
                <p>{note.text}</p>
              </Link>
            ) : (
              <div>
                <h2>{note.title}</h2>
                <p>{note.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

