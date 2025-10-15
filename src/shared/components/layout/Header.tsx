import React from "react";
import { Button } from "@shared/components/ui/button";
import { useApp } from "@/shared/contexts/AppContext";
import { Link } from "react-router-dom";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { Badge } from "../ui/badge";
import { Heart } from "lucide-react";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";

export const Header: React.FC = () => {
  const { isRTL, toggleTheme, toggleLanguage } = useApp();
	const { navigateToHome, navigateToSignIn, navigateToFavorites } = useNavigation();
	const { handleSignOut } = useAuth();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const { favoritesCount } = useFavorites();
	const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
		if ((e.target as HTMLButtonElement).innerHTML === "Logout") {
		handleSignOut();
		navigateToHome();
		} else {
			navigateToSignIn();
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
							onClick={navigateToHome}
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
								onClick={() => navigateToFavorites()}
								className="relative w-9 h-9 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
								title={isRTL ? "المفضلة" : "Favorites"}
							>
							<Heart className="h-4 w-4" />
							{isAuthenticated && favoritesCount > 0 && (
							<Badge
								className={`absolute h-4 w-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs flex items-center justify-center p-0 shadow-lg ${
									isRTL ? "-top-1 -left-1" : "-top-1 -right-1"
								}`}
							>
							{favoritesCount > 99 ? "99+" : favoritesCount}
							</Badge>
							)}
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