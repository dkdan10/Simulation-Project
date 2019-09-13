export default class Rect {
    constructor(size, position) {
        this.width = size.width;
        this.height = size.height;
        this.position = position
    }

    isOverlappingOtherRect(rectClass) {
        const myBounds = this.getBounds()
        const rect = rectClass.getBounds()
        if (myBounds.left > rect.right || myBounds.right < rect.left) {
            return false;
        }
        if (myBounds.top > rect.bottom || myBounds.bottom < rect.top) {
            return false;
        }
        return true;
    }

    getBounds() {
        return {
            left: this.position.x,
            right: this.position.x + this.width,
            top: this.position.y,
            bottom: this.position.y + this.height
        };
    }

    distanceFromRect(rect) {
        const bounds1 = this.getBounds()
        const bounds2 = rect.getBounds()
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

}

const dist = (x1, y1, x2, y2) => {
    const a = x1 - x2;
    const b = y1 - y2;
    return Math.sqrt(a * a + b * b);
}