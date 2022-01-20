import { DiversITUser } from "../models/users.model";

export class UserServiceStub {

    getAllMentorsPromise() {
        return Promise.resolve([UserServiceStub.getDummyMentor1(), UserServiceStub.getDummyMentor2(), UserServiceStub.getDummyMentor3()]);
    }

    public static getDummyMentor1(): DiversITUser {
        return {
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
    }

    public static getDummyMentor2(): DiversITUser {
        return {
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
    }

    public static getDummyMentor3(): DiversITUser {
        return {
            uid: 'dummyUID3',
            role: 2,
            firstname: 'Max',
            lastname: 'Muste',
            gender: 'Divers',
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
    }

}