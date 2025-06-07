import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="w-full flex h-screen justify-center items-center flex-col flex-1">
      <h2>Forbidden</h2>
      <p>You are not authorized to access this resource.</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
