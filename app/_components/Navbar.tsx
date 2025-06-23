// app/_components/Navbar.tsx (no "use client")
import Link from "next/link";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import SignOutButton from "./SignOutButton";
import { getLeaveBalanceByEmail } from "@/lib/getLeaveBalance";
import OvertimeForm from "./OvertimeForm";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session) return null;

  const leaveData = await getLeaveBalanceByEmail(user?.email as string);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-background border-b border-b-primary ">
      <NavigationMenu
        viewport={false}
        className="w-full mx-auto container text-foreground py-4"
      >
        <NavigationMenuList className="animate__animated animate__fadeInDown">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/home">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {/* <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/announcements">Announcements</Link>
            </NavigationMenuLink>
          </NavigationMenuItem> */}
          {user?.role === "admin" && (
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/dashboard">Dashboard</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}

          <NavigationMenuItem>
            <NavigationMenuTrigger className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={user?.image} />
                <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
              <p>Profile</p>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-4">
                {user?.role === "user" ? (
                  <NavigationMenuLink
                    asChild
                    className="text-center"
                  >
                    <Link href="/OTRequests">OT File Requests</Link>
                  </NavigationMenuLink>
                ) : (
                  <li>
                    <OvertimeForm />
                  </li>
                )}
                <li>
                  <SignOutButton />
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
