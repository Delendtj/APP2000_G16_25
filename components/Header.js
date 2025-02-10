//DL
import Link from 'next/link'

export default function Header(){
    return(
<header>
      <h1>Discgolf</h1>
      <nav>
        <ul>
          <li><Link href="/">Sporten</Link></li>
          <li><Link href="/spill">Spill</Link></li>
          <li><Link href="/klubber">Klubber</Link></li>
          <li><Link href="/banesok">Banesøk</Link></li>
          <li><Link href="/registrer">Registrer deg</Link></li>
          <li><Link href="/logginn">Logg Inn</Link></li>
        </ul>
      </nav>
    </header>
);}