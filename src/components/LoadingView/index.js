import { ThreeDots } from 'react-loader-spinner';
import './index.css'

const LoadingView = props => {
  
  return (<div className="loader-container">
    <ThreeDots color={props.color} height={50} width={50} />
  </div>)}


export default LoadingView;
