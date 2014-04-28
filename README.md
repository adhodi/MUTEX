MUTEX
=====

A process/task/function is assigned a token, this token is the pass for process to start its execution. The idea is to replicate
MUTEX functionality in javascript.
Suppose you have 4 timeouts as mentioned in demo2.html, now this timeouts shows a popup, so in this case the resource they all want
is window, we need to synchronize the functionality that no two popups ever overlap, either, popups must buffer or timeout starts from the
beginning.
Start with attaching mutex to your shared resource, in this case window

                        $.mutex(window);

now, window object has new property known as _mutex, which provides three services :

isTokenAvailable
----------------

return boolean, if resource is available or not



getToken
--------

returns process id, one must store this id, as only using this, we can release the token.
This api accepts the function as parameter,if token is available, the function executes right away, else will be queued.
Its important to store returned processid, as it is the only pass to release the resource now.

releaseToken
------------


releases the resource. Also it is recommended to assign the id to undefined after calling releaseToken.

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



