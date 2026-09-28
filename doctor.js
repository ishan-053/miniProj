/*
    DOCTOR DASHBOARD
    ----------------

    Responsibilities:

    1. Load dashboard statistics
    2. Load patient records
    3. Load critical alerts
    4. Display backend data
    5. Handle API errors

    No patient data is stored in this file.
*/


document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
            Initialize icons
        */

        lucide.createIcons();


        /*
            Load dashboard information
        */

        loadDoctorDashboard();

        loadDoctorPatients();

        loadDoctorAlerts();

    }
);


/* =========================================
   DOCTOR DASHBOARD STATISTICS
========================================= */

async function loadDoctorDashboard() {

    try {

        /*
            Temporary ID source.

            Later this will come from the
            authenticated user/session.
        */

        const doctorId =
            getDoctorId();


        const data = await apiGet(
            `/doctors/${doctorId}/dashboard`
        );


        /*
            Check that statistics exist
        */

        if (
            !data ||
            !data.statistics
        ) {

            console.warn(
                "Dashboard statistics not available."
            );

            return;

        }


        /*
            Update dashboard cards
        */

        document.getElementById(
            "totalPatients"
        ).textContent =
            data.statistics.totalPatients ?? "—";


        document.getElementById(
            "criticalPatients"
        ).textContent =
            data.statistics.criticalPatients ?? "—";


        document.getElementById(
            "appointments"
        ).textContent =
            data.statistics.appointments ?? "—";


        document.getElementById(
            "pendingReports"
        ).textContent =
            data.statistics.pendingReports ?? "—";


    } catch (error) {

        console.error(
            "Unable to load doctor dashboard:",
            error
        );

    }

}


/* =========================================
   DOCTOR PATIENTS
========================================= */

async function loadDoctorPatients() {

    try {

        const doctorId =
            getDoctorId();


        const data = await apiGet(
            `/doctors/${doctorId}/patients`
        );


        /*
            Backend should return:

            {
                patients: []
            }
        */

        if (
            !data ||
            !Array.isArray(data.patients)
        ) {

            console.warn(
                "Patient records not available."
            );

            return;

        }


        displayPatients(
            data.patients
        );


    } catch (error) {

        console.error(
            "Unable to load patients:",
            error
        );

    }

}


/* =========================================
   DISPLAY PATIENTS
========================================= */

function displayPatients(patients) {

    const container =
        document.getElementById(
            "patientsContainer"
        );


    if (!container) {
        return;
    }


    /*
        No records
    */

    if (patients.length === 0) {

        return;

    }


    /*
        Remove empty state
    */

    container.innerHTML = "";


    /*
        Create patient elements
    */

    patients.forEach(
        function (patient) {

            const patientElement =
                document.createElement("div");


            patientElement.className =
                "patient-record";


            /*
                Only use fields defined
                by our API contract.
            */

            patientElement.innerHTML = `

                <div class="patient-record-info">

                    <strong>
                        ${escapeHTML(patient.name)}
                    </strong>

                    <span>
                        Patient ID:
                        ${escapeHTML(patient.id)}
                    </span>

                </div>

            `;


            container.appendChild(
                patientElement
            );

        }
    );

}


/* =========================================
   DOCTOR ALERTS
========================================= */

async function loadDoctorAlerts() {

    try {

        const doctorId =
            getDoctorId();


        const data = await apiGet(
            `/alerts/doctor/${doctorId}`
        );


        /*
            Backend should return:

            {
                alerts: []
            }
        */

        if (
            !data ||
            !Array.isArray(data.alerts)
        ) {

            console.warn(
                "Alerts not available."
            );

            return;

        }


        displayAlerts(
            data.alerts
        );


    } catch (error) {

        console.error(
            "Unable to load alerts:",
            error
        );

    }

}


/* =========================================
   DISPLAY ALERTS
========================================= */

function displayAlerts(alerts) {

    const container =
        document.getElementById(
            "alertsContainer"
        );


    if (!container) {
        return;
    }


    /*
        No alerts
    */

    if (alerts.length === 0) {

        return;

    }


    /*
        Clear empty state
    */

    container.innerHTML = "";


    alerts.forEach(
        function (alert) {

            const alertElement =
                document.createElement("div");


            alertElement.className =
                "alert-record";


            alertElement.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(alert.type)}
                    </strong>

                    <p>
                        ${escapeHTML(alert.message)}
                    </p>

                </div>

                <span>
                    ${escapeHTML(alert.severity)}
                </span>

            `;


            container.appendChild(
                alertElement
            );

        }
    );

}


/* =========================================
   GET DOCTOR ID
========================================= */

function getDoctorId() {

    /*
        Authentication will eventually
        provide the actual doctor ID.

        For now we deliberately DO NOT
        invent an ID.
    */

    const doctorId =
        sessionStorage.getItem(
            "doctorId"
        );


    if (!doctorId) {

        console.warn(
            "Doctor ID is not available."
        );

    }


    return doctorId;

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
// Doctor Dashboard Interactions
// ================================

document.addEventListener("DOMContentLoaded", () => {

    const refreshButton = document.getElementById("refreshDoctor");

    if (refreshButton) {
        refreshButton.addEventListener("click", async () => {

            refreshButton.disabled = true;

            const icon = refreshButton.querySelector("i");

            if (icon) {
                icon.style.animation = "spin 1s linear infinite";
            }

            await loadDoctorDashboard();
            await loadDoctorPatients();
            await loadDoctorAlerts();

            if (icon) {
                icon.style.animation = "";
            }

            refreshButton.disabled = false;
        });
    }

    const searchInput = document.getElementById("patientSearch");

    if (searchInput) {
        searchInput.addEventListener("input", () => {

            const searchTerm =
                searchInput.value.toLowerCase().trim();

            const patients =
                document.querySelectorAll(".patient-record");

            patients.forEach(patient => {

                const text =
                    patient.textContent.toLowerCase();

                patient.style.display =
                    text.includes(searchTerm)
                        ? "flex"
                        : "none";
            });
        });
    }

});