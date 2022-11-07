import {API} from './'
import { LoadStatus } from '../enums/LoadStatus'

export const api:API = {
    handler: async (cmd:any):Promise<string> => {
        return 'called the Web API'
    },

    init: async () => {
        return LoadStatus.READY
    }
}