import { useState, useEffect, useRef, useLayoutEffect,useReducer } from 'react'

// component that draw  a pong on screen and handle the game logic and interaction 
// from user  input
//

const CanvasPractice = () => {
    const canvasRef = useRef()
    // set frame 'rate' counter
    const [counter, setCounter] = useState(0)
    const [score , setScore] = useState(0)
    const [shouldStop, setShouldStop] = useState(false)
    // box position and speed
    const [positionX, setPositionX] = useState(165)
    const [positionY, setPositionY] = useState(165)
    const [lastKey, setlastKey] = useState('')
	const [playerY, setPlayerY] = useState(165)
    const [dx, setDx] = useState(2)
    const [dy, setDy] = useState(2)
    // update the counter
	let handleKey = (event) => {
		setlastKey(event.key)
	   if (event.key === 'ArrowUp' || event.key === 'k') 
		   setPlayerY(playerY - 15)
	else if (event.key === 'ArrowDown' || event.key === 'j')
		   setPlayerY(playerY + 15)
	}
	//detect collision btw ball and box
	let detectCollision = (box,ball) => {
		if(ball.x + ball.radius >= box.x && ball.x - ball.radius <= box.x + box.width 
			&& ball.y + ball.radius >= box.y && 
			ball.y - ball.radius <= box.y + box.height)
			return true
	}
// if it the ball go out of bound it bounce back
	//futur change to detect if the ball go out of bound
	// and set the score to correct value 
	 let wall_bounceBack = (box,ball) => {
		if (ball.x > box.width + 15)
		{
			setPositionX(box.width / 2)
			setPositionY(box.height / 2)
			setDx(1)
			setDy(0)
			setPlayerY(box.height / 2)
		}
		if (ball.x < 0)
		{
			setPositionX(box.width / 2)
			setPositionY(box.height / 2)
			setDx(-1)
			setDy(0)
			setPlayerY(box.height / 2)
			// inrease score by 1 of the player
			 setScore(score + 1)
		}
		if (ball.y > box.height - 15)
			setDy((Math.random() * -2) * 3)
		if (ball.y < 10)
			setDy((Math.random() * 2) * 3)
	}


// function that draw a tringangle on the canvas

	let drawCanvas = (context,canvas,ball) => {
		// draw score on the canvas
		context.beginPath()
		context.fillStyle = '#555555'
		context.fillRect(0, 0, canvas.width, canvas.height)
		context.fillStyle = '#ffffff'
		context.font = '20px Arial'
		context.fillText(`Bot score: ${score}`, canvas.width - 130, 20, canvas.width)
		context.fillText(`human score: 0`,5, 20, canvas.width)
		context.fill();
		context.closePath()
		context.moveTo(canvas.width / 2, 0)
		context.lineTo(canvas.width / 2, canvas.height)
		context.lineWidth = 5
		context.strokeStyle = '#ffffff'
		context.stroke()
		context.fillStyle = '#ff0000'
		context.strokeStyle = '#ff0000'
		context.beginPath()
		context.arc(ball.x, ball.y,ball.radius, 0, Math.PI * 2, false)
		context.closePath()
		context.fill()
		context.stroke()
		context.fillStyle = '#ff0000'
        context.fillRect(10, ball.playerY - 10 , 20, 20)
		context.fillStyle = '#0000ff'
		context.fillRect(canvas.width - 40, ball.y - 10, 20, 20)
		context.beginPath()



		}
		//should have user input set for the x and y position of the box currently bogus data
	   let collision = (canvas) => {
		if( detectCollision({x:10,y:playerY,width:20,height:20},
							{x:positionX,y:positionY,radius:12}))
		{
			setDy( -dy + (Math.random() * 2))
			setDx( 2)
		}
		if( detectCollision({x:canvas.width - 40,y:positionY - 10,width:20,height:20},
							{x:positionX,y:positionY,radius:12}))
		{
			setDy(-dy + (Math.random() * 2))
			setDx( -2)
		}
	}
    useLayoutEffect(() => {
        if (!shouldStop) {
            let timerId
            const animate = () => {
                setCounter(c => c + 1)
                timerId = requestAnimationFrame(animate)
            }
            timerId = requestAnimationFrame(animate)
            return () => cancelAnimationFrame(timerId)
        }
    }, [shouldStop])

    // output graphics
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
		//without this it would lead to tracing the ball on the canvas
        context.clearRect(0, 0, 350, 350)
		// this create  the animation of the ball fromt the state change
		setPositionX(positionX + dx)
		setPositionY(positionY + dy)
		wall_bounceBack({x:0,y:0,width:350,height:350},{x:positionX,y:positionY,radius:10})
		collision (canvas)
		//output the draw on the canvas
		drawCanvas(context,canvas,{x:positionX,y:positionY,radius:10,playerY:playerY})
		//if the was no change from the counter then stop the animation
    }, [counter])
// that tabindex is the key for the component to be interactive to the user otherwise there no focus
	// and no event will be triggered
	//set score to 0 when the game is restarted
// set half of the screen in red and half in blue
    return (
        <div className='container' tabIndex='1' onKeyDown = {(e) => handleKey(e)}>
            <canvas  ref={canvasRef}width="350px" height="350px"/>
        </div>
    )
}

export default CanvasPractice
