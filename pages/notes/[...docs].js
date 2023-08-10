import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

export default function NotePage() {
  const router = useRouter();
  const { docs } = router.query;

  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");

  const fetchNote = async () => {
    const session = await getSession();
    const UID = session.user.id;
    const NID = docs[1];
    try {
      const response = await fetch(`/api/notes/${UID}/${NID}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setNoteTitle(data.title);
        setNoteText(data.text);
      } else {
        console.error("Failed to fetch note");
      }
    } catch (error) {
      console.error("Error when fetching note:", error);
    }
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
      
      if(response.ok) {
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

  return (
    <>
      <h1>Testing</h1>
      <h2>{noteTitle}</h2>
      <p>{noteText}</p>
      <button onClick={deleteNote}>Delete</button>
    </>
  );
}
