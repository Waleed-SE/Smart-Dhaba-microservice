import React, { useState } from "react";
import axios from "axios";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/uploads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setMessage("Uploaded: " + res.data.file);
    } catch (err) {
      setMessage("Upload failed");
    }
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>File Upload (Admin)</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br />
      <button onClick={handleUpload} style={{ marginTop: "20px" }}>
        Upload
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadPage;
