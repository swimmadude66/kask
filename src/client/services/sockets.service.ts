import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

    private rootSocket;

    constructor() {
        this.rootSocket = io();
    }

    onRoot(endpoint: string, handler) {
        this.rootSocket.on(endpoint, handler);
    }

    destroyRoot() {
        this.rootSocket.removeAllListeners();
    }
}
