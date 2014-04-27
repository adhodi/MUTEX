MUTEX
=====

Mutual exclusion by process to wait for resource like browser screen until its released by the process that currently holds the token.

First you need to bind mutex to the object,say you have multiple time dependent popups, that are independent of each other,
None knows if other is visible or not (demo2.html), in order to synchronise, first initialize the object ,in this case,window
using

                        $().mutex(window);

now, screen object has new property known as _mutex, which provides three services :

isTokenAvailable  : return boolean, if resource is available or not

getToken          : returns process id, one must store this id, as only using this, we can release the token. Pass in the function
                    to getToken which will be executed once the token becomes available.

releaseToken      : releases the resource. Also it is recommended to assign the id to undefined after calling releaseToken.

                        if (screen._mutex.isTokenAvailable()) {
                            pida = screen._mutex.getToken(function () {
                                console.log("executing a");
                                $pop1.css({display: "block"});
                                $mask.css({display: "block"});
                            });
                        }
                        screen._mutex.releaseToken(pida)
                        pida = undefined;

if resource is available,its token is also available, we can directly call for getToken without checking if token is available or not, in
this case,though, the process will be queued and will be executed once the resource become available on FCFS basis.

The process that owns the process, must release the token once it completes execution, else resource will never become available.



