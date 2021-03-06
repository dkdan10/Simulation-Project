import { createRandomBeingPosition } from "../components/classes/classHelpers";

export const FINISH_DAY = "FINISH_DAY"

export const finishDay = dayData => {
    const {day, beings} = dayData

    // const {foodAmount, screenSize} = this.props.simConfig
    const deadIds = []
    const babyIds = []
    let numberSurvived = 0
    let totalSpeed = 0
    let topSpeed = 0
    let totalSurvialChance = 0
    let topSurvival = 0

    for (let i = 0; i < beings.length; i++) {
        const being = beings[i];
        // STATS CALULATIONS
        totalSpeed += being.movePerFrame
        if (topSpeed < being.movePerFrame) topSpeed = being.movePerFrame
        totalSurvialChance += being.surviveChance
        if (topSurvival < being.surviveChance) topSurvival = being.surviveChance

        if (!being.isSafe()) {
            deadIds.push(being.id)
        } else {
            being.daysSurvived++
            // Have Baby
            if (being.amountEaten > 1) {
                babyIds.push(being.id)
            }
            // SET BEING STATE HERE
            being.color = "purple"
            being.amountEaten = 0
            being.closestFood = null
            being.position = createRandomBeingPosition(being.size(), being.screenSize)
            numberSurvived++
        }
    }
    // DISPATCH AN ACTION THAT WILL UPDATE STATS FOR BEINGS
    console.log(`Day ${day}: `)
    console.log(`${deadIds.length} Beings did not make it`)
    console.log(`${numberSurvived} Beings survived another day`)
    console.log(`${babyIds.length} Beings being born tomorrow`)
    console.log(`${numberSurvived + babyIds.length} Beings tomorrow`)

    // CREATE NEW FOOD
    // this.food = createFood(foodAmount, screenSize)
    const graphData = {
        day,
        startingPopulation: beings.length,
        endingPopulation: beings.length - deadIds.length,
        averageSpeed: totalSpeed / beings.length,
        topSpeed: topSpeed,
        averageSurvivalChance: totalSurvialChance / beings.length,
        topSurvivalChance: topSurvival,
        numberDead: deadIds.length,
        numberBorn: babyIds.length
    }

    return {
        type: FINISH_DAY,
        graphData,
        deadIds,
        babyIds
    }
}
