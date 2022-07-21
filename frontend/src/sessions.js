function getSessions() {
    let sessions = [];
    const sessionsString = localStorage.getItem('sessions');
    if (sessionsString !== null && sessionsString !== '') {
        sessions = JSON.parse(sessionsString);
    }
    return sessions;
}

function addSession(session) {
    const sessions = getSessions();
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
    const sessions = getSessions();
    sessions.splice(sessions.indexOf(session), 1);
    localStorage.setItem('sessions', JSON.stringify(sessions));
    return sessions;
}

export { getSessions, addSession, deleteSession };
