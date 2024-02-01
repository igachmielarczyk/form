import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ApplicationForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(18);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedHoliday, setSelectedHoliday] = useState<any>(null);
  const [holidays, setHolidays] = useState<any[]>([]);

  const fetchHolidays = async () => {
    const country = "PL";
    const year = "2023";

    let options = {
      method: "GET",
      headers: { "x-api-key": "8DX8eEe67njS1lbThFsdSw==rQQNpQ8PYbPZBjrx" },
    };

    let url = `https://api.api-ninjas.com/v1/holidays?country=${country}&year=${year}`;

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        setHolidays(data);
      })
      .catch((err) => {
        console.log(`error ${err}`);
      });
  };
  useEffect(() => {
    fetchHolidays();
  }, []);

  const isHoliday = (date: Date): boolean => {
    const formattedDate = formatDate(date);
    return holidays.some((holiday: any) => holiday.date === formattedDate);
  };

  // Helper function for formatting the date into the form "YYYY-MM-DD"
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);

    // Randomly selecting 4 hours from available options
    if (date !== null) {
      const allTimes: string[] = [];
      let currentHour = 8;
      let currentMinute = 0;

      while (currentHour < 20) {
        allTimes.push(
          `${currentHour.toString().padStart(2, "0")}:${currentMinute
            .toString()
            .padStart(2, "0")}`
        );
        currentMinute += 30;
        if (currentMinute === 60) {
          currentHour++;
          currentMinute = 0;
        }
      }

      const shuffledTimes = allTimes
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
      setAvailableTimes(shuffledTimes);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedDate !== null && selectedTime !== null) {
      try {
        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("age", age.toString());
        formData.append("selectedDate", selectedDate.toString());
        formData.append("selectedTime", selectedTime);

        // Simulation of sending data to an imaginary endpoint
        await axios.post("http://letsworkout.pl/submit", formData);

        alert("Form submitted successfully!");
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred while submitting the form.");
      }
    } else {
      alert("Please select a date and time.");
    }
  };

  const toggleTimeSelection = (time: string) => {
    setSelectedTime(time === selectedTime ? null : time);
  };

  const handleDateClick = (date: Date) => {
    if (!isHoliday(date)) {
      setSelectedDate(date);
    }
    const holiday = holidays.find(
      (holiday: any) => holiday.date === formatDate(date)
    );
    setSelectedHoliday(holiday);
  };

  // support for adding a file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
    }
  };

  const handleClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="w-full lg:w-1/3">
      <h2 className="text-2xl mb-5">Personal info</h2>
      <form onSubmit={handleFormSubmit} className="w-full">
        <div className="mb-4">
          <label className="block">First Name</label>
          <input
            className="w-full"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Last Name</label>
          <input
            className="w-full"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Email Address</label>
          <input
            className="w-full"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Age: {age}</label>
          <input
            className="w-full"
            type="range"
            min={8}
            max={100}
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            required
          />
        </div>

        <label className="block">
          Photo:
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div className="btn-file">
            <button onClick={handleClick}>Upload a file</button>
            <span>or drag and drop here</span>
          </div>
        </label>
        <h2 className="text-2xl mb-5 mt-5">Your workout</h2>
        <div className="w-full md:flex flex-wrap ">
          <div className="mb-4">
            <label className="block">Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => handleDateChange(date)}
              onSelect={(date: Date) => handleDateClick(date)} 
              inline
              required
            />
          </div>
          {selectedHoliday && (
            <div className="mb-4">
              <p>
                {selectedHoliday.name} - {selectedHoliday.date}
              </p>
            </div>
          )}
          {selectedDate && (
            <div className="mb-4 ml-2">
              <label className="block ml-2">Time</label>
              <div className="flex flex-wrap md:flex-col">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    className={`m-2 px-4 py-2 rounded-md border ${
                      time === selectedTime
                        ? "border-purple-500 bg-white"
                        : "bg-white"
                    }`}
                    onClick={() => toggleTimeSelection(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-purple-300 hover:bg-purple-500 text-white px-4 py-4 mt-5 rounded-md w-full"
        >
          Send Application
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
