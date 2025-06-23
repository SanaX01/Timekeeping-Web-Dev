export async function updateRequestStatus({
  requestId,
  status,
  feedback = "",
}: {
  requestId: string;
  status: "Approved" | "Rejected";
  feedback?: string;
}) {
  const res = await fetch("/api/update-request-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requestId, status, feedback }),
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok) {
    return { success: false, error: result.error };
  }

  return { success: true };
}
