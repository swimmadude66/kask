import {LoggedInGuard} from './logged_in';
import {AdminGuard} from './admin';

export {
    LoggedInGuard,
    AdminGuard
}

export const GUARDS = [
    LoggedInGuard,
    AdminGuard
];
