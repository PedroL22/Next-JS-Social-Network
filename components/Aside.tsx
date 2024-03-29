import { GrLinkedinOption } from 'react-icons/gr'
import { AiFillGithub, AiOutlineTwitter } from 'react-icons/ai'

export default function Aside() {
  return (
    <aside className='fixed bottom-1 md:right-24 md:mt-24 xl:right-24 xl:mt-24'>
      <div className='block justify-around pb-6 '>
        <a
          href='https://www.linkedin.com/in/pedrolucena22/'
          target='_blank'
          rel='noreferrer'
        >
          <GrLinkedinOption
            className='text-[#00639c]'
            size={50}
          />
        </a>
        <a
          href='https://github.com/PedroL22/'
          target='_blank'
          rel='noreferrer'
        >
          <AiFillGithub
            className='text-black dark:text-white'
            size={50}
          />
        </a>
        <a
          href='https://twitter.com/lucena_l22/'
          target='_blank'
          rel='noreferrer'
        >
          <AiOutlineTwitter
            className='text-[#1d9bf0]'
            size={50}
          />
        </a>
      </div>
    </aside>
  )
}
