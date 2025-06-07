import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="max-w-md w-full text-center shadow-xl border border-destructive/30">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <ExclamationTriangleIcon className="w-10 h-10 text-destructive" />
          <h2 className="text-2xl font-semibold">403 – Forbidden</h2>
          <p className="text-muted-foreground">You are not authorized to access this resource.</p>
          <Button
            variant="destructive"
            asChild
          >
            <Link href="/">Return Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
