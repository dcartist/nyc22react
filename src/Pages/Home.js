import {useEffect} from 'react'
import homapgeImage from "../Components/Images/nycskyline.svg";
import {apiPing} from '../services/api.js';



export default function Home() {
  useEffect(() => {
    apiPing();
  }, []);
  return (
    <div>
      <img src={homapgeImage} alt="NYC Skyline" style={{ width: '70%', height: 'auto' }} />  

    </div>
  )
}
