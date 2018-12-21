const admin = require("firebase-admin");

module.exports = function (options) {
    let module = {};

    const systemUserName = options.systemUser || "GroupChatManager";
    const dbName = options.dbName || "groupchat";

    module.nuke = function nuke() {
        let db = admin.database();
        let dbRef = db.ref(dbName);
        return dbRef.remove();
    };

    module.updateUsersOfThreadId = function updateUsersOfThreadId(threadId, users) {
        if (threadId === undefined || threadId === null) {
            return;
        }

        let db = admin.database();
        let threadRef = db.ref(dbName + "/threads/").child(threadId);

        let usersJSON = {};
        users.forEach(user => {
            usersJSON[user] = 'member';
        });

        threadRef.child('users').once("value", function (snap) {
            let oldUsers = snap.val();
            let oldUsersKeys = Object.keys(oldUsers);

            let difference = removedItems(oldUsersKeys, users);
            difference.forEach(removedUser => {
                // todo: remove the thread from old users's threadsList
                // console.log('removeduser:', removedUser);
                // let rf= db.ref(dbName + "/users").child(removedUser).child('threads').child(threadId).delete();
            });

            console.log('removedItems:', difference);
            threadRef.child('users').set(usersJSON);

            update = {};
            update[threadId] = {"invitedBy": systemUserName,};
            users.forEach(function (user) {
                db.ref(dbName + "/users").child(user).child('threads').update(update);
            });
        });
    };

    module.createEventThread = function createEventThread(obj) {
        let subject = obj.subject;
        let initialMessage = obj.initialMessage;

        let db = admin.database();
        var threadsRef = db.ref(dbName + "/threads/");

        let details = {
            "creation-date": new Date().getTime(),
            "creator-entity-id": systemUserName,
            "name": obj.name || subject.name || "Welcome",
            "type_v4": 2,
        };

        let ownerId = obj.owner || subject.owner;

        let users = {};
        users[ownerId] = {status: "member"};
        users[systemUserName] = {status: "owner"};

        return threadsRef.push({details, users})
            .then(snapshot => {
                if (initialMessage) {
                    snapshot.child('messages')
                        .push(systemMessage(initialMessage));
                }

                let threadId = snapshot.key;
                subject.threadId = threadId;
                subject.save().then(() => {
                    let update = {};
                    update[threadId] = {"invitedBy": systemUserName,};
                    Object.keys(users).forEach(function (key) {
                        db.ref(dbName + "/users").child(key).child('threads').update(update);
                    });
                })
            });
    }

    module.sendSystemMessageToEvent = function sendSystemMessageToEvent(opt) {
        let message = opt.message;
        let event = opt.event;
        let threadId = event.threadId;
        if (threadId === undefined || threadId === null) {
            return;
        }

        let db = admin.database();
        let json = systemMessage(message);
        let threadsRef = db.ref(dbName + "/threads/");
        threadsRef.child(threadId).child('messages').push(json);
    };

    function systemMessage(text) {
        let message = {
            "date": new Date().getTime(),
            "json_v2": {
                "text": text,
            },
            "type": 0,
            "user-firebase-id": systemUserName
        };

        return message;
    }

    function removedItems(oldItems, newItems) {

        var a = [], diff = [];
        for (var i = 0; i < oldItems.length; i++) {
            a[oldItems[i]] = true;
        }

        for (var i = 0; i < newItems.length; i++) {
            if (a[newItems[i]]) {
                delete a[newItems[i]];
            }
        }

        for (var k in a) {
            diff.push(k);
        }

        return diff;
    }

    return module;
};


// module.exports = {
//     updateUsersOfThreadId: updateUsersOfThreadId,
//     sendSystemMessageToEvent: sendSystemMessageToEvent,
//     createEventThread: createEventThread,
//     nuke: nuke,
// };