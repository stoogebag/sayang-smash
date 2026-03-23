import Link from 'next/link'
export default function Home(){
  return (
    <div style={{padding:20}}>
      <h1>Sayang Smash</h1>
      <p>Landing page</p>
      <Link href="/create"><a>Go to Create Workout</a></Link>
    </div>
  )
}
