import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Clock, ArrowRightLeft, CheckCircle, AlertCircle, CalendarClock } from 'lucide-react'
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
  // Single time conversion state
  const [time12, setTime12] = useState('')
  const [time24, setTime24] = useState('')
  const [error12, setError12] = useState('')
  const [error24, setError24] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  // Time range conversion state - separate fields for 12-hour
  const [startTime, setStartTime] = useState('')
  const [startPeriod, setStartPeriod] = useState('AM')
  const [endTime, setEndTime] = useState('')
  const [endPeriod, setEndPeriod] = useState('AM')
  
  // Time range conversion state - separate fields for 24-hour
  const [startTime24, setStartTime24] = useState('')
  const [endTime24, setEndTime24] = useState('')
  
  const [rangeError, setRangeError] = useState('')
  const [rangeError24, setRangeError24] = useState('')
  const [rangeLastUpdated, setRangeLastUpdated] = useState('')

  // Helper function to validate 12-hour time format (HH:MM)
  const isValidTimeFormat = (time) => {
    if (!time) return false
    const regex = /^(0?[1-9]|1[0-2]):([0-5][0-9])$/
    return regex.test(time.trim())
  }

  // Helper function to validate 24-hour time format (HH:MM)
  const isValid24HourTimeFormat = (time) => {
    if (!time) return false
    const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/
    return regex.test(time.trim())
  }

  // Helper function to convert separate fields to 12-hour format string
  const combineTimeFields = (time, period) => {
    if (!time || !period) return ''
    return `${time} ${period}`
  }

  // Helper function to convert separate 24-hour fields to range string
  const combine24HourFields = (startTime, endTime) => {
    if (!startTime || !endTime) return ''
    return `${startTime} to ${endTime}`
  }

  // Helper function to validate time range order for 12-hour format
  const isValidRangeOrder = (startTime, startPeriod, endTime, endPeriod) => {
    if (!startTime || !endTime || !startPeriod || !endPeriod) return true
    
    const start12 = combineTimeFields(startTime, startPeriod)
    const end12 = combineTimeFields(endTime, endPeriod)
    
    const start24 = convert12To24(start12)
    const end24 = convert12To24(end12)
    
    if (!start24 || !end24) return false
    
    const [startHour, startMin] = start24.split(':').map(Number)
    const [endHour, endMin] = end24.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    return endMinutes > startMinutes
  }

  // Helper function to validate time range order for 24-hour format
  const isValid24HourRangeOrder = (startTime, endTime) => {
    if (!startTime || !endTime) return true
    
    if (!isValid24HourTimeFormat(startTime) || !isValid24HourTimeFormat(endTime)) return false
    
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    return endMinutes > startMinutes
  }

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

  // Handle 12-hour time range field changes
  const handleRangeFieldChange = (field, value) => {
    let newStartTime = startTime
    let newStartPeriod = startPeriod
    let newEndTime = endTime
    let newEndPeriod = endPeriod

    switch (field) {
      case 'startTime':
        newStartTime = value
        setStartTime(value)
        break
      case 'startPeriod':
        newStartPeriod = value
        setStartPeriod(value)
        break
      case 'endTime':
        newEndTime = value
        setEndTime(value)
        break
      case 'endPeriod':
        newEndPeriod = value
        setEndPeriod(value)
        break
    }

    setRangeError('')
    setRangeLastUpdated('12')

    // Validate and convert if all fields are filled
    if (newStartTime && newStartPeriod && newEndTime && newEndPeriod) {
      // Validate time formats
      if (!isValidTimeFormat(newStartTime)) {
        setRangeError('Invalid start time format. Use HH:MM (e.g., 2:30)')
        setStartTime24('')
        setEndTime24('')
        return
      }
      
      if (!isValidTimeFormat(newEndTime)) {
        setRangeError('Invalid end time format. Use HH:MM (e.g., 3:30)')
        setStartTime24('')
        setEndTime24('')
        return
      }

      // Validate range order
      if (!isValidRangeOrder(newStartTime, newStartPeriod, newEndTime, newEndPeriod)) {
        setRangeError('End time must be after start time')
        setStartTime24('')
        setEndTime24('')
        return
      }

      // Convert to 24-hour format
      const start12 = combineTimeFields(newStartTime, newStartPeriod)
      const end12 = combineTimeFields(newEndTime, newEndPeriod)
      
      const start24 = convert12To24(start12)
      const end24 = convert12To24(end12)
      
      if (start24 && end24) {
        setStartTime24(start24)
        setEndTime24(end24)
      } else {
        setRangeError('Invalid time format')
        setStartTime24('')
        setEndTime24('')
      }
    } else {
      setStartTime24('')
      setEndTime24('')
    }
  }

  // Handle 24-hour time range field changes
  const handle24HourRangeFieldChange = (field, value) => {
    let newStartTime24 = startTime24
    let newEndTime24 = endTime24

    switch (field) {
      case 'startTime24':
        newStartTime24 = value
        setStartTime24(value)
        break
      case 'endTime24':
        newEndTime24 = value
        setEndTime24(value)
        break
    }

    setRangeError24('')
    setRangeLastUpdated('24')

    // Validate and convert if both fields are filled
    if (newStartTime24 && newEndTime24) {
      // Validate time formats
      if (!isValid24HourTimeFormat(newStartTime24)) {
        setRangeError24('Invalid start time format. Use HH:MM (e.g., 14:30)')
        setStartTime('')
        setStartPeriod('AM')
        setEndTime('')
        setEndPeriod('AM')
        return
      }
      
      if (!isValid24HourTimeFormat(newEndTime24)) {
        setRangeError24('Invalid end time format. Use HH:MM (e.g., 15:30)')
        setStartTime('')
        setStartPeriod('AM')
        setEndTime('')
        setEndPeriod('AM')
        return
      }

      // Validate range order
      if (!isValid24HourRangeOrder(newStartTime24, newEndTime24)) {
        setRangeError24('End time must be after start time')
        setStartTime('')
        setStartPeriod('AM')
        setEndTime('')
        setEndPeriod('AM')
        return
      }

      // Convert to 12-hour format
      const start12 = convert24To12(newStartTime24)
      const end12 = convert24To12(newEndTime24)
      
      if (start12 && end12) {
        // Parse start time
        const startMatch = start12.match(/^(\d{1,2}:\d{2})\s+(AM|PM)$/)
        if (startMatch) {
          setStartTime(startMatch[1])
          setStartPeriod(startMatch[2])
        }
        
        // Parse end time
        const endMatch = end12.match(/^(\d{1,2}:\d{2})\s+(AM|PM)$/)
        if (endMatch) {
          setEndTime(endMatch[1])
          setEndPeriod(endMatch[2])
        }
      } else {
        setRangeError24('Invalid time format')
        setStartTime('')
        setStartPeriod('AM')
        setEndTime('')
        setEndPeriod('AM')
      }
    } else {
      setStartTime('')
      setStartPeriod('AM')
      setEndTime('')
      setEndPeriod('AM')
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

  // Clear all range inputs
  const clearAllRanges = () => {
    setStartTime('')
    setStartPeriod('AM')
    setEndTime('')
    setEndPeriod('AM')
    setStartTime24('')
    setEndTime24('')
    setRangeError('')
    setRangeError24('')
    setRangeLastUpdated('')
  }

  // Validation status indicators
  const is12Valid = time12 === '' || (isValid12HourFormat(formatTimeInput(time12, '12')) && !error12)
  const is24Valid = time24 === '' || (isValid24HourFormat(time24) && !error24)
  const isRangeValid = !rangeError && (startTime === '' || isValidTimeFormat(startTime)) && (endTime === '' || isValidTimeFormat(endTime))
  const isRange24Valid = !rangeError24 && (startTime24 === '' || isValid24HourTimeFormat(startTime24)) && (endTime24 === '' || isValid24HourTimeFormat(endTime24))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-5xl mx-auto">
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

        {/* Main Content with Tabs */}
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Single Time
            </TabsTrigger>
            <TabsTrigger value="range" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              Time Range
            </TabsTrigger>
          </TabsList>

          {/* Single Time Conversion Tab */}
          <TabsContent value="single" className="space-y-8">
            {/* Main Converter */}
            <div className="grid md:grid-cols-2 gap-6">
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
              <div className="flex justify-center">
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
            <div className="flex flex-wrap justify-center gap-4">
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
          </TabsContent>

          {/* Time Range Conversion Tab */}
          <TabsContent value="range" className="space-y-8">
            {/* Range Converter */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 12-Hour Range Format with Separate Fields */}
              <Card className="transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">12-Hour Range</Badge>
                    {isRangeValid && (startTime || endTime) && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {rangeError && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </CardTitle>
                  <CardDescription>
                    Enter start and end times with AM/PM
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Start Time */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Start Time
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="2:30"
                        value={startTime}
                        onChange={(e) => handleRangeFieldChange('startTime', e.target.value)}
                        className={`flex-1 ${rangeError ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                      <Select value={startPeriod} onValueChange={(value) => handleRangeFieldChange('startPeriod', value)}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      End Time
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="3:30"
                        value={endTime}
                        onChange={(e) => handleRangeFieldChange('endTime', e.target.value)}
                        className={`flex-1 ${rangeError ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                      <Select value={endPeriod} onValueChange={(value) => handleRangeFieldChange('endPeriod', value)}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {rangeError && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {rangeError}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* 24-Hour Range Format with Separate Fields */}
              <Card className="transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">24-Hour Range</Badge>
                    {isRange24Valid && (startTime24 || endTime24) && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {rangeError24 && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </CardTitle>
                  <CardDescription>
                    Military/International time range (e.g., 14:30 to 15:30)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Start Time 24-Hour */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Start Time
                    </label>
                    <Input
                      type="text"
                      placeholder="14:30"
                      value={startTime24}
                      onChange={(e) => handle24HourRangeFieldChange('startTime24', e.target.value)}
                      className={`${rangeError24 ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>

                  {/* End Time 24-Hour */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      End Time
                    </label>
                    <Input
                      type="text"
                      placeholder="15:30"
                      value={endTime24}
                      onChange={(e) => handle24HourRangeFieldChange('endTime24', e.target.value)}
                      className={`${rangeError24 ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>

                  {rangeError24 && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {rangeError24}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Range Conversion Indicator */}
            {((startTime && endTime) || (startTime24 && endTime24)) && (
              <div className="flex justify-center">
                <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-md">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {rangeLastUpdated === '12' ? '12-Hour Range' : '24-Hour Range'}
                  </span>
                  <ArrowRightLeft className="h-4 w-4 text-blue-500 animate-pulse" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {rangeLastUpdated === '12' ? '24-Hour Range' : '12-Hour Range'}
                  </span>
                </div>
              </div>
            )}

            {/* Range Action Button */}
            <div className="flex justify-center">
              <Button 
                onClick={clearAllRanges}
                variant="outline"
                className="flex items-center gap-2"
              >
                Clear All Ranges
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Examples & Tips */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-xl">Examples & Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">Single Time Examples:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• <strong>12:00 AM</strong> → <strong>00:00</strong> (midnight)</li>
                  <li>• <strong>6:30 AM</strong> → <strong>06:30</strong></li>
                  <li>• <strong>12:00 PM</strong> → <strong>12:00</strong> (noon)</li>
                  <li>• <strong>11:45 PM</strong> → <strong>23:45</strong></li>
                </ul>

                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 mt-6">Time Range Examples:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Start: <strong>9:00 AM</strong>, End: <strong>5:00 PM</strong> → <strong>09:00 to 17:00</strong></li>
                  <li>• Start: <strong>2:30 PM</strong>, End: <strong>3:30 PM</strong> → <strong>14:30 to 15:30</strong></li>
                  <li>• Start: <strong>11:00 PM</strong>, End: <strong>11:59 PM</strong> → <strong>23:00 to 23:59</strong></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">Format Guidelines:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Use separate fields for start and end times</li>
                  <li>• Select AM/PM from dropdown for 12-hour format</li>
                  <li>• Use 24-hour format for precision (no AM/PM needed)</li>
                  <li>• End time must be after start time</li>
                </ul>

                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 mt-6">Time Format:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Use <strong>HH:MM</strong> format (e.g., 2:30, 10:15)</li>
                  <li>• Hours: 1-12 for 12-hour format</li>
                  <li>• Hours: 00-23 for 24-hour format</li>
                  <li>• Minutes: 00-59</li>
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

