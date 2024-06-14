import Typewriter from 'typewriter-effect'

function Type(){
    return(
        <Typewriter 
            options={{
                strings: [
                    "lorem1",
                    "lorem2",
                    "Ipsum1",
                    "Ipsum2"
                ],
                autoStart: true,
                loop: true,
                deleteSpeed: 50,
            
            }}
            />
    )

}

export default Type;