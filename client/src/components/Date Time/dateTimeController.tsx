import { useState, useEffect, useRef } from 'react';
import DateTime from './dateTime';
import swh from '@/assets/sw_helper';
import { useSEngine } from '@/context/SEngineContext';
import Moment from 'moment';

export default function DateTimeController() {
	const { engine } = useSEngine();
	let d = Moment().toDate();
	const [dateTime, setDateTime] = useState<Date>(d);
	const [dateSlider, setDateSlider] = useState<number>(50);
	const [timeSlider, setTimeSlider] = useState<number>(50);
	const [isRunning, setIsRunning] = useState(true);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	//This will run on initialisation
	//1. Sets the slider to correct position
	//2. Sets the Location [Need to fix, currently running before MapView.tsx]
	//3. Updates the core.observer.utc time to Current Time.

	useEffect(() => {
		if (!engine) return;

		//Time slider Logic
		//Calculate date slider position based on day of year
		const start = new Date(d.getFullYear(), 0, 0);
		const diff = d.getTime() - start.getTime();
		const oneDay = 24 * 60 * 60 * 1000;
		const dayOfYear = Math.floor(diff / oneDay);
		const daysInYear = 365.25;
		// Set date slider based on day of year percentage
		const datePercentage = (dayOfYear / daysInYear) * 100;
		setDateSlider(datePercentage);
		// Calculate time slider position based on time of day
		const midnight = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
		const msInDay = 24 * 60 * 60 * 1000;
		const msFromMidnight = d.getTime() - midnight.getTime();
		const timePercentage = (msFromMidnight / msInDay) * 100;
		setTimeSlider(timePercentage);

		//This is running before MapView is so it's not correctly in the location
		swh.setObserverLocation(engine, 146.8534, -29.958);

		const m = Moment(d).local();
		const newDate = m.local().toDate();
		setDateTime(newDate);
		engine.core.observer.utc = newDate.getMJD();
	}, [engine]);

	// //Updates the clock every 1 second
	useEffect(() => {
		if (!isRunning) return;

		const interval = setInterval(() => {
			setDateTime((prevDateTime) => {
				const newTime = new Date(prevDateTime.getTime() + 1000);
				engine.core.observer.utc = newTime.getMJD();
				return newTime;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [isRunning, engine]);

	// Configuration for date slider (day of year)
	const dateSliderConfig = {
		defaultValue: [dateSlider],
		min: 0,
		max: 100,
		step: 1,
		onValueChange: (value: number) => handleDateSlider(value),
	};

	// Configuration for time slider (time of day)
	const timeSliderConfig = {
		defaultValue: [timeSlider],
		min: 0,
		max: 100,
		step: 1,
		onValueChange: (value: number) => handleTimeSlider(value),
	};

	function geoIP() {}

	// Handler for the date slider
	function handleDateSlider(n: number) {
		setIsRunning(false);

		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setIsRunning(true);
		}, 2000);

		// Update date slider state
		setDateSlider(n);

		// Get current time of day (hours, minutes, seconds, milliseconds)
		const hours = dateTime.getHours();
		const minutes = dateTime.getMinutes();
		const seconds = dateTime.getSeconds();
		const ms = dateTime.getMilliseconds();

		// Calculate the number of days in a year (approximate)
		const daysInYear = 365.25;

		// Calculate the day of the year based on the slider percentage (0-100)
		const dayOfYear = Math.floor((n / 100) * daysInYear);

		// Create a new Date object for the selected day in current year
		const newDateTime = new Date(
			dateTime.getFullYear(),
			0,
			1 + dayOfYear,
			hours,
			minutes,
			seconds,
			ms,
		);

		console.log(`Date Slider ${n}% -> Day of year: ${dayOfYear} -> ${newDateTime.toISOString()}`);

		// Set the date and time
		engine.core.observer.utc = newDateTime.getMJD();
	}

	// Handler for the time slider
	function handleTimeSlider(n: number) {
		setIsRunning(false);

		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setIsRunning(true);
		}, 2000);

		// Update time slider state
		setTimeSlider(n);

		// Keep the same date (year, month, day)
		const year = dateTime.getFullYear();
		const month = dateTime.getMonth();
		const day = dateTime.getDate();

		// Calculate the time based on the slider percentage (0-100)
		const msInDay = 24 * 60 * 60 * 1000;
		const msFromMidnight = (n / 100) * msInDay;

		// Create a midnight date and add milliseconds
		const midnight = new Date(year, month, day, 0, 0, 0, 0);
		const newDateTime = new Date(midnight.getTime() + msFromMidnight);

		console.log(`Time Slider ${n}% -> Time of day: ${newDateTime.toTimeString()}`);

		// Set the date and time
		setDateTime(newDateTime);
		engine.core.observer.utc = newDateTime.getMJD();
	}

	//Reset Time Button
	function resetTime() {
		setIsRunning(false);

		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setIsRunning(true);
		}, 2000);
		const reset = new Date(Date.now());
		engine.core.observer.utc = reset.getMJD();
		setDateTime(reset);

		// Calculate date slider position based on day of year
		const d = new Date();
		const start = new Date(d.getFullYear(), 0, 0);
		const diff = d.getTime() - start.getTime();
		const oneDay = 24 * 60 * 60 * 1000;
		const dayOfYear = Math.floor(diff / oneDay);
		const daysInYear = 365.25;

		// Set date slider based on day of year percentage
		const newDateSliderValue = (dayOfYear / daysInYear) * 100;
		console.log('Reset Time - Setting date slider to:', newDateSliderValue);
		setDateSlider(newDateSliderValue);

		// Calculate time slider position based on time of day
		const midnight = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
		const msInDay = 24 * 60 * 60 * 1000;
		const msFromMidnight = d.getTime() - midnight.getTime();
		const newTimeSliderValue = (msFromMidnight / msInDay) * 100;
		console.log('Reset Time - Setting time slider to:', newTimeSliderValue);
		setTimeSlider(newTimeSliderValue);

		engine.core.observer.utc = d.getMJD();
	}

	function changeDateTime(s: string, n: number) {
		setIsRunning(false);

		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setIsRunning(true);
		}, 2000);

		const updatedTime = Moment(dateTime);

		if (s === 'year') {
			if (n > 0) {
				updatedTime.add(1, 'y');
			} else {
				updatedTime.subtract(1, 'y');
			}
		} else if (s === 'month') {
			if (n > 0) {
				updatedTime.add(1, 'M');
			} else {
				updatedTime.subtract(1, 'M');
			}
		} else if (s === 'day') {
			if (n > 0) {
				updatedTime.add(1, 'd');
			} else {
				updatedTime.subtract(1, 'd');
			}
		} else if (s === 'hour') {
			if (n > 0) {
				updatedTime.add(1, 'h');
			} else {
				updatedTime.subtract(1, 'h');
			}
		} else if (s === 'minute') {
			if (n > 0) {
				updatedTime.add(1, 'm');
			} else {
				updatedTime.subtract(1, 'm');
			}
		} else if (s === 'second') {
			if (n > 0) {
				updatedTime.add(1, 's');
			} else {
				updatedTime.subtract(1, 's');
			}
		}

		let newDateTime = updatedTime.toDate();
		setDateTime(newDateTime);

		engine.core.observer.utc = newDateTime.getMJD();

		// Always update both sliders for any date/time change
		// Calculate date slider position based on day of year
		const startOfYear = new Date(newDateTime.getFullYear(), 0, 0);
		const diff = newDateTime.getTime() - startOfYear.getTime();
		const oneDay = 24 * 60 * 60 * 1000;
		const dayOfYear = Math.floor(diff / oneDay);
		const daysInYear = 365.25;

		// Set date slider based on day of year percentage
		const newDateSliderValue = (dayOfYear / daysInYear) * 100;
		console.log(`Change ${s} - Setting date slider to:`, newDateSliderValue);
		setDateSlider(newDateSliderValue);

		// Calculate time slider position based on time of day
		const midnight = new Date(
			newDateTime.getFullYear(),
			newDateTime.getMonth(),
			newDateTime.getDate(),
			0,
			0,
			0,
		);
		const msInDay = 24 * 60 * 60 * 1000;
		const msFromMidnight = newDateTime.getTime() - midnight.getTime();
		const newTimeSliderValue = (msFromMidnight / msInDay) * 100;
		console.log(`Change ${s} - Setting time slider to:`, newTimeSliderValue);
		setTimeSlider(newTimeSliderValue);
	}

	return (
		<DateTime
			DateSlider={dateSliderConfig}
			TimeSlider={timeSliderConfig}
			resetTime={resetTime}
			changeDateTime={changeDateTime}
			moment={Moment(dateTime)}
		/>
	);
}
