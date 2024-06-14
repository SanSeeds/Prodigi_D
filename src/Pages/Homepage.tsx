import Navbar from "../components/Global/Navbar"
import ServicesOffered from "../components/Homepage/ServicesOffered"
import Type from "../components/Homepage/Typewriter"

function Homepage(){
    return(
        <>
        <Navbar/>
   
        <span className=" text-center text-xl"><Type/></span> 

        <ServicesOffered/>
        
        </>
    )
}

export default Homepage