export interface JobProfile {
    uid: string;
    title: string;
    shortDescription: string;
    tasks: [string];
    mentorUIDs: [string]
}