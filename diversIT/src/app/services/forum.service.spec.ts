import { TestBed } from '@angular/core/testing';
import { initializeApp } from 'firebase/app';
import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { Answer, Thread } from '../models/forum.model';

import { ForumService } from './forum.service';

describe('ForumService', () => {
  let service: ForumService;
  let dummyThread = {
    title: "Dummy+EhGUrpsf6RVI7ewpJjtt",
    text: "Dies ist ein dummy text",
    tags: ["A","B","C"],      
  } as Thread;
  let dummyThreadTwo = {
    title: "Dummy+EhGUrpsf6RVI7ewpJjuu",
    text: "Dies ist ein dummy text",
    tags: ["A","B","C"],      
  } as Thread;
  let dummyAnswer = {
    threadUID: null,
    text: "DummyA+EhGUrpsf6RVI7ewpJjtt"
  } as Answer;
  let dummyAnswerTwo = {
    threadUID: null,
    text: "DummyA+EhGUrpsf6RVI7ewpJjuu"
  } as Answer

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
    service.createThread(dummyThread).then(() => {
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
    service.createThread(dummyThread).then(() => {
      service.getFirstThreads(1, "created").then((returnedThreads) => {
        getThreadByTitle(dummyThread.title).then((dummyThread) => {
          expect(returnedThreads).toBeTruthy();
          expect(returnedThreads.length).toEqual(1);
          expect(returnedThreads[0].uid).toEqual(dummyThread.uid);

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

  // getNextThreads Test
  it('should get first and second created thread', done => {
    service.createThread(dummyThread).then(() => {
      service.createThread(dummyThreadTwo).then(() => {
        service.getFirstThreads(1, "created").then((firstReturnedThreads) => {
          service.getNextThreads(1, "created").then((secondReturnedThreads) => {
            getThreadByTitle(dummyThreadTwo.title).then((dummyThreadTwo) => {
              expect(firstReturnedThreads).toBeTruthy();
              expect(firstReturnedThreads.length).toEqual(1);
              expect(firstReturnedThreads[0].uid).toEqual(dummyThreadTwo.uid);
              getThreadByTitle(dummyThread.title).then((dummyThread) => {
                expect(secondReturnedThreads).toBeTruthy();
                expect(secondReturnedThreads.length).toEqual(1);
                expect(secondReturnedThreads[0].uid).toEqual(dummyThread.uid);
                deleteThreadByTitle(dummyThreadTwo.title).then(() => {
                  deleteThreadByTitle(dummyThread.title).then(() => {
                    getThreadByTitle(dummyThreadTwo.title).then((dataTwo) => {
                      expect(dataTwo).toBeNull();
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
      });
    });
  });

  // getThreadByUID Test
  it('should get dummy thread by uid', done => {
    service.createThread(dummyThread).then(() => {
      getThreadByTitle(dummyThread.title).then((returnThread) => {
        service.getThreadByUID(returnThread.uid).then((returnThreadTwo) => {
          expect(returnThread.uid).toEqual(returnThreadTwo.uid);
          deleteThreadByTitle(dummyThread.title).then(() => {
            getThreadByTitle(dummyThread.title).then((data) => {
                expect(data).toBeNull();
                done();
            });
          });
        })
      })
    });
  });
  
  // incrementThreadViews Test
  it('should increment thread views', done => {
    service.createThread(dummyThread).then(() => {
      getThreadByTitle(dummyThread.title).then((returnedThread) => {
        service.incrementThreadViews(returnedThread.uid).then(() => {
          service.getThreadByUID(returnedThread.uid).then((returnThreadTwo) => {
            expect(returnThreadTwo.views).toEqual(1);
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
  
  // Create Answer Test
  it('should create answer', done => {
    service.createThread(dummyThread).then(() => {
      getThreadByTitle(dummyThread.title).then((returnDummyThread) => {
        dummyAnswer.threadUID = returnDummyThread.uid;
        service.createAnswer(dummyAnswer).then(() => {
          getAnswerByText(dummyAnswer.text).then((returnAnswer) => {
            expect(returnAnswer).toBeTruthy();
            expect(returnAnswer.uid).toBeTruthy();
            expect(returnAnswer.threadUID).toEqual(dummyAnswer.threadUID);
            expect(returnAnswer.text).toEqual(dummyAnswer.text);

            deleteAnswerByText(dummyAnswer.text).then(() => {
              getAnswerByText(dummyAnswer.text).then((returnAnswerTwo) => {
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
  }); 


  /* 
  // getAnwsers Test
  it('should get both dummy answers', done => {
    service.createThread(dummyThread).then(() => {
      getThreadByTitle(dummyThread.title).then((returnDummyThread) => {
        dummyAnswer.threadUID = returnDummyThread.uid;
        dummyAnswerTwo.threadUID = returnDummyThread.uid;
        service.createAnswer(dummyAnswer).then(() => {
          service.createAnswer(dummyAnswerTwo).then(() => {
            service.getAnswers(returnDummyThread.uid).then((returnedAnswers) => {
              expect(returnedAnswers.length).toEqual(2);
              getAnswerByText(dummyAnswer.text).then((returnDummyAnswer) => {
                expect(returnedAnswers[0].uid).toEqual(returnDummyAnswer.uid);
                getAnswerByText(dummyAnswerTwo.text).then((returnDummyAnswerTwo) => {
                  expect(returnedAnswers[1].uid).toEqual(returnDummyAnswerTwo.uid);
                  deleteAnswerByText(returnDummyAnswerTwo.text).then(() => {
                    getAnswerByText(returnDummyAnswerTwo.text).then((deleteData) => {
                      expect(deleteData).toBeNull();
                      deleteAnswerByText(returnDummyAnswer.text).then(() => {
                        getAnswerByText(returnDummyAnswer.text).then((deleteDataTwo) => {
                          expect(deleteDataTwo).toBeNull();
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
            });
          });
        });
      });
    });
  });
  */

  /**
   * Helper functions
   */
  /**
   * Ermitteln eines Threads nach einem mitgegebenen Titel
   * @param threadTitle 
   * @returns 
   */
  async function getThreadByTitle (threadTitle: string) : Promise<Thread>  {
    const q = query(collection(service.db, "threads"),
        where("title", "==", threadTitle));
    const returnedThreads = await getDocs(q);
    if (returnedThreads.size < 1) return null;
    return returnedThreads.docs[0].data() as Thread 
  }
  /**
   * Löschen eines Threads anhand eines mitgegeben Titels
   * @param threadTitle 
   * @returns 
   */
  async function deleteThreadByTitle (threadTitle: string)  {
    const q = query(collection(service.db, "threads"),
        where("title", "==", threadTitle));
    const returnedThreads = await getDocs(q);
    if (returnedThreads.size < 1) return;
    deleteDoc(returnedThreads.docs[0].ref);
  }
  /**
   * Ermitteln einer Antwort eines Threads zu einem mitgegebenen Text
   * @param answerText 
   * @returns 
   */
  async function getAnswerByText (answerText: string) : Promise<Answer> {
    const q = query(collection(service.db, "answers"),
        where("text", "==", answerText));
    const returnedAnswers = await getDocs(q);
    if (returnedAnswers.size < 1) return null;
    return returnedAnswers.docs[0].data() as Answer 
  }
 /**
 * Löschen einer Antwort eines Threads anhand eines mitgegebenen Texts
 * @param answerText 
 * @returns 
 */
  async function deleteAnswerByText (answerText: string) {
    const q = query(collection(service.db, "answers"),
        where("text", "==", answerText));
    const returnedAnswers = await getDocs(q);
    if (returnedAnswers.size < 1) return;
    deleteDoc(returnedAnswers.docs[0].ref);
  }
});
