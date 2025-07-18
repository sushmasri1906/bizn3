"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { User, BusinessDetails, UserMembershipType } from "@repo/db/client";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { GoUnverified } from "react-icons/go";
import Image from "next/image";
import Link from "next/link";
import Upgrade from "../../common/Upgrade";
import { AnimatePresence, motion } from "framer-motion";
import {
	FiChevronRight,
	FiEdit,
	FiExternalLink,
	FiBriefcase,
	FiHome,
	FiList,
	FiAlignLeft,
	FiTag,
	FiPhone,
	FiMail,
	FiUser,
	FiGlobe as FiGlobeOutline,
} from "react-icons/fi";
import { HiOutlineBookmark } from "react-icons/hi";

// Cloudinary badge URLs
const BADGE_URLS: Record<UserMembershipType, string> = {
	FREE: "https://res.cloudinary.com/degrggosz/image/upload/v1750931312/5_iqrq2u.png",
	GOLD: "https://res.cloudinary.com/degrggosz/image/upload/v1750931298/2_ghut8s.png",
	VIP: "https://res.cloudinary.com/degrggosz/image/upload/v1750931311/3_xolgia.png",
};

interface ProfileProps extends Omit<User, "password"> {
	businessDetails: BusinessDetails;
}
type ContactDetails = {
	phone: string | null;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	mobile: string | null;
	website: string | null;
	links: string[];
	houseNo: string | null;
	pager: string | null;
	voiceMail: string | null;
};
type ProfilePageProps = {
	user?: ProfileProps;
	contactDetailsRes?: ContactDetails | null;
};

const SetMembershipUrl = (membershipType: UserMembershipType) => {
	switch (membershipType) {
		case UserMembershipType.VIP:
			return "vip";
		case UserMembershipType.GOLD:
			return "gold";
		case UserMembershipType.FREE:
			return "free";
		default:
			return "";
	}
};

