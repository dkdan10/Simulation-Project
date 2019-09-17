export const FINISH_DAY = "FINISH_DAY"

export const finishDay = (dayData) => {
    return {
        type: FINISH_DAY,
        dayData
    }
}
