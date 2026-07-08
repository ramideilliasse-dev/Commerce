 // ===============================
// EVENTS.JS
// Gestionnaire d'événements
// ===============================

export const settingsEvents = new EventTarget();

export function emitProfileReady(detail){

    settingsEvents.dispatchEvent(

        new CustomEvent(
            "profileReady",
            {
                detail
            }
        )

    );

}


