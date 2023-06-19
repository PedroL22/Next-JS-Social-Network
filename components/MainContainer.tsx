import { SessionProvider } from 'next-auth/react'
import NavBar from './NavBar'
import Aside from './Aside'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function MainContainer({ children, session }: any) {
  return (
    <>
      <SessionProvider session={session}>
        <NavBar />
        <Aside />
        <div>{children}</div>
        <ToastContainer
          position='top-right'
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
      </SessionProvider>
    </>
  )
}
