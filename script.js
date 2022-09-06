const cnvs = document.getElementById("cnvs")
const ctx = cnvs.getContext('2d')
cnvs.height=innerHeight
cnvs.width=innerWidth
let gravity = 6
let thrust = 12
let timer
let holes = []
let allHoles = []
const gap = 250
let gameOver=false
const holeWidth= 150
class Bird {
	constructor({height, width, position, velocity}){
		this.height=height
		this.width=width
		this.position=position
		this.velocity=velocity
		this.jumping=false
	}
	jump(){
		this.position.y=this.position.y-thrust
	}

	draw(){
		ctx.fillStyle="red"
		ctx.beginPath()
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
	update(){
		if(this.position.y+this.height>=cnvs.height){
			gameOver=true
		}
		const hLeft = holes[0][0]
		const hTop = holes[0][1]
		const bLeft = this.position.x
		const bTop = this.position.y
		if((bLeft+this.width > hLeft &&  (bLeft<=hLeft+holeWidth) ) && (hTop > bTop || bTop+50>hTop+250) ){
			gameOver=true
		}else {
		if(this.jumping)
			this.jump()
		else
			this.position.y+=this.velocity.y+gravity;
		}
		this.draw()
	}
}
const b1 = new Bird({
	height:50,
	width:50,
	position:{
		x:100,
		y:cnvs.height/2 - 50,
	},
	velocity:{
		x:0,
		y:0
	}
})

const sleep = ms => new Promise(r => setTimeout(r, ms))
const jump=async ()=>{
	clearTimeout(timer)
	b1.jumping=true
	timer=setTimeout(()=>{
		b1.jumping=false
	}, 180)
}

class Hole {
	constructor({position}){
		this.height=250
		this.width=150
		this.position=position
		this.velocity={
			x:-4
		}
	}
	draw(){
		ctx.fillStyle="blue"
		ctx.fillRect(this.position.x, 0 , this.width, cnvs.height)
		ctx.fillStyle="#000"
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
	update(){
		this.position.x+=this.velocity.x
		this.draw()
	}
}
const animate = () => {
	ctx.fillStyle="#000"
	ctx.fillRect(0,0,cnvs.width, cnvs.height)
	allHoles.map((hole)=>hole.update())
	holes.map((hole)=>{
		hole[0]=hole[0]-4
	})
	if(holes[0][0] < -holeWidth){
		holes=[...holes.slice(1),newHole([cnvs.width+(4*(gap+holeWidth)), 50+Math.random()*(cnvs.height-300)])]
	}
	b1.update()
	if(!gameOver)
	requestAnimationFrame(animate)
}
const newHole = (data) => {
		const hole = new Hole({
			position:{
				x:data[0],
				y:data[1]
			}
		})
		allHoles=[...allHoles.slice(1), hole]
	return data
}
onload = () => {
	holes=Array(5).fill().map((a,i)=>[cnvs.width+(i*(gap+holeWidth)), 50+Math.random()*(cnvs.height-300)])
	holes.map((val)=>{
		const hole = new Hole({
			position:{
				x:val[0],
				y:val[1]
			}
		})
		allHoles.push(hole)
	})
	animate()
}



