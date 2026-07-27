import React, { useEffect, useState } from 'react';

function to24Hour(hour12, minute, period) {
  let hour = parseInt(hour12, 10);
  if (period === 'AM') {
    if (hour === 12) hour = 0;
  } else {
    if (hour !== 12) hour += 12;
  }
  return `${String(hour).padStart(2, '0')}:${minute}`;
}

function from24Hour(value) {
  if (!value) return { hour12: '12', minute: '00', period: 'AM' };
  const [hourStr, minuteStr] = value.split(':');
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return { hour12: String(hour), minute: minuteStr, period };
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export default function TimeInput12hr({ value, onChange, required }) {
  const parsed = from24Hour(value);
  const [hour12, setHour12] = useState(parsed.hour12);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState(parsed.period);

  useEffect(() => {
    const parsedNow = from24Hour(value);
    setHour12(parsedNow.hour12);
    setMinute(parsedNow.minute);
    setPeriod(parsedNow.period);
  }, [value]);

  const emit = (h, m, p) => {
    onChange(to24Hour(h, m, p));
  };

  return (
    <div className="flex gap-2">
      <select
        required={required}
        className="input-field"
        value={hour12}
        onChange={(e) => { setHour12(e.target.value); emit(e.target.value, minute, period); }}
      >
        {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
      </select>
      <select
        required={required}
        className="input-field"
        value={minute}
        onChange={(e) => { setMinute(e.target.value); emit(hour12, e.target.value, period); }}
      >
        {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select
        required={required}
        className="input-field"
        value={period}
        onChange={(e) => { setPeriod(e.target.value); emit(hour12, minute, e.target.value); }}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}