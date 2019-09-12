export const UPDATE_SIM_CONFIG = "UPDATE_SIM_CONFIG"

export const updateSimConfig = (newConfig) => {
    return {
        type: UPDATE_SIM_CONFIG,
        newConfig
    }
}