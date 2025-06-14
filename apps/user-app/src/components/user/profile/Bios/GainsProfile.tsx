"use client";

import { useEffect, useState } from "react";

export default function GainsProfile({ userId }: { userId: string }) {
	const [formData, setFormData] = useState({
		goals: [] as string[],
		accomplishments: [] as string[],
		interests: [] as string[],
		networks: [] as string[],
		skills: [] as string[],
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await fetch(`/api/user/${userId}/bios/gains-profile`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!res.ok) throw new Error("Failed to fetch profile");
				const data = await res.json();
				setFormData({
					goals: data.data.goals || [],
					accomplishments: data.data.accomplishments || [],
					interests: data.data.interests || data.intrests || [],
					networks: data.data.networks || [],
					skills: data.data.skills || [],
				});
			} catch (error) {
				console.error("Error fetching profile:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [userId]);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		const lines = value
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean);
		setFormData((prev) => ({ ...prev, [name]: lines }));
	};

	const formatArray = (arr: string[]) => arr.join("\n");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch(`/api/user/${userId}/bios/gains-profile`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			if (!res.ok) throw new Error("Failed to save profile");
			alert("Profile saved successfully!");
		} catch (error) {
			console.error("Error saving profile:", error);
			alert("Something went wrong while saving the profile.");
		}
	};

	if (loading) return <div className="p-8 text-center">Loading...</div>;

	return (
		<div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-5xl bg-white p-8 rounded-lg shadow space-y-6">
				{/* Goals */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Goals<span className="text-red-600">*</span>
					</label>
					<textarea
						name="goals"
						value={formatArray(formData.goals)}
						onChange={handleChange}
						rows={5}
						required
						placeholder="Enter your family, relationship, and business goals (one per line)..."
						className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Accomplishments */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Accomplishments
					</label>
					<textarea
						name="accomplishments"
						value={formatArray(formData.accomplishments)}
						onChange={handleChange}
						rows={4}
						placeholder="Enter your key accomplishments (one per line)..."
						className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Interests */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Interests
					</label>
					<textarea
						name="interests"
						value={formatArray(formData.interests)}
						onChange={handleChange}
						rows={4}
						placeholder="List your interests (one per line)..."
						className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Networks */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Networks
					</label>
					<textarea
						name="networks"
						value={formatArray(formData.networks)}
						onChange={handleChange}
						rows={3}
						placeholder="Mention the networks you're part of (one per line)..."
						className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Skills */}
				<div>
					<label className="block font-semibold text-black mb-1">Skills</label>
					<textarea
						name="skills"
						value={formatArray(formData.skills)}
						onChange={handleChange}
						rows={4}
						placeholder="List your skills (one per line)..."
						className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Actions */}
				<div className="flex justify-end gap-4 pt-6">
					<button
						type="submit"
						className="bg-black text-white px-6 py-2 rounded hover:opacity-90 font-semibold">
						Save
					</button>
				</div>
			</form>
		</div>
	);
}
