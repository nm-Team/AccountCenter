/* eslint-disable prefer-const */
/* eslint-disable no-undef */
function getSessions() {
    let sessions = [];
    let sessionsString = localStorage.getItem('sessions');
    if (sessionsString !== null && sessionsString !== '') {
        sessions = JSON.parse(sessionsString);
    }
    return sessions;
}

function addSession(session) {
    let sessions = getSessions();
    sessions.forEach((element) => {
        if (element.uuid === session.uuid) {
            sessions.splice(sessions.indexOf(element), 1);
        }
    });
    sessions.unshift(session);
    localStorage.setItem('sessions', JSON.stringify(sessions));
    return sessions;
}

function deleteSession(session) {
    let sessions = getSessions();
    sessions.splice(sessions.indexOf(session), 1);
    localStorage.setItem('sessions', JSON.stringify(sessions));
    return sessions;
}

export { getSessions, addSession, deleteSession };
