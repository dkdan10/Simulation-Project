import Rect from './rect'

export default class Food extends Rect {
    constructor(size, position) {
        super(size, position)
        this.eaten = false
    }

    animate(ctx) {
        ctx.fillStyle = "green"
        if (!this.eaten) ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
