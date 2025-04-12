import { useState, useEffect, useRef } from 'react';
import DateTime from './dateTime';
import swh from '@/assets/sw_helper';
import { useSEngine } from '@/context/SEngineContext';
import moment from 'moment';

export default function DateTimeController() {
	const { engine } = useSEngine();
	const now = new Date(Date.now());
	const [dateTime, setDateTime] = useState<Date>(now);
	const [slider, setSlider] = useState<number>(50);
	const [isRunning, setIsRunning] = useState(true);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Get midnight of today
	const getMidnight = (): Date => {
		return new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 0, 0, 0);
	};

	useEffect(() => {
		if (!engine) return;

		// Calculate slider position based on day of year
		const start = new Date(now.getFullYear(), 0, 0);
		const diff = now.getTime() - start.getTime();
		const oneDay = 24 * 60 * 60 * 1000;
		const dayOfYear = Math.floor(diff / oneDay);
		const daysInYear = 365.25;

		// Set slider based on day of year percentage
		const percentage = (dayOfYear / daysInYear) * 100;
		setSlider(percentage);

		//Set the observer time
		requestAnimationFrame(() => {
			try {
				swh.setObserverTimeJD(engine, now);
				console.log('Observer time set to:', now.toISOString());
			} catch (e) {
				console.error('Something is wrong with the web engine!', e);
			}
		});
	}, [engine]);

	//Updates the clock every 1 second
	useEffect(() => {
		if (!isRunning) return;

		const interval = setInterval(() => {
			setDateTime((prevDateTime) => {
				const newTime = new Date(prevDateTime.getTime() + 1000);
				swh.setObserverTimeJD(engine, newTime);
				return newTime;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [isRunning, engine]);

	const sliderConfig = {
		defaultValue: [slider],
		min: 0,
		max: 100,
		step: 1,
		onValueChange: (value: number) => timeSlider(value),
	};

	function timeSlider(n: number) {
		setIsRunning(false);

		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setIsRunning(true);
		}, 2000);

		// Update slider state to make the controlled component work
		setSlider(n);

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
			ms
		);

		console.log(`Slider ${n}% -> Day of year: ${dayOfYear} -> ${newDateTime.toISOString()}`);

		// Set the date and time
		setDateTime(newDateTime);
		swh.setObserverTimeJD(engine, newDateTime);
	}

	//Reset Time Button
	function resetTime() {
		setIsRunning(false);

		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setIsRunning(true);
		}, 2000);
		const reset = new Date(Date.now());
		setDateTime(reset);

		// Calculate slider position based on day of year
		const now = new Date();
		const start = new Date(now.getFullYear(), 0, 0);
		const diff = now.getTime() - start.getTime();
		const oneDay = 24 * 60 * 60 * 1000;
		const dayOfYear = Math.floor(diff / oneDay);
		const daysInYear = 365.25;

		// Set slider based on day of year percentage
		const newSliderValue = (dayOfYear / daysInYear) * 100;
		console.log('Reset Time - Setting slider to:', newSliderValue);
		setSlider(newSliderValue);
		swh.setObserverTimeJD(engine, reset);
	}

	function changeDateTime(s: string, n: number) {
		setIsRunning(false);

		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setIsRunning(true);
		}, 2000);

		const updatedTime = moment(dateTime);

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

		const newDateTime = updatedTime.toDate();
		setDateTime(newDateTime);
		swh.setObserverTimeJD(engine, newDateTime);

		// Update the slider for any date/time change
		const startOfYear = new Date(newDateTime.getFullYear(), 0, 0);
		const diff = newDateTime.getTime() - startOfYear.getTime();
		const oneDay = 24 * 60 * 60 * 1000;
		const dayOfYear = Math.floor(diff / oneDay);
		const daysInYear = 365.25;

		// Set slider based on day of year percentage
		const newSliderValue = (dayOfYear / daysInYear) * 100;
		console.log(`Change ${s} - Setting slider to:`, newSliderValue);
		setSlider(newSliderValue);
	}

	return (
		<DateTime
			Slider={sliderConfig}
			resetTime={resetTime}
			timeSlider={timeSlider}
			changeDateTime={changeDateTime}
			moment={moment(dateTime)}
		/>
	);
}
