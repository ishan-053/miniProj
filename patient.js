/*
    PATIENT DASHBOARD
    -----------------

    Responsibilities:

    1. Load patient information
    2. Load patient vitals
    3. Load appointments
    4. Load notifications

    No patient data is stored locally.
*/


document.addEventListener(
    "DOMContentLoaded",
    function () {

        lucide.createIcons();


        loadPatientDashboard();

        loadPatientVitals();

        loadPatientAppointments();

        loadPatientNotifications();

    }
);


/* =========================================
   PATIENT DASHBOARD
========================================= */

async function loadPatientDashboard() {

    try {

        const patientId =
            getPatientId();


        const data = await apiGet(
            `/patients/${patientId}/dashboard`
        );


        if (!data) {
            return;
        }


        displayPatientInformation(
            data.patient
        );


    } catch (error) {

        console.error(
            "Unable to load patient dashboard:",
            error
        );

    }

}


/* =========================================
   PATIENT INFORMATION
========================================= */

function displayPatientInformation(patient) {

    const container =
        document.getElementById(
            "patientInformation"
        );


    if (!container || !patient) {
        return;
    }


    container.innerHTML = `

        <div class="patient-information">

            <h3>
                ${escapeHTML(patient.name)}
            </h3>

            <p>
                Patient ID:
                ${escapeHTML(patient.id)}
            </p>

        </div>

    `;

}


/* =========================================
   PATIENT VITALS
========================================= */

async function loadPatientVitals() {

    try {

        const patientId =
            getPatientId();


        const data = await apiGet(
            `/patients/${patientId}/vitals`
        );


        if (!data || !data.vitals) {
            return;
        }


        const vitals =
            data.vitals;


        document.getElementById(
            "heartRate"
        ).textContent =
            vitals.heartRate ?? "—";


        document.getElementById(
            "spo2"
        ).textContent =
            vitals.spo2 ?? "—";


        document.getElementById(
            "temperature"
        ).textContent =
            vitals.temperature ?? "—";


        document.getElementById(
            "healthStatus"
        ).textContent =
            vitals.healthStatus ?? "—";


    } catch (error) {

        console.error(
            "Unable to load vitals:",
            error
        );

    }

}


/* =========================================
   APPOINTMENTS
========================================= */

async function loadPatientAppointments() {

    try {

        const patientId =
            getPatientId();


        const data = await apiGet(
            `/patients/${patientId}/appointments`
        );


        if (
            !data ||
            !Array.isArray(data.appointments)
        ) {

            return;

        }


        displayAppointments(
            data.appointments
        );


    } catch (error) {

        console.error(
            "Unable to load appointments:",
            error
        );

    }

}


/* =========================================
   DISPLAY APPOINTMENTS
========================================= */

function displayAppointments(
    appointments
) {

    const container =
        document.getElementById(
            "appointmentsContainer"
        );


    if (!container) {
        return;
    }


    if (appointments.length === 0) {
        return;
    }


    container.innerHTML = "";


    appointments.forEach(
        function (appointment) {

            const element =
                document.createElement("div");


            element.className =
                "appointment-record";


            element.innerHTML = `

                <strong>
                    Appointment
                </strong>

                <p>
                    ${escapeHTML(
                        appointment.department
                    )}
                </p>

            `;


            container.appendChild(
                element
            );

        }
    );

}


/* =========================================
   NOTIFICATIONS
========================================= */

async function loadPatientNotifications() {

    try {

        const patientId =
            getPatientId();


        const data = await apiGet(
            `/patients/${patientId}/notifications`
        );


        if (
            !data ||
            !Array.isArray(data.notifications)
        ) {

            return;

        }


        displayNotifications(
            data.notifications
        );


    } catch (error) {

        console.error(
            "Unable to load notifications:",
            error
        );

    }

}


/* =========================================
   DISPLAY NOTIFICATIONS
========================================= */

function displayNotifications(
    notifications
) {

    const container =
        document.getElementById(
            "notificationsContainer"
        );


    if (!container) {
        return;
    }


    if (notifications.length === 0) {
        return;
    }


    container.innerHTML = "";


    notifications.forEach(
        function (notification) {

            const element =
                document.createElement("div");


            element.className =
                "notification-record";


            element.innerHTML = `

                <strong>
                    ${escapeHTML(
                        notification.type
                    )}
                </strong>

                <p>
                    ${escapeHTML(
                        notification.message
                    )}
                </p>

            `;


            container.appendChild(
                element
            );

        }
    );

}


/* =========================================
   GET PATIENT ID
========================================= */

function getPatientId() {

    /*
        The real patient ID will come
        from authentication.
    */

    const patientId =
        sessionStorage.getItem(
            "patientId"
        );


    if (!patientId) {

        console.warn(
            "Patient ID is not available."
        );

    }


    return patientId;

}


/* =========================================
   HTML ESCAPING
========================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

// ================================
// Patient Dashboard Interactions
// ================================

document.addEventListener("DOMContentLoaded", () => {

    const refreshButton =
        document.getElementById("refreshPatient");

    if (refreshButton) {

        refreshButton.addEventListener("click", async () => {

            refreshButton.disabled = true;

            const icon =
                refreshButton.querySelector("i");

            if (icon) {
                icon.style.animation =
                    "spin 1s linear infinite";
            }

            await loadPatientDashboard();
            await loadPatientVitals();
            await loadPatientAppointments();
            await loadPatientNotifications();

            if (icon) {
                icon.style.animation = "";
            }

            refreshButton.disabled = false;
        });
    }

});