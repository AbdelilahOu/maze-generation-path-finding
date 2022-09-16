/////////one of the things that makes me smile 
////////let it finish and then choose a spot 
////////it will find the path to that spot
let canvas  = document.querySelector('canvas')
let context = canvas.getContext('2d')
let cw = canvas.width;
let ch = canvas.height;
let size = 20;
let AllPixels = [];
let Stack = [];
let current = null;
let ItsDone = false
let start = null;
let end = null;
//each cube
function Pixel(x , y) {
    this.x = x
    this.y = y
    this.visited = false
    this.parent;
    this.walls = [true , true , true , true]
    this.draw = function () {
        context.fillStyle = "white"
        context.fillRect(this.x , this.y , size , size)
        if (this.walls[0]) {
            context.beginPath()
            context.strokeStyle = 'black'
            context.moveTo(this.x , this.y)
            context.lineTo(this.x + size , this.y)
            context.stroke()
        }else{
            context.beginPath()
            context.strokeStyle = 'white'
            context.moveTo(this.x , this.y)
            context.lineTo(this.x + size , this.y)
            context.stroke()
        }
        if (this.walls[1]) {
            context.beginPath()
            context.strokeStyle = 'black'
            context.moveTo(this.x + size , this.y)
            context.lineTo(this.x + size , this.y + size)
            context.stroke()
        }else{
            context.beginPath()
            context.strokeStyle = 'white'
            context.moveTo(this.x + size , this.y)
            context.lineTo(this.x + size , this.y + size)
            context.stroke()
        }
        if (this.walls[2]) {
            context.beginPath()
            context.strokeStyle = 'black'
            context.moveTo(this.x + size , this.y + size)
            context.lineTo(this.x , this.y + size)
            context.stroke()
        }else{
            context.beginPath()
            context.strokeStyle = 'white'
            context.moveTo(this.x + size , this.y + size)
            context.lineTo(this.x , this.y + size)
            context.stroke()
        }
        if (this.walls[3]) {
            context.beginPath()
            context.strokeStyle = 'black'
            context.moveTo(this.x , this.y + size)
            context.lineTo(this.x  , this.y)
            context.stroke()
        }else{
            context.beginPath()
            context.strokeStyle = 'white'
            context.moveTo(this.x , this.y + size)
            context.lineTo(this.x  , this.y)
            context.stroke()
        }
    }
    this.neighbours = function () {
        let neighbours = []

        let top    = AllPixels[Index(this.x , this.y - size)]
        let right  = AllPixels[Index(this.x + size , this.y)]
        let left   = AllPixels[Index(this.x - size , this.y)]
        let buttom = AllPixels[Index(this.x , this.y + size)]


        if (top    && !top.visited) {
            neighbours.push(top   )
        }
        if (right  && !right.visited) {
            neighbours.push(right )
        }
        if (buttom && !buttom.visited) {
            neighbours.push(buttom)
        }
        if (left   && !left.visited) {
            neighbours.push(left  )
        }
        
        let neighbourIndex = Math.floor(Math.random()*neighbours.length) 
        
        if (neighbours.length > 0) return neighbours[neighbourIndex]
        
        else return undefined
        
    }
    this.checkNeighbours = function (parent) {
        let top    = AllPixels[Index(this.x , this.y - size)]
        let right  = AllPixels[Index(this.x + size , this.y)]
        let left   = AllPixels[Index(this.x - size , this.y)]
        let buttom = AllPixels[Index(this.x , this.y + size)]
        this.parent = parent

        if (this === end) {
            end.BackTrack()
            return;
        }else{
            if (top && top !== parent) {
                if (!this.walls[0]) top.checkNeighbours(this)
            }
            if (right && right !== parent) {
                if (!this.walls[1]) right.checkNeighbours(this)
            }
            if (buttom && buttom !== parent) {
                if (!this.walls[2]) buttom.checkNeighbours(this)
            }
            if (left && left !== parent) {
                if (!this.walls[3]) left.checkNeighbours(this)
            }
        }
    }
    this.BackTrack = function () {
        if (this !== start) {
            context.beginPath()
            context.strokeStyle = "red"
            context.moveTo(this.x + size/2 , this.y + size/2)
            context.lineTo(this.parent.x + size/2 , this.parent.y + size/2)
            context.stroke()
            this.parent.BackTrack()
        }else{
            console.log("done")
        }
    }
}
//////////////////////////RETURNS THE INDEX OF A CUBE USING ITS CORDS
const Index = (x , y) => {
    if (x > cw || x < 0 || y > ch || y < 0) return -1
    else return (( y / size ) * ch / size) + x / size   
} 
//////////////////////////MAKE ALL THE CUBES
const MakePixels  = () => {
    for (let j = 0; j < cw / size; j++) {
        for (let i = 0; i < ch / size ; i++) {
            AllPixels.push(new Pixel(i * size , j * size))        
        }
    }
    current = AllPixels[0]
}
MakePixels()
///////////////////////////
const MakeTheMaze = () => {
    current.visited = true
    let next = current.neighbours()
    if (next) {
        Stack.push(current)
        next.visited = true
        RemoveWalls(current , next)
        current = next
    }else if (Stack.length > 0) {
        current = Stack.pop()
    }else{
        ItsDone = true
        start = AllPixels[Index(current.x, current.y)]
        context.fillStyle = "red"
        context.fillRect(current.x, current.y , size , size)
        return;
    }
    requestAnimationFrame(MakeTheMaze)
}
//////////////////////////////////////
const RemoveWalls  = (curr , next) => {
    let x = next.x - curr.x
    let y = next.y - curr.y
    if (x == size) {
        curr.walls[1] = false
        next.walls[3] = false
    }else if (x == -size) {
        curr.walls[3] = false
        next.walls[1] = false
    }
    if (y == size) {
        curr.walls[2] = false
        next.walls[0] = false
    }else if (y == -size) {
        curr.walls[0] = false
        next.walls[2] = false
    }
    curr.draw()
    next.draw()
}
///////////////////////////
const MakeTheGrid = () => {
    for (let k = 0; k < AllPixels.length; k++) {
        AllPixels[k].draw()  
    }
    MakeTheMaze()
}
MakeTheGrid()
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
////////////////      2D PART      //////////
function getCursorPosition(canvas , event) {
    const rec = canvas.getBoundingClientRect()
    //turn it into a integer
    x = Math.floor(event.clientX - rec.left)
    y = Math.floor(event.clientY - rec.top)
    //get the position of the cube its is in
    x = Math.floor(x/size)
    y = Math.floor(y/size)

    return { x , y }
}

canvas.addEventListener('mousedown',(e) => {
    if (ItsDone) {
        ItsDone = false
        const { x , y } = getCursorPosition(canvas , e)
        end = AllPixels[Index(x*size , y*size)]
        context.beginPath()
        context.strokeStyle = "red"
        context.moveTo(end.x , end.y)
        context.lineTo(end.x + size , end.y + size)
        context.moveTo(end.x , end.y + size)
        context.lineTo(end.x + size , end.y)
        context.stroke()
        ///////////////////
        FindPath()
    }   
})

const FindPath = () => {
    start.checkNeighbours()
}