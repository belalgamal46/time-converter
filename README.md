# Time Converter React App

A professional React application that converts time between 12-hour and 24-hour formats with real-time validation and a clean, responsive user interface.

## Features

- **Bidirectional Conversion**: Convert from 12-hour to 24-hour format and vice versa
- **Real-time Validation**: Instant feedback with clear error messages for invalid inputs
- **Current Time Display**: Get the current time in both formats with one click
- **Professional UI**: Modern design with Tailwind CSS and shadcn/ui components
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Visual Feedback**: Green checkmarks for valid inputs, red alerts for errors
- **Conversion Indicators**: Clear visual indication of conversion direction

## Usage

### Starting the Application

1. Navigate to the project directory:
   ```bash
   cd time-converter
   ```

2. Install dependencies (if not already installed):
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Using the Time Converter

#### Converting 12-Hour to 24-Hour Format
1. Enter a time in the 12-Hour field (e.g., "2:30 PM")
2. The 24-Hour field will automatically update with the converted time (e.g., "14:30")

#### Converting 24-Hour to 12-Hour Format
1. Enter a time in the 24-Hour field (e.g., "14:30")
2. The 12-Hour field will automatically update with the converted time (e.g., "2:30 PM")

#### Additional Features
- **Current Time**: Click the "Current Time" button to populate both fields with the current time
- **Clear All**: Click the "Clear All" button to reset both input fields

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

### Validation

The application provides real-time validation with:
- **Green checkmarks** for valid time formats
- **Red error messages** for invalid inputs
- **Red borders** around invalid input fields
- **Helpful format hints** in error messages

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

- `convert12To24(time12)` - Converts 12-hour format to 24-hour format
- `convert24To12(time24)` - Converts 24-hour format to 12-hour format
- `isValid12HourFormat(time12)` - Validates 12-hour format input
- `isValid24HourFormat(time24)` - Validates 24-hour format input
- `getCurrentTime()` - Gets current time in both formats

## Development

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

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

