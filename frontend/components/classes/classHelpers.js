import Being from "./being" 
import Food from "./food"

export const createBeings = (numBeings, screenSize, size = {width: 20, height: 20}) => {
    
    const beingsObj = {}
    for (let i = 0; i < numBeings; i++) {
        const position = createRandomBeingPosition(size, screenSize)
        const newBeing = new Being(size, position, screenSize)
        beingsObj[newBeing.id] = newBeing
    }

    return beingsObj
}

export const createFood = (amount, screenSize, size = { width: 10, height: 10 }) => {
    const foodArray = []
    while (amount > foodArray.length) {
        const position = {
            x: Math.floor(Math.random() * (screenSize.width - 60)) + 30,
            y: Math.floor(Math.random() * (screenSize.height - 60)) + 30
        }
        const newFood = new Food(size, position)
        foodArray.push(newFood)
    }
    return foodArray
}

export const createRandomBeingPosition = (beingSize, screenSize) => {
    switch (Math.floor(Math.random() * 4) ) {
        case 0:
            return {
                x: 0,
                y: Math.floor(Math.random() * (screenSize.height - beingSize.height))
            }
        case 1:
            return {
                x: (screenSize.width - beingSize.width),
                y: Math.floor(Math.random() * (screenSize.height - beingSize.height))
            }
        case 2:
            return {
                x: Math.floor(Math.random() * (screenSize.width - beingSize.width)),
                y: 0
            }
        case 3:
            return {
                x: Math.floor(Math.random() * (screenSize.width - beingSize.width)),
                y: (screenSize.height - beingSize.height)
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