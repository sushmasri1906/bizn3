import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma, { PriorityType } from "@repo/db/client"; // adjust path
import { authOptions } from "../../../../lib/auth";

export const GET = async () => {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const referrals = await prisma.referral.findMany({
			where: {
				receiverId: session.user.id,
			},
			include: {
				creator: {
					select: {
						id: true,
						firstname: true,
						lastname: true,
						phone: true,
						profileImage: true,
					},
				},
			},
		});

		return NextResponse.json(
			{ success: true, data: referrals },
			{ status: 201 }
		);
	} catch (err) {
		console.error("Error fetching referral:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
};

export const POST = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user?.id || !session.user?.homeClub) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();

		const {
			receiverId,
			type, // SELF | THIRD_PARTY
			businessDetails,
			phone,
			Email,
			thirdPartyDetails, // only if THIRD_PARTY
			comments,
			priority,
		} = body;

		if (priority && !Object.values(PriorityType).includes(priority)) {
			return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
		}

		if (!receiverId || !type) {
			return NextResponse.json(
				{ error: "receiverId and type are required" },
				{ status: 400 }
			);
		}
		const isReceiverMember = await prisma.user.findFirst({
			where: {
				id: receiverId,
			},
		});

		if (!isReceiverMember) {
			return NextResponse.json(
				{ error: "Receiver is not a member of your club" },
				{ status: 400 }
			);
		}

		if (type === "THIRD_PARTY" && !thirdPartyDetails) {
			return NextResponse.json(
				{ error: "thirdPartyDetails required for THIRD_PARTY" },
				{ status: 400 }
			);
		}

		const referral = await prisma.referral.create({
			data: {
				type,
				creatorId: session.user.id,
				receiverId,
				businessDetails,
				phone,
				Email,
				thirdPartyDetails,
				comments,
				updates: [],
				priority,
			},
		});

		return NextResponse.json(
			{ success: true, data: referral },
			{ status: 201 }
		);
	} catch (err) {
		console.error("Error creating referral:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
};
