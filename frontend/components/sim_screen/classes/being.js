import Rect from './rect'

// ADD MORE DEFAULT ATTRIBUTES
export default class Being extends Rect {
    constructor(size, position) {
        super(size, position)
        this.movePerFrame = 10
        this.closestFood = null
        this.amountEaten = 0
        this.color = "red"
    }

    animate(ctx, foodArray) {
        this.move(foodArray);
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    move(foodArray) {
        // FIND NEW FOOD IF NO FOOD OR YOUR FOOD IS EATEN
        if (this.closestFood === null || this.closestFood.eaten) this.closestFood = this.checkFoodSense(foodArray)
        // GO TO FOOD IF FOOD IS FOUND AND STILL HUNGRY
        if (this.closestFood !== null && this.amountEaten === 0) { 
            this.moveTowardsFood()
        } else if (this.amountEaten > 0) {
            this.goHome()
        }
    }

    moveTowardsFood() {
        // IF ON FOOD
        if (this.distanceFromRect(this.closestFood) === 0) {
            this.eatFood()
        } else {
        // ELSE IF NOT ON FOOD 
            const distanceX = this.closestFood.position.x - this.position.x
            const distanceY = this.closestFood.position.y - this.position.y
            const hypot = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY))
    
            const changeX = this.movePerFrame * distanceX / hypot
            const changeY = this.movePerFrame * distanceY / hypot
            this.position.x = this.position.x + changeX
            this.position.y = this.position.y + changeY
    
            // IF DISTANCE X IS LESS THAN CHANGE X JUST PUT BEING ON FOOD
            if (Math.abs(distanceX) < Math.abs(changeX)) this.position.x = this.closestFood.position.x
            if (Math.abs(distanceY) < Math.abs(changeY)) this.position.y = this.closestFood.position.y
        }
    }
    
    eatFood() {
        this.closestFood.eaten = true
        this.closestFood = null
        this.amountEaten++
        this.color = "green"
    }

    checkFoodSense(foodArray) {
        const closestFood = { food: null, distance: null }
        foodArray.forEach((food) => {
            if (!food.eaten) {   

                const currentFoodDist = this.distanceFromRect(food)
                if (!closestFood.food || Math.abs(currentFoodDist) < Math.abs(closestFood.distance)) {
                    closestFood.food = food
                    closestFood.distance = currentFoodDist
                }
                
            }
        })
        return closestFood.food
    }

    goHome () {
        // FIND CLOSEST EDGE
        const closestX = (this.position.x > 310) ? 620 : 0
        const closestY = (this.position.y > 200) ? 400 : 0
        
        if (Math.abs(this.position.x - closestX) < Math.abs(this.position.y - closestY)) {
            if (closestX === 620) {
                this.position.x += this.movePerFrame
                if(this.position.x > 620) this.position.x = 620
            } else {
                this.position.x -= this.movePerFrame
                if (this.position.x < 0) this.position.x = 0

            }
        } else {
            if (closestY === 400) {
                this.position.y += this.movePerFrame
                if (this.position.y > 400) this.position.y = 400
            } else {
                this.position.y -= this.movePerFrame
                if (this.position.y < 0) this.position.y = 0
            }
        }

    }

}
