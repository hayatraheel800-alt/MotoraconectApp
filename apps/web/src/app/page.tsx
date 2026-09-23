import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{padding:32,maxWidth:960,margin:"0 auto"}}>
      <h1>Motoraconect</h1>
      <p>Vehicle marketplace — web experience coming online.</p>
      <nav style={{display:"flex",gap:16}}>
        <Link href="/vehicles">Browse vehicles</Link>
        <Link href="/sell">Sell a vehicle</Link>
      </nav>
    </main>
  );
}
