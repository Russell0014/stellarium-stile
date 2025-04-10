import { useState, useEffect, useRef } from 'react';
import DateTime from './dateTime';
import swh from '@/assets/sw_helper';
import { useSEngine } from '@/context/SEngineContext';
import moment from 'moment';

export default function DateTimeController() {
	const { engine } = useSEngine();
	const now = getLocalTimeFromUTC();
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

		//Define midnight and compute the difference in time, then create percentage for slider
		//Need to combine these functions
		const midnight = getMidnight();
		const diff = now.getTime() - midnight.getTime();
		const percentage = (diff / 1000 / 86400) * 100;

		//This does nothing yet
		setSlider(percentage);

		//Set the observer time
		requestAnimationFrame(() => {
			try {
				const currTime = engine.core.observer.utc;
				const date = new Date(currTime);
				swh.setObserverTimeJD(engine, date);

				console.log('Observer time set to:', now.toISOString());
			} catch (e) {
				console.error('Something is wrong with the web engine!', e);
			}
		});
	}, [engine]);

	//Updates the clock every 1 second
	// useEffect(() => {
	// 	if (!isRunning) return;

	// 	const interval = setInterval(() => {
	// 		setDateTime((prevDateTime) => {
	// 			const newTime = new Date(prevDateTime.getTime() + 1000);
	// 			// const timezoneOffset = newTime.getTimezoneOffset();
	// 			// const localTime = new Date(newTime.getTime() - timezoneOffset * 60000);
	// 			swh.setObserverTimeJD(engine, newTime);
	// 			return newTime;
	// 		});
	// 	}, 1000);

	// 	return () => clearInterval(interval);
	// }, [isRunning, engine]);

	const defaultSlider = {
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
		}, 500);
		// Get midnight of the current day in local time
		const midnight = getMidnight();

		// Calculate the new time based on the slider percentage (0-100)
		const newTime = (n / 100) * 86400 * 1000; // ms since midnight in UTC

		// Create a new Date object from midnight (in UTC)
		//This should return the correct CURRENT time without Timezone OFFSET
		let newDateTime = new Date(midnight.getTime() + newTime);

		// Set the date and time adjusted to the local time
		setDateTime(newDateTime);
		swh.setObserverTimeJD(engine, newDateTime);
		console.log(newDateTime.toUTCString());
	}

	//Reset Time Button
	function resetTime() {
		//TODO: Make this a function
		setIsRunning(false);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setIsRunning(true);
		}, 500);

		const currTime = engine.core.observer.utc;
		const date = new Date(currTime);

		setDateTime(date);

		const midnight = getMidnight();
		const diff = date.getTime() - midnight.getTime();
		setSlider((diff / 1000 / 86400) * 100);

		swh.setObserverTimeJD(engine, date);
	}

	//Get local Time from UTC
	function getLocalTimeFromUTC(): Date {
		const utcNow = new Date(Date.now());
		return utcNow;
	}

	function changeDateTime(s: string, n: number) {
		setIsRunning(false);
		//TODO: timeout Function
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setIsRunning(true);
		}, 50);

		const updatedTime = moment(dateTime);

		if (s === 'year') {
			n > 0 ? updatedTime.add(1, 'y') : updatedTime.subtract(1, 'y');
		} else if (s === 'month') {
			n > 0 ? updatedTime.add(1, 'M') : updatedTime.subtract(1, 'M');
		} else if (s === 'day') {
			n > 0 ? updatedTime.add(1, 'd') : updatedTime.subtract(1, 'd');
		} else if (s === 'hour') {
			n > 0 ? updatedTime.add(1, 'h') : updatedTime.subtract(1, 'h');
		} else if (s === 'minute') {
			n > 0 ? updatedTime.add(1, 'm') : updatedTime.subtract(1, 'm');
		} else if (s === 'second') {
			n > 0 ? updatedTime.add(1, 's') : updatedTime.subtract(1, 's');
		}

		const newDateTime = updatedTime.toDate();
		setDateTime(newDateTime);

		swh.setObserverTimeJD(engine, newDateTime);
	}

	return (
		<DateTime
			Slider={defaultSlider}
			resetTime={resetTime}
			timeSlider={timeSlider}
			changeDateTime={changeDateTime}
			moment={moment(dateTime)}
		/>
	);
}
