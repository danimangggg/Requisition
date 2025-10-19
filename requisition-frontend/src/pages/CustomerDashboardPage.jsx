import React from "react";
import { Typography, Paper } from "@mui/material";

export default function CustomerDashboard() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">Customer Dashboard</Typography>
      <Typography sx={{ mt: 2 }}>
        Welcome, valued customer! Here you can view and manage your requisitions.
      </Typography>
    </Paper>
  );
}
