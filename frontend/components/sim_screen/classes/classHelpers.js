import Rect from './rect'

// ADD MORE DEFAULT ATTRIBUTES
export class Being extends Rect{
    constructor(size, position) {
        super(size, position)
        this.movePerFrame = 10
        this.closestFood = null
    }

    animate (ctx, foodArray) {
        this.move(foodArray);
        ctx.fillStyle = "red"
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    move (foodArray) {
        if (this.closestFood === null) this.closestFood = this.checkFoodSense(foodArray)
        this.moveTowardsCloseFood()
    }

    moveTowardsCloseFood() {
        if (rectDistance(this, this.closestFood) === 0) return
        const distanceX = this.closestFood.position.x - this.position.x
        const distanceY = this.closestFood.position.y - this.position.y
        const changeX = this.movePerFrame * Math.abs(distanceX / (distanceX + distanceY))
        const changeY = this.movePerFrame * Math.abs(distanceY / (distanceX + distanceY))
        this.position.x = this.position.x > this.closestFood.position.x ? this.position.x - changeX : this.position.x + changeX
        this.position.y = this.position.y > this.closestFood.position.y ? this.position.y - changeY : this.position.y + changeY

        // IF DISTANCE X IS LESS THAN CHANGE X JUST PUT BEING ON FOOD
        if (distanceX < changeX) this.position.x = this.closestFood.position.x
        if (distanceY < changeY) this.position.y = this.closestFood.position.y
    }

    checkFoodSense (foodArray) {
        const closestFood = {food: null, distance: null}
        foodArray.forEach((food) => {
            const currentFoodDist = rectDistance(this, food)
            if (!closestFood.food || Math.abs(currentFoodDist) < Math.abs(closestFood.distance)) {
                closestFood.food = food
                closestFood.distance = currentFoodDist
            }
        })
        return closestFood.food
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

const sortByXCoordFunction = (a, b) => {
    return (a.position.x > b.position.x) ? 1 : (a.position.x < b.position.x) ? -1 : 0
}

const checkCollisionsBeta = (beingArray, foodArray) => {
    // const sortedArray = beingArray.concat(foodArray).sort(sortByXCoordFunction)
    // for (let i = 0; i < sortedArray.length; i++) {
        
    // }
    beingArray.forEach(being => {
        
    });
}

const rectDistance = (rect1, rect2) => {
    const bounds1 = rect1.getBounds()
    const bounds2 = rect2.getBounds()
    const [x1, y1, x1b, y1b] = [bounds1.left, bounds1.top, bounds1.right, bounds1.bottom]
    const [x2, y2, x2b, y2b] = [bounds2.left, bounds2.top, bounds2.right, bounds2.bottom]

    const left = x2b < x1
    const right = x1b < x2
    const bottom = y2b < y1
    const top = y1b < y2

    if (top && left) {
        return dist(x1, y1b, x2b, y2)
    }
    else if (left && bottom) {
        return dist(x1, y1, x2b, y2b)
    }
    else if (bottom && right) {
        return dist(x1b, y1, x2, y2b)
    }
    else if (right && top) {
        return dist(x1b, y1b, x2, y2)
    }
    else if (left) {
        return x1 - x2b
    }
    else if (right) {
        return x2 - x1b
    }
    else if (bottom) {
        return y1 - y2b
    }
    else if (top) {
        return y2 - y1b
    } else {
        return 0
    }
}

const dist = (x1, y1, x2, y2) => {
    const a = x1 - x2;
    const b = y1 - y2;
    return Math.sqrt(a * a + b * b);
}