import LeaveRangePicker from "./LeaveRangePicker";

const [dateRange, setDateRange] = useState([null, null]);

<LeaveRangePicker
  value={dateRange}
  onChange={(newValue) => setDateRange(newValue)}
/>
