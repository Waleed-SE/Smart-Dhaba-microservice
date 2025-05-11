import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

const ManageFiles = () => {
  const [files, setFiles] = useState([]);
  const [renameMap, setRenameMap] = useState({});

  const fetchFiles = async () => {
    const res = await axios.get(`${API_URL}/uploads`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFiles(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/uploads/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchFiles();
  };

  const handleRename = async (id) => {
    const newName = renameMap[id];
    if (!newName) return;
    await axios.put(
      `${API_URL}/uploads/${id}`,
      { originalname: newName },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setRenameMap((prev) => ({ ...prev, [id]: "" }));
    fetchFiles();
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Uploaded Files</h2>
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", textAlign: "left" }}
      >
        <thead>
          <tr>
            <th>Original Name</th>
            <th>Type</th>
            <th>Size (KB)</th>
            <th>Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file._id}>
              <td>{file.originalname}</td>
              <td>{file.mimetype}</td>
              <td>{(file.size / 1024).toFixed(2)}</td>
              <td>{new Date(file.createdAt).toLocaleString()}</td>
              <td>
                <input
                  type="text"
                  placeholder="New name"
                  value={renameMap[file._id] || ""}
                  onChange={(e) =>
                    setRenameMap((prev) => ({
                      ...prev,
                      [file._id]: e.target.value,
                    }))
                  }
                  style={{ marginRight: "5px" }}
                />
                <button onClick={() => handleRename(file._id)}>Rename</button>
                <button
                  onClick={() => handleDelete(file._id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageFiles;
