import './ChatMessage.css';

export default function ChatMessage({ message }) {
  return (
    <div className={`msg ${message.from}`}>
      {message.typing ? (
        <span className="typing" aria-label="typing"><span /><span /><span /></span>
      ) : (
        message.content
      )}
    </div>
  );
}
