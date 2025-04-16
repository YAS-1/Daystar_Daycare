/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaExclamationTriangle } from "react-icons/fa";

const ReportedIncidents = ({
	setIsLoggedIn,
	setUserRole,
	formatDate,
	navigate,
	refreshIncidents,
}) => {
	const [incidents, setIncidents] = useState([]);
	const [loadingIncidents, setLoadingIncidents] = useState(true);

	const fetchIncidents = async () => {
		try {
			setLoadingIncidents(true);
			const response = await axios.get(
				"http://localhost:3337/api/babysitter/incidentsReportedByMe",
				{ withCredentials: true }
			);
			setIncidents(response.data.data || []);
			console.log("Incidents fetched:", response.data.data);
		} catch (error) {
			console.error("Error fetching incidents:", error);
			if (error.response?.status === 401) {
				toast.error("Session expired. Please log in again.", {
					position: "top-right",
				});
				setIsLoggedIn(false);
				setUserRole(null);
				navigate("/babysitter/login");
			}
		} finally {
			setLoadingIncidents(false);
		}
	};

	useEffect(() => {
		let isMounted = true;
		fetchIncidents();
		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		if (refreshIncidents) {
			fetchIncidents();
		}
	}, [refreshIncidents]);

	return (
		<section className='mb-12'>
			<h2 className='text-2xl font-bold text-gray-800 mb-4 flex items-center'>
				<FaExclamationTriangle className='mr-2 text-red-500' />
				My Incidents
			</h2>
			{loadingIncidents ? (
				<div className='flex justify-center items-center min-h-[20vh]'>
					<div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500'></div>
				</div>
			) : incidents.length === 0 ? (
				<div className='bg-white rounded-lg shadow p-6 text-center'>
					<FaExclamationTriangle className='mx-auto text-4xl text-gray-400 mb-4' />
					<p className='text-gray-600 text-lg'>No incidents reported.</p>
				</div>
			) : (
				<div className='bg-white rounded-xl shadow-md overflow-hidden'>
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Child Name
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Type
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Description
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Date
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Status
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{incidents.map((incident, index) => (
									<tr key={index} className='hover:bg-gray-50'>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='flex-shrink-0 h-10 w-10'>
													<div className='bg-gray-100 p-2 rounded-full'>
														<FaExclamationTriangle className='text-red-500 text-xl' />
													</div>
												</div>
												<div className='ml-4'>
													<div className='text-sm font-medium text-gray-900'>
														{incident.child_name}
													</div>
												</div>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												{incident.incident_type || "N/A"}
											</div>
										</td>
										<td className='px-6 py-4'>
											<div className='text-sm text-gray-900 max-w-xs truncate'>
												{incident.description || "N/A"}
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												{formatDate(incident.incident_date)}
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												{incident.status
													? incident.status.charAt(0).toUpperCase() +
													  incident.status.slice(1)
													: "N/A"}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</section>
	);
};

export default ReportedIncidents;
