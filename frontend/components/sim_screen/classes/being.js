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
        if (this.closestFood === null || this.closestFood.eaten) this.closestFood = this.checkFoodSense(foodArray)
        if (this.closestFood !== null) this.moveTowardsFood()
    }

    moveTowardsFood() {
        if (this.amountEaten > 0) {
            return
        }

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

}
