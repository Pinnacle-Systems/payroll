import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { TextField, Box } from "@mui/material";

export default function LeaveRangePicker({ value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangePicker
        value={value}
        onChange={onChange}
        disablePast
        renderInput={(startProps, endProps) => (
          <>
            <TextField {...startProps} size="small" />
            <Box sx={{ mx: 2 }}>to</Box>
            <TextField {...endProps} size="small" />
          </>
        )}
      />
    </LocalizationProvider>
  );
}
