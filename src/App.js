import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/records";

function App() {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    vendorName: "",
    vendorType: "",
    productName: "",
    price: "",
    quantity: ""
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all records
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(API_URL);
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add or Update record
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
      }

      setFormData({
        vendorName: "",
        vendorType: "",
        productName: "",
        price: "",
        quantity: ""
      });

      fetchRecords();
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };

  // Edit record
  const handleEdit = (record) => {
    setFormData(record);
    setEditingId(record.id);
  };

  // Delete record
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchRecords();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Vendor Supplier Management</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="vendorName"
          placeholder="Vendor Name"
          value={formData.vendorName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="vendorType"
          placeholder="Vendor / Supplier"
          value={formData.vendorType}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <hr />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Vendor Name</th>
            <th>Type</th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.vendorName}</td>
              <td>{record.vendorType}</td>
              <td>{record.productName}</td>
              <td>{record.price}</td>
              <td>{record.quantity}</td>
              <td>
                <button onClick={() => handleEdit(record)}>Edit</button>
                <button onClick={() => handleDelete(record.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;