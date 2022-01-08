import { DiversITUser } from 'src/app/models/users.model';
import { BehaviorSubject, Observable } from "rxjs";
import { Timestamp } from 'firebase/firestore';

export class ObserversServiceStub {
    get getCurrentUserStatus(): Observable<DiversITUser> {
        return new BehaviorSubject<DiversITUser>({
            uid: 'dummyUID',
            creationTime: Timestamp.now(),
            lastLoggedIn: Timestamp.now(),
            firstname: 'Max',
            lastname: 'Mustermann',
            role: 3,
            email: 'max@mustermann.com',
            gender: 'Männlich',
            photoURL: '',
            job: '',
            primaryEducation: '',
            secondaryEducation: '',
            universityEducation: '',
        }).asObservable();
    }
}