const ProfilePage = ({ user, contactDetailsRes }: ProfilePageProps) => {
	const [showLinksModal, setShowLinksModal] = useState(false);
	const { data: session } = useSession();
	const membershipType =
		session?.user.membershipType ?? UserMembershipType.FREE;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-12 px-4 sm:px-6 lg:px-8 bg-white">
			{/* Profile Image + Membership Badge */}
			<div className="border border-gray-200 p-4 bg-slate-100 shadow-2xl">
				<div className="relative flex justify-center items-center mb-4">
					<Image
						src={
							user?.profileImage ||
							"https://res.cloudinary.com/degrggosz/image/upload/v1741262734/task-management-system-screenshot-1_dmv2aa.png"
						}
						alt="profile image"
						width={144}
						height={144}
						className="hidden lg:block w-36 h-36 rounded-full object-cover border-4 border-gray-100 shadow"
					/>
					<Image
						src={
							user?.profileImage ||
							"https://res.cloudinary.com/degrggosz/image/upload/v1741262734/task-management-system-screenshot-1_dmv2aa.png"
						}
						alt="profile image"
						width={128}
						height={128}
						className="block lg:hidden w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow"
					/>

					{/* Badge Overlay */}
					{BADGE_URLS[membershipType] && (
						<div className="absolute -top-0.5 -right-0.5">
							<Image
								src={BADGE_URLS[membershipType]}
								alt={`${membershipType} badge`}
								width={80}
								height={80}
								className="w-20 h-20 "
							/>
						</div>
					)}
				</div>

				<p className="text-lg text-center font-medium text-black border-b pb-2">
					{session?.user.firstname} {session?.user.lastname}
				</p>

				<div className="mt-6 bg-slate-150 px-5 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between flex-wrap gap-2">
					<div className="flex items-baseline gap-2">
						<p className="text-sm text-gray-600 font-medium">Franchise Type:</p>
						<p className="text-base font-semibold text-gray-900">
							{membershipType}
						</p>
					</div>

					{membershipType !== UserMembershipType.VIP && <Upgrade />}
				</div>

				<div className="mt-6 bg-slate-100 px-5 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between flex-wrap gap-2">
					<div className="flex items-baseline gap-2">
						<p className="text-sm text-gray-600 font-medium">Connections:</p>
						<p className="text-base font-semibold text-gray-900">Coming Soon</p>
					</div>
					<span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
						Upcoming Feature
					</span>
				</div>
			</div>

			{/* Personal Details */}
			<div className="flex flex-col gap-4">
				{user && (
					<div className="relative border border-gray-200 shadow-2xl p-6 text-base font-medium text-gray-800 bg-slate-100">
						<Link
							href={`/${SetMembershipUrl(membershipType)}/profile/personal-details`}
							className="absolute right-4 top-4 text-red-600 text-sm font-medium flex items-center gap-x-1">
							<FiEdit className="text-base" />
							<span className="font-semibold">Edit</span>
						</Link>
						<h2 className="text-lg font-bold text-red-600 mb-4">
							Personal Details
						</h2>
						<div className="space-y-4">
							<InfoRow
								icon={<FiPhone />}
								value={user.phone}
								verified={user.phoneVerified}
							/>
							<InfoRow
								icon={<FiMail />}
								value={user.email}
								verified={user.emailVerified}
							/>
							<InfoRow
								icon={<FiUser />}
								value={`${user.firstname} ${user.lastname}`}
								verified={user.registrationCompleted}
							/>
							<InfoRow
								icon={<FiGlobeOutline />}
								value={contactDetailsRes?.website || "No website provided"}
							/>
							<div className="flex items-center gap-x-3 flex-wrap">
								<HiOutlineBookmark className="text-xl text-gray-700" />
								{!contactDetailsRes?.links?.length ? (
									<span className="text-gray-500">No links provided</span>
								) : (
									<motion.button
										layoutId="showLinksModal"
										transition={{ duration: 0.2 }}
										onClick={() => setShowLinksModal(true)}
										className="text-blue-600 hover:underline font-medium">
										View all links ({contactDetailsRes.links.length})
									</motion.button>
								)}
								<AnimatePresence>
									{showLinksModal && (
										<motion.div
											key="showLinksModal"
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											exit={{ scale: 0 }}
											transition={{ duration: 0.2 }}
											className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40">
											<div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative max-h-[80vh] overflow-y-auto">
												<button
													onClick={() => setShowLinksModal(false)}
													className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg font-bold">
													×
												</button>
												<h3 className="text-lg font-bold text-red-600 mb-4">
													All Links
												</h3>
												<ul className="space-y-3">
													{contactDetailsRes?.links?.map(
														(link: string, index: number) => (
															<li key={index}>
																<a
																	href={link}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="flex items-center gap-2 text-blue-600 hover:underline break-all">
																	<FiExternalLink className="text-sm" />
																	{link}
																</a>
															</li>
														)
													)}
												</ul>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>
					</div>
				)}

				{/* Bio Section */}
				{user && (
					<div className="relative border border-gray-200 shadow-2xl p-6 text-base font-medium text-gray-800 bg-slate-100">
						<Link
							href={`/${SetMembershipUrl(membershipType)}/profile/bios`}
							className="absolute right-4 top-4 opacity-70 hover:opacity-100 text-red-600 text-sm flex items-center gap-1">
							<FiEdit className="text-base" />
							<span className="font-semibold">Edit</span>
						</Link>
						<h2 className="text-lg font-bold text-red-600 mb-4">My Bio</h2>
						<div className="grid divide-y divide-gray-300">
							{[
								{ label: "GAINS Profile", slug: "bios" },
								{ label: "My Bio", slug: "bios" },
								{ label: "Tops Profile", slug: "bios" },
								{ label: "Weekly Presentations", slug: "bios" },
							].map((item) => (
								<Link
									key={item.label}
									href={`/${SetMembershipUrl(membershipType)}/profile/${item.slug}`}
									className="flex justify-between items-center px-5 py-4 hover:bg-gray-50">
									<span>{item.label}</span>
									<FiChevronRight className="text-gray-400" />
								</Link>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Business Details Section */}
			{user?.businessDetails && (
				<div className="relative border border-gray-200 shadow-2xl p-6 text-base font-medium text-gray-800 bg-slate-100 h-[610px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
					<Link
						href={`/${SetMembershipUrl(membershipType)}/profile/business-details`}
						className="absolute right-4 top-4 text-red-600 text-sm font-medium flex items-center gap-x-1">
						<FiEdit className="text-base" />
						<span className="font-semibold">Edit</span>
					</Link>

					<h2 className="text-lg font-bold text-red-600 mb-4">
						Business Details
					</h2>

					<div className="space-y-4">
						<InfoRow
							icon={<FiBriefcase />}
							value={`Business Name: ${user.businessDetails.businessName || "—"}`}
						/>
						<InfoRow
							icon={<FiHome />}
							value={`Company Name: ${user.businessDetails.companyName || "—"}`}
						/>

						{membershipType === "VIP" && (
							<InfoRow
								icon={<FiTag />}
								value={`Category ID: ${user.businessDetails.categoryId || "—"}`}
							/>
						)}

						<InfoRow
							icon={<FiList />}
							value={`General Category: ${user.businessDetails.generalCategory || "—"}`}
						/>
						<InfoRow
							icon={<FiTag />}
							value={`Keywords: ${user.businessDetails.keywords || "—"}`}
						/>
						<InfoRow
							icon={<FiAlignLeft />}
							value={`Business Description: ${user.businessDetails.BusinessDescription || "—"}`}
						/>
					</div>

					{user.businessDetails.images?.length > 0 && (
						<div className="mt-6">
							<div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
								<span>Business Images</span>
							</div>
							<div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory">
								{user.businessDetails.images.map(
									(image: string, index: number) => (
										<div
											key={index}
											className="relative flex-shrink-0 w-60 h-60 snap-center rounded-lg border border-gray-300 shadow-sm bg-white overflow-hidden">
											<Image
												src={image}
												alt={`Business image ${index + 1}`}
												fill
												className="object-contain"
											/>
										</div>
									)
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default ProfilePage;

const InfoRow = ({
	icon,
	value,
	verified,
}: {
	icon: React.ReactNode;
	value: string;
	verified?: boolean;
}) => (
	<div className="flex items-start gap-x-3">
		<div className="mt-1">{icon}</div>
		<div className="flex flex-wrap items-center gap-x-2 text-gray-800">
			<span className="break-words">{value}</span>
			{verified !== undefined &&
				(verified ? (
					<RiVerifiedBadgeLine className="text-green-400" />
				) : (
					<GoUnverified className="text-red-600" />
				))}
		</div>
	</div>
);
