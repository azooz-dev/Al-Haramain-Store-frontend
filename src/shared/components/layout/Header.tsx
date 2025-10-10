import React from "react";
import { Button } from "@shared/components/ui/button";
import { useApp } from "@/shared/contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/slices/authSlice";

export const Header: React.FC = () => {
  const { isRTL, toggleTheme, toggleLanguage } = useApp();
	const navigate = useNavigate();
	const { handleSignOut } = useAuth();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (e.target.innerHTML === "Logout") {
		handleSignOut();
		navigate("/signin");
		} else {
			navigate("/signin");
		}
	}

	return (
		<header className="sticky top-0 z-40 bg-card border-b border-border">
			<div className="container mx-auto py-4">
				<div className="flex items-center justify-between">
					<div className={`flex items-center gap-8 flex-1 ${isRTL ? "ml-3" : "mr-3"}`}>
						<Link
							to="/"
							className="flex items-center cursor-pointer group flex-shrink-0 gap-2 space-x-2 ml-2"
						>
							<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-lg group-hover:scale-105 transition-transform">
								ح
							</div>
							<div className="text-xl text-foreground whitespace-nowrap mx-[3px] my-[0px]">
								Al-Haramain
							</div>
						</Link>
					</div>

					<div className="flex items-center gap-1 flex-shrink-0">
						<div className="hidden md:flex items-center gap-2 mr-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									toggleLanguage();
								}}
								className="h-9 px-3 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
								title={isRTL ? "تغيير اللغة إلى الإنجليزية" : "Change language to Arabic"}
							>
								<span className="text-sm font-medium">{isRTL ? "EN" : "عربي"}</span>
							</Button>

							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									toggleTheme();
								}}
								className="h-9 w-9 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
								title={isRTL ? "تغيير المظهر" : "Toggle theme"}
							>
								<span className="text-sm font-medium">{isRTL ? "🌙" : "☀️"}</span>
							</Button>

							<Button
								variant="ghost"
								size="sm"
								onClick={handleLogout}
								className="h-9 px-3 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
							>
								{isAuthenticated ? "Logout" : "Login"}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};