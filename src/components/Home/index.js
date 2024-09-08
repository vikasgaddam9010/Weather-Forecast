import {useEffect,useCallback, useState} from 'react'
import {Link} from 'react-router-dom'
import { ImNewTab } from "react-icons/im";

import './index.css'
import Header from "../Header"
import LoadingView from '../LoadingView'

const state = {
    initial:"initial",
    load: "load",
    sucess:"sucess",
    fail:"fail",
}
const state2 = {
    initial2:"initial",
    load2: "load",
    sucess2:"sucess",
    fail2:"fail",
}
const Home = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [citiesList , setCitiesList]= useState([])
    const [sortedCitiesList , setSortedCitiesList]= useState([])
    const [apiState, setapiState] = useState(state.initial)
    const [apiState2, setApiState2] = useState(state2.initial2)
    const [offset, setOffset] = useState(10)
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [notFound, setNotFound] = useState(false)
    const [selectedCity, setSelectedCity] = useState(null)

    const callApi = async () => {
        setapiState(state.load)
        const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${offset}`
        const server = await fetch(url)
        const jsonData = await server.json()
        
        if(server.ok){
            setCitiesList(jsonData.results)
            setapiState(state.sucess)
        }else{
            setapiState(state.fail)
        }
    }    

    const handleScroll = useCallback(() => {
        const a = window.innerHeight + document.documentElement.scrollTop
        const b = document.documentElement.offsetHeight - 5
        const nearBottom = a >= b

        if (nearBottom && apiState2 !== state2.load2) {
            setOffset(prevState => (prevState < 100 ? prevState + 5 : 15)) //as api offset os limited to 100 again offset value is reseted to 15 value
                    }
    }, [apiState2])

    const againCallAPI = useCallback(async () => {
        setApiState2(state2.load2)        
        const url2 = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${offset}`
        try {
            const server = await fetch(url2)
            const r2 = await server.json()
            if (server.ok) {
                setCitiesList(r2.results)
                setApiState2(state2.sucess2)
            } else {
                throw new Error('Failed to fetch')
            }
        } catch (error) {
            setApiState2(state2.fail2)
        }
    }, [offset])

    useEffect(() => {
        callApi()
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    useEffect(() => {
        againCallAPI()
    }, [offset, againCallAPI])

    const handleClick = () => {
        setMenuVisible(false)
    }

    const handleRightClick = (event, city) => {
        event.preventDefault()
        setMenuPosition({ x: event.pageX, y: event.pageY })
        setSelectedCity(city)
        setMenuVisible(true)
    }
    const handleMenuClick = () => {
        if (selectedCity) {
          window.open(`http://localhost:3000/${selectedCity}`, '_blank');
        }
        setMenuVisible(false);
      }
    
    const renderInfinityView = () => {
        switch(apiState2){
            case state2.load2:
                return <LoadingView/>
            case state2.fail2:
                return failedView()    
            default:
        }
    }


    const listView = () => { 
        const list = sortedCitiesList.length > 0 ? sortedCitiesList : citiesList
        
        return (
        <>
            <div style={{display:"flex",textAlign:"center", fontWeight:"800", fontSize:"20px",borderBottom: "2px solid lightgray"}} className='link' >
                <p className='heading width-name'>Sl.No.</p>
                <p className='heading country-name' style={{borderLeft:"0px"}}>City Name</p>
                <p className='heading country-width' style={{borderLeft:"0px"}}>Country Name</p>
                <p className='heading time-zone-width' style={{borderLeft:"0px"}}>Time Zone</p>
            </div> 
                
            <ul style={{listStyleType:"none",textAlign:"center", padding:"0px", margin: "0px 0px 150px 0px"}}>
               
                { 
                    list.map((each, index) =>
                        <li onContextMenu={(event) => handleRightClick(event, each.name)} className='link'  style={{display:"flex", borderBottom: "2px solid lightgray",}} key={each.name}>                   
                            <p className='heading width-name'>{index+1}.</p>
                            <div onClick={handleClick}>                              
                                    <Link to={`/${each.name}`}  onContextMenu={handleRightClick} className='link'>
                                        <p className='heading  country-name' style={{borderLeft:"0px",}} >{each.name}</p>
                                    </Link>
                            </div>                                                    
                            <p className='heading country-width'  style={{borderLeft:"0px",}}>{each.cou_name_en}</p>
                            <p className='heading time-zone-width'  style={{borderLeft:"0px",}}>{each.timezone}</p>
                        </li>

                    )
                }
                {renderInfinityView()}
            </ul>
            {menuVisible && (
                <ul
                style={{
                    cursor:"pointer",
                    position: 'absolute',
                    top: menuPosition.y,
                    left: menuPosition.x,
                    backgroundColor: 'white',
                    border: 'none',
                    listStyle: 'none',
                    borderRadius:"10px",
                    padding:"8px 15px"
                }}
                >
                <li onClick={handleMenuClick} style={{color:"#00bbff", display:"flex",alignItems:"center"}}><p style={{margin:"0px 10px 0px 0px"}}>Open {selectedCity} in new tab</p><ImNewTab/></li>
                </ul>
            )}
        </>
        
    )}

    const sucessView = () => {            
        return(notFound ? (failedView("Please try With Different Key"))  : (listView()) )       
    }

    const failedView = (text) => (
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <img className='data-not-found-img' src="https://res.cloudinary.com/dysqgk8ph/image/upload/v1725790101/No_data-amico_ri4phx.png" alt="no-data"/>
            <h1 style={{color:"#FFFFFF"}}>{text}</h1>
        </div>
    )

    const renderviewBasedOnAPIState = () => {
        switch(apiState){
            case state.load:
                return <LoadingView color="#FFFFFF"/>
            case  state.sucess:
                return sucessView()   
            case state.fail:
                return failedView("Server Side Error")
            default:        
        }
    }

    const handleSearchQuery = async e => {
        const text = e.target.value

        setSearchQuery(text)
        const sorted = citiesList.filter(each => each.name.toLowerCase().includes(text.toLowerCase()))
        setSortedCitiesList(sorted)
        if(sorted.length === 0){
            setNotFound(true)
        }else{
            setNotFound(false)
        }
    }

    return (
        <>
            <Header color="#FFFFFF" bgColor="#7e93a8"/>
            <div className="home-container">
                <h1 style={{color:"#FFFFFF", marginBottom:"20px"}}>Search by State</h1>
                <input onChange={handleSearchQuery} value={searchQuery} className="search-input" type="text" placeholder="Search by City Name..."/>
                {renderviewBasedOnAPIState()}
            </div>
        </>
    )
}

export default Home
