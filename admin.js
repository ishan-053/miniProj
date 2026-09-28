/*
    ADMIN DASHBOARD
    ---------------

    Responsibilities:

    1. Load system statistics
    2. Load patient records
    3. Load doctor records
    4. Load system alerts

    No data is stored locally.
*/


document.addEventListener(
    "DOMContentLoaded",
    function () {

        lucide.createIcons();


        loadAdminDashboard();

        loadAdminPatients();

        loadAdminDoctors();

        loadAdminAlerts();

    }
);


/* =========================================
   ADMIN DASHBOARD
========================================= */

async function loadAdminDashboard() {

    try {

        const data =
            await apiGet(
                "/admin/dashboard"
            );


        if (
            !data ||
            !data.statistics
        ) {

            return;

        }


        const statistics =
            data.statistics;


        document.getElementById(
            "totalPatients"
        ).textContent =
            statistics.totalPatients ?? "—";


        document.getElementById(
            "totalDoctors"
        ).textContent =
            statistics.totalDoctors ?? "—";


        document.getElementById(
            "appointments"
        ).textContent =
            statistics.appointments ?? "—";


        document.getElementById(
            "criticalCases"
        ).textContent =
            statistics.criticalCases ?? "—";


    } catch (error) {

        console.error(
            "Unable to load admin dashboard:",
            error
        );

    }

}


/* =========================================
   ADMIN PATIENTS
========================================= */

async function loadAdminPatients() {

    try {

        const data =
            await apiGet(
                "/admin/patients"
            );


        if (
            !data ||
            !Array.isArray(data.patients)
        ) {

            return;

        }


        displayAdminPatients(
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

function displayAdminPatients(
    patients
) {

    const container =
        document.getElementById(
            "patientsContainer"
        );


    if (!container) {
        return;
    }


    if (patients.length === 0) {
        return;
    }


    container.innerHTML = "";


    patients.forEach(
        function (patient) {

            const element =
                document.createElement("div");


            element.className =
                "patient-record";


            element.innerHTML = `

                <strong>
                    ${escapeHTML(patient.name)}
                </strong>

                <p>
                    Patient ID:
                    ${escapeHTML(patient.id)}
                </p>

            `;


            container.appendChild(
                element
            );

        }
    );

}


/* =========================================
   ADMIN DOCTORS
========================================= */

async function loadAdminDoctors() {

    try {

        const data =
            await apiGet(
                "/admin/doctors"
            );


        if (
            !data ||
            !Array.isArray(data.doctors)
        ) {

            return;

        }


        displayAdminDoctors(
            data.doctors
        );


    } catch (error) {

        console.error(
            "Unable to load doctors:",
            error
        );

    }

}


/* =========================================
   DISPLAY DOCTORS
========================================= */

function displayAdminDoctors(
    doctors
) {

    const container =
        document.getElementById(
            "doctorsContainer"
        );


    if (!container) {
        return;
    }


    if (doctors.length === 0) {
        return;
    }


    container.innerHTML = "";


    doctors.forEach(
        function (doctor) {

            const element =
                document.createElement("div");


            element.className =
                "doctor-record";


            element.innerHTML = `

                <strong>
                    ${escapeHTML(doctor.name)}
                </strong>

                <p>
                    Doctor ID:
                    ${escapeHTML(doctor.id)}
                </p>

            `;


            container.appendChild(
                element
            );

        }
    );

}


/* =========================================
   ADMIN ALERTS
========================================= */

async function loadAdminAlerts() {

    try {

        const data =
            await apiGet(
                "/admin/alerts"
            );


        if (
            !data ||
            !Array.isArray(data.alerts)
        ) {

            return;

        }


        displayAdminAlerts(
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

function displayAdminAlerts(
    alerts
) {

    const container =
        document.getElementById(
            "alertsContainer"
        );


    if (!container) {
        return;
    }


    if (alerts.length === 0) {
        return;
    }


    container.innerHTML = "";


    alerts.forEach(
        function (alert) {

            const element =
                document.createElement("div");


            element.className =
                "alert-record";


            element.innerHTML = `

                <strong>
                    ${escapeHTML(alert.type)}
                </strong>

                <p>
                    ${escapeHTML(alert.message)}
                </p>

            `;


            container.appendChild(
                element
            );

        }
    );

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
// Admin Dashboard Interactions
// ================================

document.addEventListener("DOMContentLoaded", () => {

    const refreshButton =
        document.getElementById("refreshAdmin");

    if (refreshButton) {

        refreshButton.addEventListener("click", async () => {

            refreshButton.disabled = true;

            const icon =
                refreshButton.querySelector("i");

            if (icon) {
                icon.style.animation =
                    "spin 1s linear infinite";
            }

            await loadAdminDashboard();
            await loadAdminPatients();
            await loadAdminDoctors();
            await loadAdminAlerts();

            if (icon) {
                icon.style.animation = "";
            }

            refreshButton.disabled = false;
        });
    }


    // Patient search
    const patientSearch =
        document.getElementById("adminPatientSearch");

    if (patientSearch) {

        patientSearch.addEventListener("input", () => {

            const searchTerm =
                patientSearch.value
                    .toLowerCase()
                    .trim();

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


    // Doctor search
    const doctorSearch =
        document.getElementById("doctorSearch");

    if (doctorSearch) {

        doctorSearch.addEventListener("input", () => {

            const searchTerm =
                doctorSearch.value
                    .toLowerCase()
                    .trim();

            const doctors =
                document.querySelectorAll(".doctor-record");

            doctors.forEach(doctor => {

                const text =
                    doctor.textContent.toLowerCase();

                doctor.style.display =
                    text.includes(searchTerm)
                        ? "flex"
                        : "none";
            });
        });
    }

});