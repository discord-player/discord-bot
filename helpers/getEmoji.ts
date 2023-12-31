import { Data } from "./parseData";

export function getEmoji(type: Data['type']) {
    switch(type) {
        case "classes":
            return "\📚"
            
        case "functions":
            return "\🔧"

        case "properties":
            return "\⭕"

        case "types":
            return "\🗝️"
    }
}