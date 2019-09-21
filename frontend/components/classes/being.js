import Rect from './rect'
import { createRandomBeingPosition } from './classHelpers';

const defaultGeneMutationRate = {
    speed: 0.1,
    surviveChance: 0.1
}

const defaultParentGenes = {
    speed: 4,
    surviveChance: 0.5
}

// ADD MORE DEFAULT ATTRIBUTES
export default class Being extends Rect {
    constructor(size, position, screenSize, parentGenes = defaultParentGenes) {
        super(size, position)
        this.screenSize = screenSize
        this.closestFood = null
        this.id = '_' + Math.random().toString(36).substr(2, 9)

        // MUTATIONS
        let randomPlusMinus = Math.random() < 0.5 ? 1 : -1
        this.movePerFrame = parentGenes.speed + defaultGeneMutationRate['speed'] * randomPlusMinus
        randomPlusMinus = Math.random() < 0.5 ? 1 : -1
        this.surviveChance = parentGenes.surviveChance + defaultGeneMutationRate['surviveChance'] * randomPlusMinus
        this.passedDownSurvive = this.surviveChance
        // SURVIVE CHANCE CAP AT 70% chance
        // if (this.surviveChance > 0.7) this.surviveChance = 0.7
        if (this.surviveChance < 0.5) this.surviveChance = 0.5


        // Chance To Go For Baby
        this.goForBaby = Math.random()
        this.amountEaten = 0

        this.color = "red"
        this.daysSurvived = 0
        this.babiesHad = 0
    }

    size() {
        return {width: this.width, height: this.height}
    }

    animate(ctx, foodArray) {
        if (foodArray) this.move(foodArray);
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    move(foodArray) {
        // FIND NEW FOOD IF NO FOOD OR YOUR FOOD IS EATEN
        if (this.closestFood === null || this.closestFood.eaten) this.closestFood = this.checkFoodSense(foodArray)
        // GO TO FOOD IF FOOD IS FOUND AND STILL HUNGRY
        if (this.closestFood !== null && this.amountEaten === 0) { 
            this.moveTowardsFood()
        } else if (this.amountEaten === 1 && this.goForBaby < 0.8 && this.closestFood!== null) {
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
        this.goForBaby = Math.random()
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
        const rightEdge = this.screenSize.width - this.width
        const bottomEdge = this.screenSize.height - this.height
        // FIND CLOSEST EDGE
        const closestX = (this.position.x > rightEdge / 2) ? rightEdge : 0
        const closestY = (this.position.y > bottomEdge / 2) ? bottomEdge : 0
        
        if (Math.abs(this.position.x - closestX) < Math.abs(this.position.y - closestY)) {
            if (closestX === rightEdge) {
                this.position.x += this.movePerFrame
                if (this.position.x > rightEdge) this.position.x = rightEdge
            } else {
                this.position.x -= this.movePerFrame
                if (this.position.x < 0) this.position.x = 0

            }
        } else {
            if (closestY === bottomEdge) {
                this.position.y += this.movePerFrame
                if (this.position.y > bottomEdge) this.position.y = bottomEdge
            } else {
                this.position.y -= this.movePerFrame
                if (this.position.y < 0) this.position.y = 0
            }
        }

    }

    isSafe () {
        const rightEdge = this.screenSize.width - this.width
        const bottomEdge = this.screenSize.height - this.height
        const didSurvive = (this.amountEaten > 0 && (this.position.x === 0 || this.position.x === rightEdge || this.position.y === 0 || this.position.y === bottomEdge))
        if (didSurvive) {
            return true
        } else {
            if (this.surviveChance > 1) {
                this.surviveChance -= 1
                if (this.surviveChance < 0.3) this.surviveChance = 0.3
                return true
            } else {
                const survived = Math.random() < this.surviveChance
                this.surviveChance = 0.3
                return survived
            }
        }
    }

    haveBaby () {
        const myGenes = {
            speed: this.movePerFrame,
            surviveChance: this.passedDownSurvive
        }
        this.babiesHad++
        const baby = new Being(this.size(), this.position, this.screenSize, myGenes)
        baby.position = createRandomBeingPosition(baby.size(), baby.screenSize)
        return baby
    }

}
