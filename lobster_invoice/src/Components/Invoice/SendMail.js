import LobsterApi from "../../API/api";

import { useState } from "react";

const SendMail = ({
  showModal,
  handleClose,
  id,
  invoiceId,
  msg,
  clientEmail,
}) => {
  const [recipient, setRecipient] = useState(clientEmail);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  // send Email with Twillio Send Grid Mail
  const handleSend = async (e) => {
    // Perform send email logic here
    e.preventDefault();
    msg.subject = subject || "INVCR Invoice Incoming";
    msg.to = recipient || false;
    msg.html = message + "<br />" + msg.html;
    if (!msg.to) {
      return;
    }
    await LobsterApi.send(id, invoiceId, msg);
    handleClose();
  };

  const handleChangeRecipient = (e) => {
    e.preventDefault();
    setRecipient(e.target.value);
  };
  const handleChangeSubject = async (e) => {
    e.preventDefault();
    setSubject(e.target.value);
  };

  const handleChangeMessage = async (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  return (
    <div>
      {showModal && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Email</h5>
                <button
                  type="button"
                  className="close btn btn-danger"
                  onClick={handleClose}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="recipient">Recipient</label>
                    <input
                      type="email"
                      className="form-control"
                      id="recipient"
                      name="recipient"
                      placeholder="Enter recipient email"
                      onChange={handleChangeRecipient}
                      value={recipient}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      placeholder="Enter email subject"
                      onChange={handleChangeSubject}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      className="form-control"
                      id="message"
                      rows="5"
                      placeholder="Enter email message"
                      onChange={handleChangeMessage}
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleClose}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSend}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendMail;
