const eventBus = {

    // on() is fi
    on(event, callback) {
        console.log("listening")
        document.addEventListener(event, (e) => callback(e.detail));
    },

    // Fires an event using the CustomEvent API along with some data
    dispatch(event, data) {
        console.log("dispatching event!");
        document.dispatchEvent(new CustomEvent(event, { detail: data }));
    },

    // Removes the attached event form the document object to prevent memory leakage in the app
    remove(event, callback) {
        console.log("removing")
        document.removeEventListener(event, callback);
    },
};

export default eventBus;