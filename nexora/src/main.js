import "./style.css";

import {
  createClient
} from "@supabase/supabase-js";


/* =========================
   SUPABASE
========================= */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
  );
}


/* =========================
   MOBILE MENU
========================= */

const menuButton =
  document.getElementById("menuButton");

const mobileMenu =
  document.getElementById("mobileMenu");


menuButton?.addEventListener(
  "click",
  () => {

    mobileMenu.classList.toggle("open");

  }
);


document
  .querySelectorAll("#mobileMenu a")
  .forEach((link) => {

    link.addEventListener(
      "click",
      () => {

        mobileMenu.classList.remove("open");

      }
    );

  });


/* =========================
   PRICING → FORM
========================= */

document
  .querySelectorAll("[data-service]")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const service =
          button.dataset.service;

        const serviceInput =
          document.getElementById("service");

        if (serviceInput) {
          serviceInput.value = service;
        }

      }
    );

  });


/* =========================
   CONTACT FORM
========================= */

const contactForm =
  document.getElementById("contactForm");

const submitButton =
  document.getElementById("submitButton");

const submitText =
  document.getElementById("submitText");

const submitLoading =
  document.getElementById("submitLoading");

const formMessage =
  document.getElementById("formMessage");


function showMessage(
  message,
  type
) {

  formMessage.textContent =
    message;

  formMessage.className =
    `form-message ${type}`;

}


function setLoading(
  loading
) {

  submitButton.disabled =
    loading;

  submitText.classList.toggle(
    "hidden",
    loading
  );

  submitLoading.classList.toggle(
    "hidden",
    !loading
  );

}


/* =========================
   EMAIL VALIDATION
========================= */

function isValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);

}


/* =========================
   FORM SUBMIT
========================= */

contactForm?.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    /* Honeypot anti-spam */

    const honeypot =
      contactForm.elements["website"];

    if (honeypot?.value) {
      return;
    }


    /* Check Supabase */

    if (!supabase) {

      showMessage(
        "The contact system is not configured yet.",
        "error"
      );

      return;

    }


    const formData =
      new FormData(contactForm);


    const name =
      formData.get("name")?.toString().trim();

    const email =
      formData.get("email")?.toString().trim();

    const service =
      formData.get("service")?.toString().trim();

    const budget =
      formData.get("budget")?.toString().trim();

    const message =
      formData.get("message")?.toString().trim();


    /* Validation */

    if (!name || !email || !service || !message) {

      showMessage(
        "Please complete all required fields.",
        "error"
      );

      return;

    }


    if (!isValidEmail(email)) {

      showMessage(
        "Please enter a valid email address.",
        "error"
      );

      return;

    }


    if (name.length > 100) {

      showMessage(
        "Name is too long.",
        "error"
      );

      return;

    }


    if (message.length > 2000) {

      showMessage(
        "Message is too long.",
        "error"
      );

      return;

    }


    setLoading(true);

    showMessage("", "");


    try {

      const {
        error
      } = await supabase
        .from("project_requests")
        .insert({

          name,
          email,
          service,
          budget: budget || null,
          message,

          source: "nexora-website"

        });


      if (error) {

        console.error(
          "Supabase error:",
          error
        );

        throw error;

      }


      contactForm.reset();


      showMessage(
        "Your project request has been sent. We'll get back to you within 1×24 hours.",
        "success"
      );


    } catch (error) {

      console.error(error);

      showMessage(
        "Something went wrong. Please try again later.",
        "error"
      );

    } finally {

      setLoading(false);

    }

  }
);