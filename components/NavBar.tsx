import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function NavBar() {
  const { data: session }: any = useSession()

  if (session) {
    return (
      <nav className='fixed h-16 w-screen bg-blue-700'>
        <div className='mx-auto flex w-screen max-w-7xl justify-between p-5'>
          <Link href='/'>
            <h1 className='cursor-pointer whitespace-nowrap font-medium text-white transition-all duration-75 ease-in hover:text-gray-200'>
              Next JS Social Network
            </h1>
          </Link>
          <div className='flex'>
            <div className='dropdown-end dropdown -mt-3'>
              <label
                tabIndex={0}
                className='btn-ghost btn-circle avatar btn'
              >
                <div className='rounded-full'>
                  <Image
                    src={session.user.image}
                    width={48}
                    height={48}
                    alt='profile picture'
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className='menu-compact dropdown-content menu rounded-box mt-3 w-52 bg-base-100 p-2 shadow'
              >
                <li>
                  <Link
                    href='/account'
                    className='justify-between'
                  >
                    Profile
                  </Link>
                </li>

                <li>
                  <a onClick={signOut as any}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    )
  } else {
    return (
      <nav className='fixed mb-10 h-16 w-screen bg-blue-700'>
        <div className='mx-auto flex w-screen max-w-7xl justify-between p-5'>
          <Link href='/'>
            <h1 className='cursor-pointer font-medium text-white transition-all duration-75 ease-in hover:text-gray-200'>
              Next JS Social Network
            </h1>
          </Link>
          <button
            onClick={signIn as any}
            className='cursor-pointer font-medium text-white transition-all duration-75 ease-in hover:text-gray-200'
          >
            Login
          </button>
        </div>
      </nav>
    )
  }
}
