import './message.css';

const Message = ({ item, currentUser }) => {
  const classMessage =
    item.user === currentUser ? 'alert alert-primary' : 'alert alert-dark';
  const classContainer =
    item.user === currentUser ? 'message-primary' : 'message-dark';
  return (
    <div className={classContainer}>
      <span className={classMessage}>
        {item.user}: {item.text}
      </span>
    </div>
  );
};

export default Message;
