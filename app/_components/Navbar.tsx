"use client";
import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (!session) {
    return null; // don't render Navbar if not logged in
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-background border-b border-b-primary">
      <NavigationMenu
        viewport={false}
        className="w-full mx-auto container text-foreground py-4 "
      >
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link
                href="/home"
                className="animate__animated animate__fadeIn delay-100"
              >
                Home
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {user?.role === "admin" ? (
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link
                  href="/dashboard"
                  className="animate__animated animate__fadeIn delay-200"
                >
                  Dashboard
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ) : null}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="flex items-center gap-2 animate__animated  animate__fadeIn delay-300">
              <Avatar className="h-5 w-5">
                <AvatarImage src={user?.image ?? "https://github.com/shadcn.png"} />
                <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
              <p>Profile</p>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-4">
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full px-4 py-2 text-start hover:bg-accent cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Logout
                  </Button>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
