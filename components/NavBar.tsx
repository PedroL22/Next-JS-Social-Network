import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session }: any = useSession();

  if (session) {
    return (
      <nav className="fixed h-16 bg-blue-700 w-screen">
        <div className="flex mx-auto max-w-7xl justify-between p-5 w-screen">
          <Link href="/">
            <h1 className="text-white font-medium cursor-pointer whitespace-nowrap hover:text-gray-200 transition-all ease-in duration-75">
              Next JS Social Network
            </h1>
          </Link>
          <div className="flex">
            <div className="dropdown dropdown-end -mt-3">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="rounded-full">
                  <Image
                    src={session.user.image}
                    width={48}
                    height={48}
                    alt="profile picture"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href="/account" className="justify-between">
                    {session.user.name}
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
    );
  } else {
    return (
      <nav className="fixed h-16 bg-blue-700 mb-10 w-screen">
        <div className="flex mx-auto max-w-7xl justify-between p-5 w-screen">
          <Link href="/">
            <h1 className="text-white font-medium cursor-pointer hover:text-gray-200 transition-all ease-in duration-75">
              Next JS Social Network
            </h1>
          </Link>
          <button
            onClick={() => signIn}
            className="text-white font-medium cursor-pointer hover:text-gray-200 transition-all ease-in duration-75"
          >
            Login
          </button>
        </div>
      </nav>
    );
  }
}
