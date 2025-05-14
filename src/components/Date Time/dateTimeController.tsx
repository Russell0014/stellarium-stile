import { useState, useEffect, useRef } from 'react';
import DateTime from './dateTime';
import swh from '@/assets/sw_helper';
import { useSEngine } from '@/context/SEngineContext';
import Moment from 'moment';

export default function DateTimeController() {
	const { engine } = useSEngine();
	let d = Moment().toDate();
	const [dateTime, setDateTime] = useState<Date>(d);
	const [dateSlider, setDateSlider] = useState<number>(1);
	const [timeSlider, setTimeSlider] = useState<number>(0);
	const [isRunning, setIsRunning] = useState(true);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Helper function to get days in year
	function getDaysInYear(year: number): number {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
	}

	// Helper function to get day of year (1-366)
	function getDayOfYear(date: Date): number {
		const start = new Date(date.getFullYear(), 0, 0);
		const diff = date.getTime() - start.getTime();
		const oneDay = 24 * 60 * 60 * 1000;
		return Math.floor(diff / oneDay);
	}

	//This will run on initialisation
	//1. Sets the slider to correct position
	//2. Sets the Location [Need to fix, currently running before MapView.tsx]
	//3. Updates the core.observer.utc time to Current Time.

	useEffect(() => {
		if (!engine) return;

		// Set date slider based on day of year (1-366)
		const dayOfYear = getDayOfYear(d);
		setDateSlider(dayOfYear);

		// Calculate time slider position based on seconds since midnight
		const hours = d.getHours();
		const minutes = d.getMinutes();
		const seconds = d.getSeconds();
		const totalSeconds = hours * 3600 + minutes * 60 + seconds;
		setTimeSlider(totalSeconds);

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
		min: 1,
		max: getDaysInYear(dateTime.getFullYear()),
		step: 1,
		onValueChange: (value: number) => handleDateSlider(value),
	};

	// Configuration for time slider (time of day)
	const timeSliderConfig = {
		defaultValue: [timeSlider],
		min: 0,
		max: 86399, // 23:59:59 in seconds (24*60*60 - 1)
		step: 1,
		onValueChange: (value: number) => handleTimeSlider(value),
	};

	function geoIP() {}

	// Handler for the date slider
	function handleDateSlider(n: number) {
		if (!engine?.core) return;

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

		// Create a new Date object for the selected day in current year
		const newDateTime = new Date(
			dateTime.getFullYear(),
			0,
			n, // Direct day of year (1-366)
			hours,
			minutes,
			seconds,
			ms,
		);

		// Set the date and time
		setDateTime(newDateTime);
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

		// Calculate hours, minutes, seconds from total seconds
		const hours = Math.floor(n / 3600);
		const minutes = Math.floor((n % 3600) / 60);
		const seconds = n % 60;

		// Create a new date with the selected time
		const newDateTime = new Date(year, month, day, hours, minutes, seconds);

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

		// Set date slider based on day of year
		const dayOfYear = getDayOfYear(reset);
		setDateSlider(dayOfYear);

		// Calculate time slider position based on seconds since midnight
		const hours = reset.getHours();
		const minutes = reset.getMinutes();
		const seconds = reset.getSeconds();
		const totalSeconds = hours * 3600 + minutes * 60 + seconds;
		setTimeSlider(totalSeconds);

		engine.core.observer.utc = reset.getMJD();
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

		// Update both sliders for any date/time change
		// Set date slider based on day of year
		const dayOfYear = getDayOfYear(newDateTime);
		setDateSlider(dayOfYear);

		// Calculate time slider position based on seconds since midnight
		const hours = newDateTime.getHours();
		const minutes = newDateTime.getMinutes();
		const seconds = newDateTime.getSeconds();
		const totalSeconds = hours * 3600 + minutes * 60 + seconds;
		setTimeSlider(totalSeconds);
	}

	return (
		<DateTime
			DateSlider={dateSliderConfig}
			resetTime={resetTime}
			changeDateTime={changeDateTime}
			moment={Moment(dateTime)}
		/>
	);
}
