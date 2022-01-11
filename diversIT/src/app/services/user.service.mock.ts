import { DiversITUser } from "../models/users.model";

export class UserServiceStub {

    getAllMentorsPromise() {
        return Promise.resolve([this.getMentor1(), this.getMentor1, this.getMentor2]);
    }

    private getMentor1(): DiversITUser {
        let mentor1 = {
            uid: 'dummyUID1',
            role: 2,
            firstname: 'Diana',
            lastname: 'Dummy',
            gender: 'Weiblich',
            girlsOnlyMentor: true,
            photoURL: '',
            job: 'DevOps Engineer',
            company: 'Dummy Inc.',
            primaryEducation: 'Primary school',
            secondaryEducation: 'Secondary school',
            universityEducation: 'University',
            backgroundInfo: ['dummy info 1', 'dummy info 2'],
            maxMentees: -1,
            mentees: []
        } as DiversITUser;

        return mentor1;
    }

    private getMentor2(): DiversITUser {
        let mentor2 = {
            uid: 'dummyUID2',
            role: 2,
            firstname: 'David',
            lastname: 'Dummier',
            gender: 'Männlich',
            girlsOnlyMentor: false,
            photoURL: '',
            job: 'Product Owner',
            company: 'Dummy Inc.',
            primaryEducation: 'Primary school',
            secondaryEducation: 'Secondary school',
            universityEducation: 'University',
            backgroundInfo: ['dummy info 1', 'dummy info 2'],
            maxMentees: 1,
            mentees: ['dummyMenteeUID']
        } as DiversITUser;

        return mentor2;
    }

}