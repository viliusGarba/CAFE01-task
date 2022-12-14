import React, { useState } from "react";
import { Header } from "./Header";
import { AttendeeCreator } from "./AttendeeCreator";
import { AttendeeList } from "./AttendeeList";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import uuid from "react-uuid";

export function Dashboard() {
  const { user } = useContext(UserContext);

  const [attendees, setAttendees] = useState([]);
  const [newAttendee, setNewAttendee] = useState({
    attendeeId: uuid(),
    userId: user.userId,
    firstName: "",
    lastName: "",
    age: "",
    email: "",
  });
  const [editedAttendeeId, setEditedAttendeeId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    attendeeId: "",
    userId: "",
    firstName: "",
    lastName: "",
    age: "",
    email: "",
  });

  useEffect(() => {
    const fetchAttendees = async () => {
      const response = await fetch(
        `http://localhost:3005/${user.userId}/attendees`
      );
      const data = await response.json();
      setAttendees([...data]);
    };
    fetchAttendees();
  }, [user.userId]);

  const handleCreateFormInputChange = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;

    setNewAttendee({ ...newAttendee, [inputName]: inputValue });
  };

  const handleCreateFormSubmit = async (e) => {
    e.preventDefault();

    setAttendees([...attendees, newAttendee]);

    const postNewUser = async () => {
      await fetch(`http://localhost:3005/${user.userId}/attendees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAttendee),
      });
    };
    postNewUser();

    setNewAttendee({
      attendeeId: uuid(),
      userId: user.userId,
      firstName: "",
      lastName: "",
      age: "",
      email: "",
    });
  };

  const handleEditBtn = (editedAttendee) => {
    setEditedAttendeeId(editedAttendee.attendeeId);
    setEditFormData({ ...editedAttendee });
  };

  const handleEditInputChange = (e) => {
    const editInputName = e.target.name;
    const editInputValue = e.target.value;

    setEditFormData({ ...editFormData, [editInputName]: editInputValue });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const newAttendees = [...attendees];
    const index = attendees.findIndex(
      (attendee) => attendee.attendeeId === editFormData.attendeeId
    );

    newAttendees[index] = { ...editFormData };

    setAttendees(newAttendees);

    await fetch(`http://localhost:3005/attendees/${editedAttendeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editFormData),
    });

    setEditedAttendeeId(null);
  };

  const handleDeleteBtn = async (attendeeId) => {
    const filteredAttendees = attendees.filter(
      (attendee) => attendee.attendeeId !== attendeeId
    );
    setAttendees(filteredAttendees);

    await fetch(`http://localhost:3005/attendees/${attendeeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleCancelBtn = () => {
    setEditedAttendeeId(null);
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard__body">
        <AttendeeCreator
          newAttendee={newAttendee}
          handleCreateFormInputChange={handleCreateFormInputChange}
          handleCreateFormSubmit={handleCreateFormSubmit}
        />
        {attendees.length > 0 ? (
          <AttendeeList
            attendees={attendees}
            editedAttendeeId={editedAttendeeId}
            editFormData={editFormData}
            handleDeleteBtn={handleDeleteBtn}
            handleCancelBtn={handleCancelBtn}
            handleEditBtn={handleEditBtn}
            handleEditInputChange={handleEditInputChange}
            handleEditSubmit={handleEditSubmit}
          />
        ) : (
          <div className="dashboard__noAttendees">
            <h3>Add an attendee to display guest info</h3>
          </div>
        )}
      </div>
    </div>
  );
}
