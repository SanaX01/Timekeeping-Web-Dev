// app/announcements/page.tsx (or /components/AnnouncementPage.tsx)
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const announcements = [
  {
    id: 1,
    title: "New Feature Release",
    content: "We’ve just launched our new real-time collaboration tool!",
    date: "June 5, 2025",
  },
  {
    id: 2,
    title: "Maintenance Notice",
    content: "Scheduled downtime on June 10 from 12 AM to 4 AM.",
    date: "June 7, 2025",
  },
  {
    id: 3,
    title: "Team Expansion",
    content: "Please welcome our new developers joining this month!",
    date: "June 1, 2025",
  },
  {
    id: 4,
    title: "Team Expansion",
    content: "Please welcome our new developers joining this month!",
    date: "June 1, 2025",
  },
  {
    id: 5,
    title: "Team Expansion",
    content: "Please welcome our new developers joining this month!",
    date: "June 1, 2025",
  },
  {
    id: 6,
    title: "Team Expansion",
    content: "Please welcome our new developers joining this month!",
    date: "June 1, 2025",
  },
  {
    id: 7,
    title: "Team Expansion",
    content: "Please welcome our new developers joining this month!",
    date: "June 1, 2025",
  },
];

export default function AnnouncementPage() {
  const [query, setQuery] = useState("");

  const filtered = announcements.filter(
    (a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 my-24">
      <h1 className="text-3xl font-bold mb-6">📢 Announcements</h1>

      <Input
        placeholder="Search announcements..."
        className="mb-6"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid grid-cols-3 gap-6">
        {filtered.length ? (
          filtered.map(({ id, title, content, date }) => (
            <Card
              key={id}
              className="hover:bg-background "
            >
              <CardHeader>
                <CardTitle className="text-xl">{title}</CardTitle>
                <p className="text-sm text-muted-foreground">{date}</p>
              </CardHeader>
              <CardContent>
                <p>{content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No announcements found.</p>
        )}
      </div>
    </div>
  );
}
