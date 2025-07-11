"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserMembershipType } from "@prisma/client";
import { useEffect, useState } from "react";

const Upgrade = () => {
	const router = useRouter();
	const [routerUrl, setRouterUrl] = useState("/");
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "loading") return; // Wait until session is ready

		if (status === "unauthenticated") {
			router.push("/login");
			return;
		}

		if (session) {
			if (session.user) {
				if (!session.user.businessId || !session.user.homeClub) {
					setRouterUrl("/register");
					return;
				}
				switch (session.user.membershipType) {
					case UserMembershipType.VIP:
						setRouterUrl("/vip/dashboard");
						break;
					case UserMembershipType.GOLD:
						setRouterUrl("/gold/upgrade");
						break;
					case UserMembershipType.FREE:
						setRouterUrl("/free/upgrade");
						break;
					default:
						router.push("/login");
				}
			}
		}
	}, [status, session, router]);

	return (
		<button
			onClick={() => router.push(routerUrl)}
			className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors text-sm font-medium">
			Upgrade
		</button>
	);
};

export default Upgrade;
