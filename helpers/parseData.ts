import type { Documentation } from "typedoc-nextra"
import baseUrl from "../constants/baseUrl";

export interface Data {
    type: "classes"|"functions"|"types"|"properties";
    name: string;
    url: string;
    description?: string;
}

const map = new Map<
    "extractor"|"equalizer"|"discord-player"|"ffmpeg"|"opus"|"utils"|"downloader",
    Array<Data>
>()

export function parseData (docs: Documentation) {
    const objectKeys = Object.keys(docs.modules)

    for(const key of objectKeys) {
        const replacement = key.replace("@discord-player/", "") as "extractor"|"equalizer"|"discord-player"|"ffmpeg"|"opus"|"utils"|"downloader"

        const dataArr = Object.keys(docs.modules[key]).filter(e => e !== "name") as ("classes"|"functions"|"types")[]

        const arr: Array<Data> = []

        for(let d of dataArr) {
            const data = docs.modules[key][d]

            if(d === "classes") {
                const arrData = data.map((e) => {
                    // @ts-ignore
                    const methods = e.data.methods as Array<any>
                    // @ts-ignore
                    const properties = e.data.properties as Array<any>

                    arr.push(...methods.map((m) => {
                        return {
                            type: "functions",
                            name: `${e.data.name}#${m.name}`,
                            url: `${baseUrl}/${encodeURIComponent(key)}/class/${e.data.name}?scrollTo=fm-${m.name}`,
                            description: m.description
                        } as Data
                    }))

                    arr.push(...properties.map((m) => {
                        return {
                            type: "properties",
                            name: `${e.data.name}#${m.name}`,
                            url: `${baseUrl}/${encodeURIComponent(key)}/class/${e.data.name}?scrollTo=p-${m.name}`,
                            description: m.description
                         } as Data
                    }))

                    return {
                        type: "classes",
                        name: e.data.name,
                        url: `${baseUrl}/${encodeURIComponent(key)}/class/${e.data.name}`,
                        //@ts-ignore
                        description: e.data.description ?? e.data.constructor?.description
                    } as Data
                })

                arr.push(...arrData)
            }

            if(d === "functions") {
                arr.push(...data.map((e) => {
                    return {
                        type: "functions",
                        name: e.data.name,
                        url: `${baseUrl}/${encodeURIComponent(key)}/function/${e.data.name}`,
                        description: e.data.description
                    } as Data
                }))
            }

            if(d === "types") {
                arr.push(...data.map((e) => {
                    return {
                        type: "types",
                        name: e.data.name,
                        url: `${baseUrl}/${encodeURIComponent(key)}/type/${e.data.name}`,
                        description: e.data.description
                    } as Data
                }))
            }

            map.set(replacement, arr)
        }
    }

    return map
}