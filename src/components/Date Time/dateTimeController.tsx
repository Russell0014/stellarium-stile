import { useState, useEffect } from 'react';
import DateTime from './dateTime';
import swh from '@/assets/sw_helper';
import { useSEngine } from '@/context/SEngineContext';

export default function DateTimeController() {
	const { engine } = useSEngine();
	const now = getLocalTimeFromUTC();
	const [dateTime, setDateTime] = useState<Date>(now);
	const [slider, setSlider] = useState<number>(50);

	// Get midnight of today
	const getMidnight = (): Date => {
		return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
	};

	useEffect(() => {
		if (!engine) return;

		//Define midnight and compute the difference in time, then create percentage for slider
		const midnight = getMidnight();
		const diff = now.getTime() - midnight.getTime();
		const percentage = (diff / 1000 / 86400) * 100;
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

	const defaultSlider = {
		defaultValue: [slider],
		min: 0,
		max: 100,
		step: 1,
		onValueChange: (value: number) => timeSlider(value),
	};

	function timeSlider(n: number) {
		// Get midnight of the current day in local time
		const midnight = getMidnight();

		// Calculate the new time based on the slider percentage (0-100)
		const newTime = (n / 100) * 86400 * 1000; // ms since midnight in UTC

		// Create a new Date object from midnight (in UTC)
		const newDateTime = new Date(midnight.getTime() + newTime);

		// Adjust for local timezone by applying the timezone offset
		const timezoneOffset = newDateTime.getTimezoneOffset(); // get timezone offset in minutes
		const localDateTime = new Date(newDateTime.getTime() - timezoneOffset * 60000); // convert offset to milliseconds

		// Set the date and time adjusted to the local time
		setDateTime(localDateTime);
		swh.setObserverTimeJD(engine, localDateTime);
	}

	//Reset Time Button
	function resetTime() {
		let reset = getLocalTimeFromUTC();
		setDateTime(reset);

		const midnight = getMidnight();
		const diff = reset.getTime() - midnight.getTime();
		setSlider((diff / 1000 / 86400) * 100);
		swh.setObserverTimeJD(engine, reset);
	}

	function getLocalTimeFromUTC(): Date {
		const utcNow = new Date(Date.now());
		const timezoneOffset = utcNow.getTimezoneOffset();
		const localTime = new Date(utcNow.getTime() - timezoneOffset * 60000); //Adjusts time by subtracting offset (min -> milliseconds)
		return localTime;
	}

	return (
		<DateTime
			dateTime={dateTime}
			Slider={defaultSlider}
			resetTime={resetTime}
			timeSlider={timeSlider}
		/>
	);
}
