import './index.css'

const Header = props =>  (  
    <header style={{backgroundColor:props.bgColor}} className="header">
      <div style={{color:`${props.color}`, }}  className="logo">WeatherNow</div>
    </header>
)

export default Header