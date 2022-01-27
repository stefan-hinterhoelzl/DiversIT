import { TestBed } from '@angular/core/testing';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, deleteDoc, getDocs, query, serverTimestamp, Timestamp, updateDoc, where } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { Answer, Thread } from '../models/forum.model';

import { ForumService } from './forum.service';

// Integration tests with real Database access
describe('ForumService', () => {
  let service: ForumService;
  let dummyThread = {
    title: "Dummy+EhGUrpsf6RVI7ewpJjtt",
    text: "Dies ist ein dummy text",
    tags: ["A","B","C"],
    keywords: [""]
  } as Thread;

  let dummyThreadTwo = {
    title: "Dummy+EhGUrpsf6RVI7ewpJjuu",
    text: "Dies ist ein dummy text",
    tags: ["A", "B", "C"],
    keywords: [""]
  } as Thread;

  let dummyAnswer = {
    threadUID: "",
    text: "DummyA+EhGUrpsf6RVI7ewpJjtt"
  } as Answer;

  beforeEach(() => {
    let app = initializeApp(environment.firebaseConfig);
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForumService);
  });

  // Create Test-Component Test
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Create Thread Test
  it('should create thread', done => {
    // act
    service.createThread(dummyThread).then(() => {

      // assert
      getThreadByTitle(dummyThread.title).then((data) => {
        expect(data).toBeTruthy();
        expect(data.uid).toBeTruthy();
        expect(data.created).toBeTruthy();
        expect(data.title).toEqual(dummyThread.title);
        expect(data.text).toEqual(dummyThread.text);
        expect(data.tags.length).toEqual(dummyThread.tags.length);
        for (let i = 0; i < dummyThread.tags.length; i++) {
          expect(data.tags).toContain(dummyThread.tags[i]);
        }
        expect(data.numberOfAnswers).toEqual(0);
        expect(data.lastAnswerTime).toBeTruthy();
        expect(data.views).toEqual(0);

        // teardown
        deleteThreadByTitle(dummyThread.title).then(() => {
          getThreadByTitle(dummyThread.title).then((data) => {
            expect(data).toBeNull();
            done();
          });
        });
      });
    });
  });

  // getFirstThreads Test
  it('should get first created thread', done => {
    //arrange
    createTestThread(dummyThread).then((uid) => {

      // act
      service.getFirstThreads(1, "created", "").then((returnedThreads) => {

        //assert
        expect(returnedThreads).toBeTruthy();
        expect(returnedThreads.length).toEqual(1);
        expect(returnedThreads[0].uid).toEqual(uid);

        // teardown
        deleteThreadByTitle(dummyThread.title).then(() => {
          getThreadByTitle(dummyThread.title).then((data) => {
            expect(data).toBeNull();
            done();
          });
        });
      });
    });
  });

  // getNextThreads Test
  it('should get first and second created thread', done => {
    // arrange
    let dummyUid1: string;
    let dummyUid2: string;

    createTestThread(dummyThread).then((dummyUid) => {
      dummyUid1 = dummyUid;

      createTestThread(dummyThreadTwo).then((dummyUid) => {
        dummyUid2 = dummyUid;

        // act
        service.getFirstThreads(1, "created", "").then((firstReturnedThreads) => {
          service.getNextThreads(1, "created", "").then((secondReturnedThreads) => {

            // assert
            expect(firstReturnedThreads).toBeTruthy();
            expect(firstReturnedThreads.length).toEqual(1);
            expect(firstReturnedThreads[0].uid).toEqual(dummyUid2);

            expect(secondReturnedThreads).toBeTruthy();
            expect(secondReturnedThreads.length).toEqual(1);
            expect(secondReturnedThreads[0].uid).toEqual(dummyUid1);

            // teardown
            deleteThreadByTitle(dummyThread.title).then(() => {
              getThreadByTitle(dummyThread.title).then((data) => {
                expect(data).toBeNull();

                deleteThreadByTitle(dummyThreadTwo.title).then(() => {
                  getThreadByTitle(dummyThreadTwo.title).then((dataTwo) => {
                    expect(dataTwo).toBeNull();
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  // getThreadByUID Test
  it('should get dummy thread by uid', done => {
    // arrange
    let dummyUid: string;

    createTestThread(dummyThread).then((uid) => {
      dummyUid = uid;

      // act
      service.getThreadByUID(dummyUid).then((returnThreadTwo) => {

        // assert
        expect(dummyUid).toEqual(returnThreadTwo.uid);

        // teardown
        deleteThreadByTitle(dummyThread.title).then(() => {
          getThreadByTitle(dummyThread.title).then((data) => {
            expect(data).toBeNull();
            done();
          });
        });
      })
    })
  });

  // incrementThreadViews Test
  it('should increment thread views', done => {
    // arrange
    let dummyUid: string;
    createTestThread(dummyThread).then((uid) => {
      dummyUid = uid;

      // act
      service.incrementThreadViews(dummyUid).then(() => {

        // assert
        getThreadByTitle(dummyThread.title).then((returnThreadTwo) => {
          expect(returnThreadTwo.views).toEqual(1);

          // teardown
          deleteThreadByTitle(dummyThread.title).then(() => {
            getThreadByTitle(dummyThread.title).then((data) => {
              expect(data).toBeNull();
              done();
            });
          });
        });
      });
    });
  });

  // Create Answer Test
  it('should create answer', done => {
    // arrange
    let dummyThreadUid: string;
    let dummyAnswerCopy = {} as Answer;
    dummyAnswerCopy.text = dummyAnswer.text;

    createTestThread(dummyThread).then((uid) => {
      dummyThreadUid = uid;
      dummyAnswerCopy.threadUID = dummyThreadUid;

      // act
      service.createAnswer(dummyAnswerCopy).then(() => {

        // assert
        getAnswerByText(dummyAnswerCopy.text).then((returnAnswer) => {
          expect(returnAnswer).toBeTruthy();
          expect(returnAnswer.uid).toBeTruthy();
          expect(returnAnswer.threadUID).toEqual(dummyAnswerCopy.threadUID);
          expect(returnAnswer.text).toEqual(dummyAnswerCopy.text);

          // teardown
          deleteAnswerByText(dummyAnswerCopy.text).then(() => {
            getAnswerByText(dummyAnswerCopy.text).then((returnAnswerTwo) => {
              expect(returnAnswerTwo).toBeNull();

              deleteThreadByTitle(dummyThread.title).then(() => {
                getThreadByTitle(dummyThread.title).then((data) => {
                  expect(data).toBeNull();
                  done();
                });
              });
            })
          });
        });
      });
    })
  });

  // getAnswers Test
  it('should get dummy answer', done => {
    // arrange
    let dummyThreadUid: string;
    let dummyAnswerUid: string;

    let dummyAnswerCopy = {} as Answer;
    dummyAnswerCopy.text = dummyAnswer.text;

    createTestThread(dummyThread).then((threadUid) => {
      dummyThreadUid = threadUid;
      dummyAnswerCopy.threadUID = dummyThreadUid;

      createTestAnswer(dummyAnswerCopy).then((answerUid) => {
        dummyAnswerUid = answerUid;

        // act
        service.getAnswers(dummyThreadUid).then((returnedAnswers) => {

          // assert
          expect(returnedAnswers.length).toEqual(1);
          expect(returnedAnswers[0].uid).toEqual(dummyAnswerUid);

          // teardown
          deleteAnswerByText(dummyAnswerCopy.text).then(() => {
            getAnswerByText(dummyAnswerCopy.text).then((deleteData) => {
              expect(deleteData).toBeNull();

              deleteThreadByTitle(dummyThread.title).then(() => {
                getThreadByTitle(dummyThread.title).then((data) => {
                  expect(data).toBeNull();
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  // getNumberOfThreads Test - implicit aggregateThreads cloud function test
  it('should return correct number of threads', async (done) => {
    // arrange
    let expectedThreadCount: number;

    getThreadCount().then(async (num) => {
      expectedThreadCount = num;

      // act
      // wait until cloud function was triggered after last test handling
      await wait(3000);
      service.getNumberOfThreads().then((returnedNumber) => {

        // assert
        expect(returnedNumber).toEqual(expectedThreadCount);
        done();
      });
    });
  });

  /**
   * Helper functions
   */
  /**
   * Create test threads
   * @param thread
   * @returns
  */
  async function createTestThread(thread: Thread): Promise<string> {
    const docRef = collection(service.db, 'threads');
    const ref = await addDoc(docRef, {
      uid: "",
      created: serverTimestamp(),
      title: thread.title,
      text: thread.text,
      tags: thread.tags,
      numberOfAnswers: 0,
      lastAnswerTime: serverTimestamp(),
      views: 0,
      keywords: thread.keywords
    });

    await updateDoc(ref, {
      uid: ref.id
    });

    return ref.id;
  }

  /**
   * Gets the first thread with the given title
   * @param threadTitle
   * @returns
   */
  async function getThreadByTitle(threadTitle: string): Promise<Thread> {
    const q = query(collection(service.db, "threads"),
      where("title", "==", threadTitle));
    const returnedThreads = await getDocs(q);
    if (returnedThreads.size < 1) return null;
    return returnedThreads.docs[0].data() as Thread
  }

  /**
   * Deletes the first thread with the given title
   * @param threadTitle
   * @returns
   */
  async function deleteThreadByTitle(threadTitle: string) {
    const q = query(collection(service.db, "threads"),
      where("title", "==", threadTitle));
    const returnedThreads = await getDocs(q);
    if (returnedThreads.size < 1) return;
    await deleteDoc(returnedThreads.docs[0].ref);
  }

  /**
   * Calculates the number of thread documents currently in the database
   * @returns
   */
  async function getThreadCount(): Promise<number> {
    const q = query(collection(service.db, "threads"));
    let returnedThreads = await getDocs(q);
    const threads = returnedThreads.docs.filter(doc => doc.id != "metadata")
    return threads.length;
  }

  /**
   * Creates a test answer
   * @param answer
   * @returns
   */
  async function createTestAnswer(answer: Answer): Promise<string> {
    const docRef = collection(service.db, 'answers');
    const ref = await addDoc(docRef, {
      uid: "",
      text: answer.text,
      timestamp: serverTimestamp(),
      threadUID: answer.threadUID
    });

    await updateDoc(ref, {
      uid: ref.id
    });

    return ref.id;
  }

  /**
   * Gets first answer with the given text
   * @param answerText
   * @returns
   */
  async function getAnswerByText(answerText: string): Promise<Answer> {
    const q = query(collection(service.db, "answers"),
      where("text", "==", answerText));
    const returnedAnswers = await getDocs(q);
    if (returnedAnswers.size < 1) return null;
    return returnedAnswers.docs[0].data() as Answer
  }

  /**
   * Deletes first answer with the given text
   * @param answerText
   * @returns
   */
  async function deleteAnswerByText(answerText: string) {
    const q = query(collection(service.db, "answers"),
      where("text", "==", answerText));
    const returnedAnswers = await getDocs(q);
    if (returnedAnswers.size < 1) return;
    await deleteDoc(returnedAnswers.docs[0].ref);
  }

  /**
   * Waits for the given amount of milliseconds
   * @param ms milliseconds to wait
   */
  function wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }
});
