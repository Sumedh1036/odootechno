"use client";

import { useState, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion } from "framer-motion";
import { Search, Bell, User } from "lucide-react";

// Setup moment for calendar
const localizer = momentLocalizer(moment);

// Mock Data
const mockTasks = [
	{
		id: 1,
		title: "Engine Check",
		category: "Mechanical",
		status: "Open",
		distance: 5,
		start: new Date(2025, 7, 28, 10, 0),
		end: new Date(2025, 7, 28, 12, 0),
	},
	{
		id: 2,
		title: "Car Wash",
		category: "Cleaning",
		status: "Completed",
		distance: 2,
		start: new Date(2025, 7, 29, 14, 0),
		end: new Date(2025, 7, 29, 15, 0),
	},
	{
		id: 3,
		title: "Tire Replacement",
		category: "Mechanical",
		status: "In Progress",
		distance: 10,
		start: new Date(2025, 7, 30, 9, 0),
		end: new Date(2025, 7, 30, 11, 0),
	},
];

export default function TaskCalendar() {
	const [filters, setFilters] = useState({
		category: "All",
		status: "All",
		showOpenOnly: false,
		sortBy: "Date",
		search: "",
	});
	const [viewMode, setViewMode] = useState("calendar");
	const [currentDate, setCurrentDate] = useState(new Date());
	const [view, setView] = useState("week");

	// Filtered tasks
	const filteredTasks = useMemo(() => {
		let tasks = [...mockTasks];

		if (filters.category !== "All") {
			tasks = tasks.filter((t) => t.category === filters.category);
		}
		if (filters.status !== "All") {
			tasks = tasks.filter((t) => t.status === filters.status);
		}
		if (filters.showOpenOnly) {
			tasks = tasks.filter((t) => t.status === "Open");
		}
		if (filters.search) {
			tasks = tasks.filter((t) =>
				t.title.toLowerCase().includes(filters.search.toLowerCase())
			);
		}
		if (filters.sortBy === "Distance") {
			tasks.sort((a, b) => a.distance - b.distance);
		} else {
			tasks.sort((a, b) => a.start.getTime() - b.start.getTime());
		}
		return tasks;
	}, [filters]);

	const handleSelectEvent = (event: any) => {
		alert(
			`Task: ${event.title}\nCategory: ${event.category}\nStatus: ${event.status}\nDistance: ${event.distance}km`
		);
	};

	const handleNavigate = (action: "today" | "prev" | "next") => {
		const newDate = {
			today: new Date(),
			prev: new Date(currentDate.setDate(currentDate.getDate() - 7)),
			next: new Date(currentDate.setDate(currentDate.getDate() + 7)),
		}[action];
		setCurrentDate(newDate);
	};

	const handleViewChange = (newView: "week" | "month") => {
		setView(newView);
	};

	return (
		<div className="min-h-screen bg-white p-6 flex items-center justify-center">
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7 }}
				className="w-full max-w-7xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden"
			>
				{/* Header */}
				<div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 flex justify-between items-center">
					<h1 className="text-2xl font-bold text-white flex items-center gap-2">
						Worker Dashboard
					</h1>
					<button className="px-5 py-2 bg-white/20 text-white font-medium rounded-lg shadow hover:bg-white/30 transition">
						Notifications
					</button>
				</div>

				{/* Content */}
				<div className="p-8 space-y-6">
					{/* Filters */}
					<div className="flex items-center space-x-4 flex-wrap bg-gray-100 p-4 rounded-lg shadow-md">
						<div className="flex flex-col">
							<label className="text-sm font-medium text-gray-700">
								Category
							</label>
							<select
								value={filters.category}
								onChange={(e) =>
									setFilters({ ...filters, category: e.target.value })
								}
								className="border rounded px-3 py-2 bg-white shadow-sm focus:ring focus:ring-indigo-300"
							>
								<option>All</option>
								<option>Mechanical</option>
								<option>Cleaning</option>
							</select>
						</div>

						<div className="flex flex-col">
							<label className="text-sm font-medium text-gray-700">
								Status
							</label>
							<select
								value={filters.status}
								onChange={(e) =>
									setFilters({ ...filters, status: e.target.value })
								}
								className="border rounded px-3 py-2 bg-white shadow-sm focus:ring focus:ring-indigo-300"
							>
								<option>All</option>
								<option>Open</option>
								<option>In Progress</option>
								<option>Completed</option>
							</select>
						</div>

						<div className="flex flex-col">
							<label className="text-sm font-medium text-gray-700">
								Sort by
							</label>
							<select
								value={filters.sortBy}
								onChange={(e) =>
									setFilters({ ...filters, sortBy: e.target.value })
								}
								className="border rounded px-3 py-2 bg-white shadow-sm focus:ring focus:ring-indigo-300"
							>
								<option value="Date">Date</option>
								<option value="Distance">Distance</option>
							</select>
						</div>

						<div className="flex items-center space-x-2 mt-3">
							<input
								type="checkbox"
								checked={filters.showOpenOnly}
								onChange={(e) =>
									setFilters({
										...filters,
										showOpenOnly: e.target.checked,
									})
								}
								className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring focus:ring-indigo-300"
							/>
							<label className="text-sm font-medium text-gray-700 ">
								Show open only
							</label>
						</div>

						<div className="flex flex-col">
							<label className="text-sm font-medium text-gray-700">
								View Mode
							</label>
							<select
								value={viewMode}
								onChange={(e) => setViewMode(e.target.value)}
								className="border rounded px-3 py-2 bg-white shadow-sm focus:ring focus:ring-indigo-300"
							>
								<option value="calendar">Calendar</option>
								<option value="list">List</option>
							</select>
						</div>

						<div className="flex items-center border rounded px-3 py-2 bg-white shadow-sm w-full md:w-1/3 mt-4">
							<Search className="mr-2 text-gray-400" />
							<input
								type="text"
								placeholder="Search Shop"
								value={filters.search}
								onChange={(e) =>
									setFilters({ ...filters, search: e.target.value })
								}
								className="w-full outline-none"
							/>
						</div>
					</div>

					{/* View Mode */}
					{viewMode === "calendar" ? (
						<div className="h-[600px] bg-white rounded-xl shadow">
							<div className="flex justify-between items-center mb-4">
								<div>
									<button
										onClick={() => handleNavigate("today")}
										className="px-4 py-2 bg-gray-200 rounded-lg mr-2"
									>
										Today
									</button>
									<button
										onClick={() => handleNavigate("prev")}
										className="px-4 py-2 bg-gray-200 rounded-lg mr-2"
									>
										Back
									</button>
									<button
										onClick={() => handleNavigate("next")}
										className="px-4 py-2 bg-gray-200 rounded-lg"
									>
										Next
									</button>
								</div>
								<div>
									<button
										onClick={() => handleViewChange("week")}
										className={`px-4 py-2 rounded-lg mr-2 ${
											view === "week"
												? "bg-indigo-500 text-white"
												: "bg-gray-200"
										}`}
									>
										Week
									</button>
									<button
										onClick={() => handleViewChange("month")}
										className={`px-4 py-2 rounded-lg ${
											view === "month"
												? "bg-indigo-500 text-white"
												: "bg-gray-200"
										}`}
									>
										Month
									</button>
								</div>
							</div>
							<Calendar
								localizer={localizer}
								events={filteredTasks}
								startAccessor="start"
								endAccessor="end"
								style={{ height: "100%" }}
								onSelectEvent={handleSelectEvent}
								date={currentDate}
								view={view}
								onNavigate={(date: Date) => setCurrentDate(date)}
								onView={(newView: "week" | "month") => setView(newView)}
							/>
						</div>
					) : (
						<div className="bg-white rounded-xl shadow p-6">
							<h2 className="text-xl font-semibold mb-4">Task List</h2>
							<ul className="space-y-4">
								{filteredTasks.map((task) => (
									<li
										key={task.id}
										className="border rounded p-4 flex justify-between items-center"
									>
										<div>
											<p className="font-medium">{task.title}</p>
											<p className="text-sm text-gray-500">
												{task.category} - {task.status}
											</p>
										</div>
										<button
											// onClick={() => router.push(/workshop_detail?id=${task.id})}
											className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
										>
											View Details
										</button>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</motion.div>
		</div>
	);
}