import React from "react";
import { Typography, Paper } from "@mui/material";

export default function EmployeeDashboard() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">Employee Dashboard</Typography>
      <Typography sx={{ mt: 2 }}>
        Welcome, employee! Here you can process and approve requisitions.
      </Typography>
    </Paper>
  );
}
