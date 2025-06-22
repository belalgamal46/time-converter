# Time Converter React App

A professional React application that converts time between 12-hour and 24-hour formats with real-time validation and a clean, responsive user interface.

## Features

- **Bidirectional Conversion**: Convert from 12-hour to 24-hour format and vice versa
- **Time Range Conversion**: Convert time ranges with separate input fields for both formats
- **Separate Input Fields**: Dedicated fields for both 12-hour and 24-hour time range input
  - 12-hour: start time, start AM/PM, end time, end AM/PM
  - 24-hour: start time, end time (no AM/PM needed)
- **Real-time Validation**: Instant feedback with clear error messages for invalid inputs
- **Range Validation**: Ensures end time is after start time in time ranges
- **Current Time Display**: Get the current time in both formats with one click
- **Tabbed Interface**: Separate tabs for single time and time range conversion
- **Professional UI**: Modern design with Tailwind CSS and shadcn/ui components
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Visual Feedback**: Green checkmarks for valid inputs, red alerts for errors
- **Conversion Indicators**: Clear visual indication of conversion direction
- **Clean 24-Hour Design**: No AM/PM selectors for 24-hour format, adhering to military time conventions

## Usage

### Starting the Application

1. Navigate to the project directory:
   ```bash
   cd time-converter
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Using the Time Converter

The application features two main modes accessible via tabs:

#### Single Time Conversion
1. Click the "Single Time" tab
2. **Converting 12-Hour to 24-Hour Format**: Enter a time in the 12-Hour field (e.g., "2:30 PM") and the 24-Hour field will automatically update (e.g., "14:30")
3. **Converting 24-Hour to 12-Hour Format**: Enter a time in the 24-Hour field (e.g., "14:30") and the 12-Hour field will automatically update (e.g., "2:30 PM")
4. **Current Time**: Click the "Current Time" button to populate both fields with the current time
5. **Clear All**: Click the "Clear All" button to reset both input fields

#### Time Range Conversion
1. Click the "Time Range" tab
2. **Converting 12-Hour Range to 24-Hour Range**: 
   - Enter start time in the "Start Time" field (e.g., "2:30")
   - Select AM/PM from the dropdown next to start time
   - Enter end time in the "End Time" field (e.g., "3:30")
   - Select AM/PM from the dropdown next to end time
   - The 24-Hour Range field will automatically update (e.g., "14:30 to 15:30")
3. **Converting 24-Hour Range to 12-Hour Range**: Enter a time range in the 24-Hour Range field (e.g., "09:00 to 17:00") and the separate 12-hour fields will automatically populate
4. **Clear All Ranges**: Click the "Clear All Ranges" button to reset all range input fields

### Input Formats

#### 12-Hour Format
- **Valid examples**: 
  - 12:00 AM (midnight)
  - 6:30 AM
  - 12:00 PM (noon)
  - 11:45 PM
- **Format**: HH:MM AM/PM
- **Notes**: AM/PM is required, hours can be 1-12

#### 24-Hour Format
- **Valid examples**:
  - 00:00 (midnight)
  - 06:30
  - 12:00 (noon)
  - 23:45
- **Format**: HH:MM
- **Notes**: Hours range from 00-23, minutes from 00-59

#### Time Range Formats
- **12-Hour Range Examples**:
  - 9:00 AM to 5:00 PM
  - 2:30 PM to 3:30 PM
  - 11:00 PM to 11:59 PM
- **24-Hour Range Examples**:
  - 09:00 to 17:00
  - 14:30 to 15:30
  - 23:00 to 23:59
- **Supported Separators**: "to" (recommended), "-", "–", "—"
- **Notes**: End time must be after start time

### Validation

The application provides real-time validation with:
- **Green checkmarks** for valid time and time range formats
- **Red error messages** for invalid inputs
- **Red borders** around invalid input fields
- **Helpful format hints** in error messages
- **Time range validation** ensuring end time is after start time
- **Separator normalization** for time ranges (converts dashes to "to")

## Technical Details

### Built With
- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icons

### Project Structure
```
time-converter/
├── src/
│   ├── components/ui/     # shadcn/ui components
│   ├── lib/
│   │   └── timeUtils.js   # Time conversion utilities
│   ├── App.jsx           # Main application component
│   ├── App.css           # Application styles
│   └── main.jsx          # Application entry point
├── public/               # Static assets
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

### Key Functions

The application includes robust utility functions for time conversion:

**Single Time Conversion:**
- `convert12To24(time12)` - Converts 12-hour format to 24-hour format
- `convert24To12(time24)` - Converts 24-hour format to 12-hour format
- `isValid12HourFormat(time12)` - Validates 12-hour format input
- `isValid24HourFormat(time24)` - Validates 24-hour format input
- `getCurrentTime()` - Gets current time in both formats

**Time Range Conversion:**
- `convertTimeRange12To24(timeRange12)` - Converts 12-hour time range to 24-hour format
- `convertTimeRange24To12(timeRange24)` - Converts 24-hour time range to 12-hour format
- `isValidTimeRange12(timeRange12)` - Validates 12-hour time range input
- `isValidTimeRange24(timeRange24)` - Validates 24-hour time range input
- `isValidTimeRangeOrder(timeRange)` - Validates that end time is after start time
- `parseTimeRange(timeRange)` - Parses time range string into start and end times
- `formatTimeRangeInput(input, format)` - Formats and normalizes time range input

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Customization

The application uses Tailwind CSS for styling, making it easy to customize:
- Colors and themes are defined in `src/App.css`
- Component styles use Tailwind utility classes
- Responsive design is built-in with Tailwind's responsive utilities

## Browser Support

The application works in all modern browsers including:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is open source and available under the MIT License.

