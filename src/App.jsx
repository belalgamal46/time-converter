import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Clock, ArrowRightLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { 
  convert12To24, 
  convert24To12, 
  isValid12HourFormat, 
  isValid24HourFormat,
  getCurrentTime,
  formatTimeInput
} from './lib/timeUtils.js'
import './App.css'

function App() {
  const [time12, setTime12] = useState('')
  const [time24, setTime24] = useState('')
  const [error12, setError12] = useState('')
  const [error24, setError24] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  // Handle 12-hour format input
  const handle12HourChange = (value) => {
    setTime12(value)
    setError12('')
    setLastUpdated('12')
    
    if (value.trim() === '') {
      setTime24('')
      return
    }

    const formatted = formatTimeInput(value, '12')
    if (isValid12HourFormat(formatted)) {
      const converted = convert12To24(formatted)
      if (converted) {
        setTime24(converted)
      } else {
        setError12('Invalid time format')
      }
    } else if (value.length > 3) {
      setError12('Use format: HH:MM AM/PM (e.g., 2:30 PM)')
    }
  }

  // Handle 24-hour format input
  const handle24HourChange = (value) => {
    setTime24(value)
    setError24('')
    setLastUpdated('24')
    
    if (value.trim() === '') {
      setTime12('')
      return
    }

    if (isValid24HourFormat(value)) {
      const converted = convert24To12(value)
      if (converted) {
        setTime12(converted)
      } else {
        setError24('Invalid time format')
      }
    } else if (value.length > 2) {
      setError24('Use format: HH:MM (e.g., 14:30)')
    }
  }

  // Set current time
  const setCurrentTime = () => {
    const current = getCurrentTime()
    setTime12(current.time12)
    setTime24(current.time24)
    setError12('')
    setError24('')
    setLastUpdated('current')
  }

  // Clear all inputs
  const clearAll = () => {
    setTime12('')
    setTime24('')
    setError12('')
    setError24('')
    setLastUpdated('')
  }

  // Validation status indicators
  const is12Valid = time12 === '' || (isValid12HourFormat(formatTimeInput(time12, '12')) && !error12)
  const is24Valid = time24 === '' || (isValid24HourFormat(time24) && !error24)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Time Converter
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Convert between 12-hour and 24-hour time formats instantly
          </p>
        </div>

        {/* Main Converter */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 12-Hour Format */}
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">12-Hour</Badge>
                {is12Valid && time12 && <CheckCircle className="h-4 w-4 text-green-500" />}
                {error12 && <AlertCircle className="h-4 w-4 text-red-500" />}
              </CardTitle>
              <CardDescription>
                Standard format with AM/PM (e.g., 2:30 PM)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Enter time (e.g., 2:30 PM)"
                value={time12}
                onChange={(e) => handle12HourChange(e.target.value)}
                className={`text-lg ${error12 ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {error12 && (
                <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {error12}
                </p>
              )}
            </CardContent>
          </Card>

          {/* 24-Hour Format */}
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">24-Hour</Badge>
                {is24Valid && time24 && <CheckCircle className="h-4 w-4 text-green-500" />}
                {error24 && <AlertCircle className="h-4 w-4 text-red-500" />}
              </CardTitle>
              <CardDescription>
                Military/International format (e.g., 14:30)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Enter time (e.g., 14:30)"
                value={time24}
                onChange={(e) => handle24HourChange(e.target.value)}
                className={`text-lg ${error24 ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {error24 && (
                <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {error24}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Conversion Indicator */}
        {(time12 || time24) && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-md">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {lastUpdated === '12' ? '12-Hour' : lastUpdated === '24' ? '24-Hour' : 'Current Time'}
              </span>
              <ArrowRightLeft className="h-4 w-4 text-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {lastUpdated === '12' ? '24-Hour' : lastUpdated === '24' ? '12-Hour' : 'Both Formats'}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button 
            onClick={setCurrentTime}
            className="flex items-center gap-2"
            variant="default"
          >
            <Clock className="h-4 w-4" />
            Current Time
          </Button>
          <Button 
            onClick={clearAll}
            variant="outline"
            className="flex items-center gap-2"
          >
            Clear All
          </Button>
        </div>

        {/* Examples and Help */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              Examples & Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  12-Hour Format Examples:
                </h4>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>• 12:00 AM (midnight)</li>
                  <li>• 6:30 AM</li>
                  <li>• 12:00 PM (noon)</li>
                  <li>• 11:45 PM</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  24-Hour Format Examples:
                </h4>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>• 00:00 (midnight)</li>
                  <li>• 06:30</li>
                  <li>• 12:00 (noon)</li>
                  <li>• 23:45</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

