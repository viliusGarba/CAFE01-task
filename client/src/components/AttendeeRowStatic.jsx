import Button from "react-bootstrap/Button";

export function AttendeeRowStatic(props) {
  return (
    <tr>
      <td>{props.i + 1}.</td>
      <td>
        {props.attendee.firstName} {props.attendee.lastName}
      </td>
      <td>{props.attendee.age}</td>
      <td>{props.attendee.email}</td>
      <td className="doubleRows__button">
        <Button
          variant="primary"
          onClick={() => props.handleEditBtn(props.attendee)}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => props.handleDeleteBtn(props.attendee.attendeeId)}
        >
          Del
        </Button>
      </td>
    </tr>
  );
}
