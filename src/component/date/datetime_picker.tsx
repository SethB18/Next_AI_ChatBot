'use client';
import { Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function Date_TimePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <DateTimePicker label="Basic date time picker" />
      </Box>
    </LocalizationProvider>
  );
}