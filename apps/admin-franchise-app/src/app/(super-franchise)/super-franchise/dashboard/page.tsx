import Link from "next/link";
import React from "react";
import { BiArrowFromLeft } from "react-icons/bi";

const page = () => {
	return (
		<div>
			<div className="flex items-center gap-x-4 p-4 mb-6 border-b border-gray-200">
				<BiArrowFromLeft className="text-lg text-gray-600" />
				<Link
					className="text-blue-500 hover:text-blue-700 transition duration-300"
					href="/super-franchise/regions">
					Regions
				</Link>
				<Link
					className="text-blue-500 hover:text-blue-700 transition duration-300"
					href="/super-franchise/regional-franchise">
					Regional-Franchise
				</Link>
			</div>
			<h2 className=" text-3xl text-red-500">Regional-franchise dashboard</h2>
			<p>
				Welcome to the Regional franchise dashboard! Here you can manage your
				franchise operations, including creating and managing regions,
				franchises, and franchise admins. Use the links above to navigate to
				different sections of the admin panel.
			</p>
		</div>
	);
};

export default page;
