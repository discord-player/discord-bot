import type { Express, Response } from "express";
import { TypedEmitter } from "tiny-typed-emitter"
import chalk from "chalk"
import { InteractionType, type APIInteraction, APIApplicationCommandInteraction, InteractionResponseType, APIApplicationCommandAutocompleteInteraction } from "discord-api-types/v10"
import { Documentation } from "typedoc-nextra";
import requestDPDocs from "./requestDocs";
import { verifyKeyMiddleware } from "discord-interactions";
import "dotenv/config"

const baseUrl = "https://discord-player.js.org/docs"

export enum Events {
    Ready = "ready",
    InteractionCreate = "interactionCommand"
}

export interface Data {
    type: "classes"|"functions"|"types"|"properties";
    name: string;
    url: string;
    description?: string;
}

export interface TypedEvents {
    ready: (port: number) => Promise<any> | any;
    interactionCommand: (interaction: APIApplicationCommandInteraction, res: Response) => Promise<any> | any;
    interactionAutoComplete: (interaction: APIApplicationCommandAutocompleteInteraction, res: Response) => Promise<any> | any;
}

export class Client extends TypedEmitter<TypedEvents> {
    public router: Express
    token!: string

    constructor(app: Express) {
        super()
        this.router = app;
        (async () => {
            globalThis.docsRawData = await requestDPDocs()
            
            const objectKeys = Object.keys(globalThis.docsRawData.modules)

            if(!globalThis.docsParsedData) globalThis.docsParsedData = new Map<"extractor"|"equalizer"|"discord-player"|"ffmpeg"|"opus"|"utils"|"downloader", Data[]>()

            for(const key of objectKeys) {
                const replacement = key.replace("@discord-player/", "") as "extractor"|"equalizer"|"discord-player"|"ffmpeg"|"opus"|"utils"|"downloader"
        
                const dataArr = Object.keys(globalThis.docsRawData.modules[key]).filter(e => e !== "name") as ("classes"|"functions"|"types")[]
        
                const arr: Array<Data> = []
        
                for(let d of dataArr) {
                    const data = globalThis.docsRawData.modules[key][d]
        
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
                        arr.push(...data.map((e: any) => {
                            return {
                                type: "functions",
                                name: e.data.name,
                                url: `${baseUrl}/${encodeURIComponent(key)}/function/${e.data.name}`,
                                description: e.data.description
                            } as Data
                        }))
                    }
        
                    if(d === "types") {
                        arr.push(...data.map((e: any) => {
                            return {
                                type: "types",
                                name: e.data.name,
                                url: `${baseUrl}/${encodeURIComponent(key)}/type/${e.data.name}`,
                                description: e.data.description
                            } as Data
                        }))
                    }
        
                    globalThis.docsParsedData.set(replacement, arr)
                }

                this.debug("Data cached")
            }
        })()
    }
    
    debug(message: string) {
        const [left, right] = [chalk.blue("[ "), chalk.blue(" ] ")]

        const msg = left + "debug" + right + chalk.gray(message)

        console.log(msg)
    }

    login(publicKey: string, token: string, port = process.env.PORT || 3000) {
        const app = this.router
        this.token = token

        app.use(verifyKeyMiddleware(publicKey))

        app.post("/interactions", async (req, res) => {
            const body = req.body as APIInteraction
            const { type } = body

            if(type === InteractionType.Ping) {
                res.json({
                    type: InteractionResponseType.Pong
                })
            }

            if(type === InteractionType.ApplicationCommand) {
                this.emit("interactionCommand", body, res)
            }

            if(type === InteractionType.ApplicationCommandAutocomplete) {
                this.emit("interactionAutoComplete", body, res)
            }
        })

        this.router.listen(port, () => this.emit("ready", typeof port === "string" ? parseInt(port) : port))
    }
}