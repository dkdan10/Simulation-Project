export const UPDATE_SIM_CONFIG = "UPDATE_SIM_CONFIG"
export const RESTARTED_SIM = "RESTARTED_SIM"

export const updateSimConfig = (newConfig) => {
    return {
        type: UPDATE_SIM_CONFIG,
        newConfig
    }
}

export const restartedSim = () => {
    return {
        type: RESTARTED_SIM
    }
}