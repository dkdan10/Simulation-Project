import Rect from './rect'

// ADD MORE DEFAULT ATTRIBUTES
export class Being extends Rect{
    constructor(size, position) {
        super(size, position)
        this.movePerFrame = 10
    }

    animate (ctx) {
        this.move();
        ctx.fillStyle = "red"
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    move () {

    }

}

export class Food extends Rect {
    constructor(size, position) {
        super(size, position)
        this.eaten = false
    }

    animate (ctx) {
        ctx.fillStyle = "green"
        if (!this.eaten) ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

export const createBeings = (numBeings, size = {width: 20, height: 20}) => {
    
    const beingsArray = []
    while (numBeings > beingsArray.length) {
        const position = createRandomBeingPosition()
        const newBeing = new Being(size, position)
        beingsArray.push(newBeing)
    }

    return beingsArray
}

export const createFood = (amount, size = { width: 10, height: 10 }) => {
    const foodArray = []
    while (amount > foodArray.length) {
        const position = {
            x: Math.floor(Math.random() * 580) + 30,
            y: Math.floor(Math.random() * 360) + 30
        }
        const newFood = new Food(size, position)
        foodArray.push(newFood)
    }
    return foodArray
}



const createRandomBeingPosition = () => {
    switch (Math.floor(Math.random() * 4) ) {
        case 0:
            return {
                x: 0,
                y: Math.floor(Math.random() * 400)
            }
        case 1:
            return {
                x: 620,
                y: Math.floor(Math.random() * 400)
            }
        case 2:
            return {
                x: Math.floor(Math.random() * 620),
                y: 0
            }
        case 3:
            return {
                x: Math.floor(Math.random() * 620),
                y: 400
            }
        default:
            return {x: 0, y: 0}
    }

}