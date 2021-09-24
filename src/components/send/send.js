const Send = ({ value, onChange, onSend }) => {
  return (
    <form className="input-group mb-3" onSubmit={onSend}>
      <input
        className="form-control"
        value={value}
        onChange={onChange}
        placeholder="Enter Your message"
      />
      <button className="btn btn-primary" type="submit">
        Send
      </button>
    </form>
  );
};

export default Send;
