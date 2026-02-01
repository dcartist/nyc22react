import {useEffect, useState} from 'react'
import homapgeImage from "../Components/Images/nycskyline.svg";
import {apiPing} from '../services/api.js';
import { MDBToast } from 'mdb-react-ui-kit';


export default function Home() {
   const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    apiPing();
  }, []);
  return (
    <div>
       <MDBToast
        color='warning'
        open={isOpen}
        onClose={() => setIsOpen(false)}
        // autohide
        position='top-left'
        delay={2000}
        appendToBody
        headerContent={
          <>
            <strong className='me-auto'>Under Construction</strong>
            <small></small>
            <button
              type='button'
              className='btn-close'
              onClick={() => setIsOpen(false)}
              aria-label='Close'
            ></button>
          </>
        }
        bodyContent='This website is still being developed. It is a work in progress.'
      />
      <img src={homapgeImage} alt="NYC Skyline" style={{ width: '70%', height: 'auto' }} />  

    </div>
  )
}
