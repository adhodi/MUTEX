/**
 * Created with IntelliJ IDEA.
 * User: sony
 * Date: 4/27/14
 * Time: 5:21 AM
 * To change this template use File | Settings | File Templates.
 */

/**
 * Created with IntelliJ IDEA.
 * User: Abhinandan
 * Date: 4/26/14
 * Time: 11:55 PM
 * To change this template use File | Settings | File Templates.
 */

(function($) {
    var token = {
        available: true,
        requests: new Queue(),
        owner: undefined,
        notify:function() {
            var obj = this.requests.pop();
            if (obj) {
                this.available = false;
                this.owner = obj[0];
                obj[1](obj[0]);
            }
        },
        releaseToken:function(pid) {
            if (pid && pid === this.owner) {
                this.available = true;
                this.notify();
            }else {
                if (this.requests.contains(pid)){
                    return ("[TOKEN] :RELEASE FAILURE, your request for token is still in queue for " + pid);
                }else {
                    return ("[TOKEN] :RELEASE FAILURE, pid doesn't exists " + pid);
                }
            }
        },
        waitForToken:function(pid, callback) {
            this.requests.push([ pid, callback ]);
        },
        getToken:function(callback) {
            var pid = new Date().getTime();
            if (this.available) {
                this.owner = pid;
                this.available = false;
                setTimeout(function() {
                    callback(pid);
                }, 0);
            }else {
                this.waitForToken(pid, callback);
            }
            return pid;
        }
    };

    function Queue() {
        var storage = [],head = 0,tail = -1;
        this.getStorage=function() {
            return storage;
        };
        this.getHead=function() {
            return head;
        };
        this.setHead=function(val) {
            head = val;
        };
        this.getTail=function() {
            return tail;
        };
        this.setTail=function(val) {
            tail = val;
        };
    }

    Queue.prototype.push =function(item) {
        var storage = this.getStorage();
        storage.push(item);
        this.setHead((this.getHead()) + 1);
        if (this.getTail() === -1){
            this.setTail(0);
        }
    };
    Queue.prototype.pop=function() {
        if (this.isEmpty()){
            return undefined;
        }
        var tail = this.getTail(),result;
        this.setTail(tail + 1);
        result = this.getStorage()[tail];
        this.getStorage()[tail] = undefined;
        return result;
    };
    Queue.prototype.contains=function(pid) {
        var arr = this.getStorage(),i;
        for ( i = 0; i < arr.length; i++) {
            if (arr[i][0] === pid) {
                return true;
            }
        }
        return false;
    };
    Queue.prototype.isEmpty=function() {
        return this.getStorage().length === 0;
    };
    $.fn.mutex ={
        getToken:function(callback) {
            return token.getToken(callback);
        },
        releaseToken:function(pid) {
            token.releaseToken(pid);
        },
        isTokenAvailable:function() {
            return token.available;
        }
    };
})(jQuery);
