import {useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import { MdLightMode } from "react-icons/md";
import { FiSunrise, FiCloudDrizzle  } from "react-icons/fi";
import { LuSunset } from "react-icons/lu";
import { WiHumidity } from "react-icons/wi";
import { LiaWindSolid, LiaCompressArrowsAltSolid } from "react-icons/lia";
import { FaTemperatureArrowUp, FaTemperatureArrowDown } from "react-icons/fa6";
import { IoRainy, IoPartlySunnySharp } from "react-icons/io5";
import { PiCloudFogLight } from "react-icons/pi";
import { FaSkyatlas } from "react-icons/fa";



import Header from '../Header'
import LoadingView from '../LoadingView'
import './index.css'

const state = {
    initial:"initial",
    load: "load",
    success:"success",
    fail:"fail",
}

const EachCity = () => {
    const [citytWeatherDetails, setCityWeatherDetails] = useState({})
    const [apiState, setApiState] = useState(state.initial)  
    const {cityname} = useParams()  

    const apiCallForCityWeatherDetails = async () => {
        setApiState(state.load)  
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&APPID=484620e587f443fa31ba24df3f8be3ce`
        const server = await fetch(url)
        console.log(server)
        const jsonData = await server.json()
        if(server.ok){
            setCityWeatherDetails(jsonData)
            setApiState(state.success)
        }else{
            setApiState(state.fail)
        }        
    }
    useEffect(() => {        
        apiCallForCityWeatherDetails()
    }, [])

    const convertToTIme = date => {
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');
        return {hours, minutes, seconds}
    } 
    
    const renderSuccessView = () => {
        const timestamp = citytWeatherDetails.dt;
        const date = new Date(timestamp * 1000)
        const getCityTime = convertToTIme(date)
        const formatted = `${getCityTime.hours}:${getCityTime.minutes}:${getCityTime.seconds}`

        const sunriseTimeStamp = citytWeatherDetails.sys.sunrise
        const sunriseDateTimeStamp = new Date(sunriseTimeStamp * 1000)
        const getCityTimeSunriseDateTimeStamp = convertToTIme(sunriseDateTimeStamp)
        const formattedSunriseDateTimeStamp = `${getCityTimeSunriseDateTimeStamp.hours}:${getCityTimeSunriseDateTimeStamp.minutes}`
        
        const sunsetTimeStap = citytWeatherDetails.sys.sunset
        const sunsetDateTimeStamp = new Date(sunsetTimeStap*1000)
        const getCityTimeSunsetDateTimeStamp = convertToTIme(sunsetDateTimeStamp)
        const formattedSunsetDateTimeStamp = `${getCityTimeSunsetDateTimeStamp.hours}:${getCityTimeSunsetDateTimeStamp.minutes}`

        const {main} = citytWeatherDetails.weather[0]
        
        let mainWeather
        if("clear".includes(main.toLowerCase())){
            mainWeather = <FaSkyatlas className='icon'/>
        }else if("cloudy".includes(main.toLowerCase())){
            mainWeather = <IoRainy className='icon'/>
        }else if("fog".includes(main.toLowerCase())){
            mainWeather = <PiCloudFogLight  className='icon'/>
        }else if("summer".includes(main.toLowerCase())){
            mainWeather = <IoPartlySunnySharp className='icon'/>
        }else if("drizzle".includes(main.toLowerCase())){
            mainWeather = <FiCloudDrizzle  className='icon'/>
        }else{
            mainWeather = <MdLightMode className='icon'/>
        }

        const dark = `https://res.cloudinary.com/dysqgk8ph/image/upload/v1725817572/dark_Preview-transformed_ipmfvm.jpg`
        const day = `https://res.cloudinary.com/dysqgk8ph/image/upload/v1725817742/AdobeStock_812087044_Preview_1_alqsem.jpg`
        const image = getCityTime.hours > 6 && getCityTime.hours < 18? day : dark

        return (
            <div style={{padding: "30px"}}>
                <div className='each-city-container' style={{backgroundImage: `url('${image}')`,cursor:"pointer"}}>
                    <div>
                    {mainWeather}
                    <div style={{display:"flex",height: "70px"}}>
                        <p style={{fontSize:"40px", margin:"0px"}}>{(citytWeatherDetails.main.temp - 273.15).toFixed(1)}</p>
                        <img src={`http://openweathermap.org/img/wn/${citytWeatherDetails.weather[0].icon}.png`} alt={citytWeatherDetails.weather[0].description} style={{height:"20px", marginTop:"10px"}}/>
                    </div>    
                    <p style={{margin:"0px 0px 10px 0px"}}>{citytWeatherDetails.weather[0].description}</p>
                    <p style={{fontSize:"20px", margin:"0px 10px 0px 0px"}}>{citytWeatherDetails.name}</p>
                    </div>
                    <div style={{textAlign:"end"}}>
                        <p style={{ margin:"0px 10px 0px 0px"}}>Time</p>
                        <p style={{fontSize:"20px", margin:"10px 0px 0px 0px"}}>{formatted}</p>
                    </div>
                </div>
                <div style={{display:"flex"}}>
                    <div style={{border:"2px solid lightsalmon", borderRadius:"10px", padding:"20px 30px", minWidth:"300px", width:"30%"}}>
                        <ul className='each-city-ul' style={{textAlign:"center"}}>
                            <li key="sunrise" style={{margin:"auto", width:"150px"}}><FiSunrise style={{fontSize:"40px", color:"lightsalmon"}}/><p style={{fontWeight:"500"}}>Sunrise at <span style={{fontWeight:"800"}}>{formattedSunriseDateTimeStamp}</span> </p></li>
                            <hr/>
                            <li key="sunset" style={{margin:"auto", width:"150px"}}><LuSunset style={{fontSize:"40px", color:"lightsalmon"}}/><p style={{fontWeight:"500"}}>Sunrise at <span style={{fontWeight:"800"}}>{formattedSunsetDateTimeStamp}</span></p></li>
                        </ul>
                        <ul className='each-city-ul' style={{textAlign:"center"}}>
                            <li key="sunrise"  style={{margin:"auto", width:"150px"}}><WiHumidity style={{fontSize:"40px", color:"lightsalmon"}}/><p style={{fontWeight:"500"}}>Humidity is <span style={{fontWeight:"800"}}>{citytWeatherDetails.main.humidity}</span></p></li>
                            <hr/>
                            <li key="sunset" style={{margin:"auto", width:"150px"}}><LiaWindSolid style={{fontSize:"40px", color:"lightsalmon"}}/><p style={{fontWeight:"500"}}>Speed is <span style={{fontWeight:"800"}}>{citytWeatherDetails.wind.speed}</span></p></li>
                        </ul>
                        
                        <p style={{textAlign:"end"}}>Time formats are in <span style={{fontWeight:"800"}}>UTC</span></p>
                    </div>
                    <div style={{border:"2px solid lightsalmon", margin:"0px 30px", borderRadius:"10px", padding:"20px 30px", minWidth:"300px",  width:"30%"}}>
                        <ul className='each-city-ul' style={{textAlign:"center"}}>
                            <li key="sunrise" style={{margin:"auto", width:"150px"}}><FaTemperatureArrowUp style={{fontSize:"40px", color:"lightsalmon"}}/><p style={{fontWeight:"500"}}>Max. Temp <span style={{fontWeight:"800"}}>{(citytWeatherDetails.main.temp_max - 273.15).toFixed(1)}</span> </p></li>
                            <hr/>
                            <li key="sunset" style={{margin:"auto", width:"150px"}}><FaTemperatureArrowDown style={{fontSize:"40px", color:"lightsalmon"}}/><p style={{fontWeight:"500"}}>Min. Temp <span style={{fontWeight:"800"}}>{(citytWeatherDetails.main.temp_min - 273.15).toFixed(1)}</span></p></li>
                        </ul>
                        <ul className='each-city-ul' style={{textAlign:"center", marginTop:"20px"}}>
                            <li key="sunrise"  style={{margin:"auto", marginTop:"30px", width:"150px"}}><LiaCompressArrowsAltSolid style={{fontSize:"40px", color:"lightsalmon"}}/><p style={{fontWeight:"500"}}>Pressure is <span style={{fontWeight:"800"}}>{citytWeatherDetails.main.pressure}</span></p></li>
                        </ul>
                    </div>
                    <div style={{border:"2px solid lightsalmon", borderRadius:"10px", padding:"20px 30px", minWidth:"300px", width:"30%"}}>
                        <ul className='each-city-ul' style={{textAlign:"center"}}>
                            <li key="sunrise" style={{margin:"auto", width:"150px"}}><FiSunrise style={{fontSize:"40px", color:"lightsalmon"}}/><p style={{fontWeight:"500"}}>Sunrise at <span style={{fontWeight:"800"}}>{formattedSunriseDateTimeStamp}</span> </p></li>
                            <hr/>
                            <li key="sunset" style={{margin:"auto", width:"150px"}}><LuSunset style={{fontSize:"40px", color:"lightsalmon"}}/><p style={{fontWeight:"500"}}>Sunrise at <span style={{fontWeight:"800"}}>{formattedSunsetDateTimeStamp}</span></p></li>
                        </ul>
                        <ul className='each-city-ul' style={{textAlign:"center"}}>
                            <li key="sunrise"  style={{margin:"auto", width:"150px"}}><WiHumidity style={{fontSize:"40px", color:"lightsalmon"}}/><p style={{fontWeight:"500"}}>Humidity is <span style={{fontWeight:"800"}}>{citytWeatherDetails.main.humidity}</span></p></li>
                            <hr/>
                            <li key="sunset" style={{margin:"auto", width:"150px"}}><LiaWindSolid style={{fontSize:"40px", color:"lightsalmon"}}/><p style={{fontWeight:"500"}}>Speed is <span style={{fontWeight:"800"}}>{citytWeatherDetails.wind.speed}</span></p></li>
                        </ul>
                        
                        <p style={{textAlign:"end"}}>Time formats are in <span style={{fontWeight:"800"}}>UTC</span></p>
                    </div>
                </div>                
            </div>
        )
    }

    const renderFailedView = () => (
        <button onClick={() => apiCallForCityWeatherDetails()}>Retry</button>
    )
    const getStateBasedView = () => {
        switch (apiState){
            case state.load:
                return <LoadingView color="lightsalmon"/>
            case state.success:
                return renderSuccessView()
            case state.fail:
                return renderFailedView()
            default:           
        }
    }
    
    return (
        <>
        <Header color="#FFFFFF" bgColor="#7e93a8"/>
        {getStateBasedView()}
        </>        
    )
}

export default EachCity