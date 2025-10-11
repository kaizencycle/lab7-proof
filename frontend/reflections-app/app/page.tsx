import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Reflections App</h1>
      <p>Welcome to Lab7-proof (OAA).</p>
      <p><Link href="/mentor">Go to Mentor</Link></p>
    </main>
  );
}
