import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import axios from "axios";

const CustomerRequisition = () => {
  const [pharmaList, setPharmaList] = useState([]);
  const [requests, setRequests] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // ✅ Fetch pharmaceuticals
  useEffect(() => {
    const fetchPharma = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3001/api/pharmaceuticals");
        setPharmaList(res.data);
      } catch (err) {
        console.error("Failed to fetch pharmaceuticals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPharma();
  }, []);

  // ✅ Handle input change
  const handleChange = (id, value) => {
    setRequests((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ✅ Handle submit
  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage("");

    try {
      const filled = Object.entries(requests)
        .filter(([_, amount]) => amount && parseInt(amount) > 0)
        .map(([pharmaceutical_id, request_amount]) => ({
          pharmaceutical_id,
          request_amount: parseInt(request_amount),
        }));

      if (filled.length === 0) {
        setMessage("Please enter at least one requested amount.");
        setSubmitting(false);
        return;
      }

      await Promise.all(
        filled.map((item) =>
          axios.post("http://localhost:3001/api/requisitions", item)
        )
      );

      setMessage("✅ Requisition submitted successfully!");
      setRequests({});
    } catch (err) {
      console.error("Error submitting requisition:", err);
      setMessage("❌ Failed to submit requisition");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Search filter
  const filteredPharma = pharmaList.filter(
    (item) =>
      item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.material_description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // ✅ Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const paginatedData = filteredPharma.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        🧾 Customer Requisition
      </Typography>

      {/* Search box */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search material..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300, backgroundColor: "white", borderRadius: 2 }}
        />
      </Box>

      {/* Table */}
      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Material</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Material Description</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Request Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((pharma) => (
                <TableRow key={pharma.id}>
                  <TableCell>{pharma.material}</TableCell>
                  <TableCell>{pharma.material_description}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      variant="outlined"
                      value={requests[pharma.id] || ""}
                      onChange={(e) => handleChange(pharma.id, e.target.value)}
                      placeholder="Enter amount"
                      sx={{ width: "130px" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination controls */}
        <TablePagination
          component="div"
          count={filteredPharma.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ backgroundColor: "#f9f9f9" }}
        />
      </Paper>

      {/* Submit button */}
      <Box mt={3} display="flex" justifyContent="flex-end" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{
            borderRadius: "12px",
            px: 3,
            py: 1,
            textTransform: "none",
            boxShadow: 2,
          }}
        >
          {submitting ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Submit Requisition"
          )}
        </Button>
      </Box>

      {message && (
        <Typography mt={2} color={message.startsWith("✅") ? "green" : "red"}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default CustomerRequisition;
