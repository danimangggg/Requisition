import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress } from "@mui/material";

const ImportPharmaceuticals = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setData([]);
  };

  const handleImport = () => {
    if (!file) {
      setMessage("Please select an Excel file first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws);

      let filteredData = jsonData.map((row) => ({
        material: row["Material"],
        material_description: row["Material Description"] || "",
      }));

      // Remove duplicates within the file
      const uniqueData = Array.from(
        new Map(
          filteredData.map((item) => [
            item.material + "|" + item.material_description,
            item,
          ])
        ).values()
      );

      setData(uniqueData);
      setMessage(`${uniqueData.length} unique rows imported`);
    };
    reader.readAsBinaryString(file);
  };

  const handleSave = async () => {
    if (data.length === 0) {
      setMessage("No data to save. Import Excel first.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/api/pharmaceuticals/bulk", data);
      setMessage(res.data.message || "Data saved successfully!");
      setData([]);
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Error saving data. There might not be new records");
    }
    setLoading(false);
  };

  return (
    <Paper elevation={6} sx={{ p: 4, maxWidth: 800, margin: "50px auto" }}>
      <Typography variant="h4" gutterBottom>Import Pharmaceuticals</Typography>
      
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        style={{ marginBottom: 20 }}
      />
      <Button variant="contained" color="primary" onClick={handleImport} sx={{ ml: 2 }}>
        Import
      </Button>

      {loading && <LinearProgress sx={{ mt: 2, mb: 2 }} />}

      {data.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Material</strong></TableCell>
                <TableCell><strong>Material Description</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.material}</TableCell>
                  <TableCell>{row.material_description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {data.length > 0 && (
        <Button
          variant="contained"
          color="success"
          onClick={handleSave}
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save to Database"}
        </Button>
      )}

      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Paper>
  );
};

export default ImportPharmaceuticals;
