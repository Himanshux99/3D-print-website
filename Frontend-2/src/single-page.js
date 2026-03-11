// Frame & Love - Lithophane Website JavaScript
// This script handles form validation, image preview, price calculation, and form submission
const BACKEND_URL = "http://localhost:8000/api/v1/order";
// Wait for DOM to be fully loaded before accessing elements
document.addEventListener("DOMContentLoaded", function () {
  // Price mapping for different sizes
  const prices = {
    small: 29,
    medium: 49,
    large: 79
  };

  // DOM elements
  const form = document.getElementById("orderForm");
  const priceDisplay = document.getElementById("priceDisplay");
  const sizeRadios = document.querySelectorAll('input[name="frameSize"]');
  const image = document.getElementById("image");
  const imagePreview = document.getElementById("imagePreview");
  const previewImage = document.getElementById("previewImage");
  const successMessage = document.getElementById("successMessage");

  // Update price display when size selection changes
  function updatePrice() {
    const frameSize = document.querySelector('input[name="frameSize"]:checked');
    if (frameSize) {
      const price = prices[frameSize.value];
      priceDisplay.textContent = `$${price}`;
    }
  }

  // Add event listeners to size radio buttons
  sizeRadios.forEach((radio) => {
    radio.addEventListener("change", updatePrice);
  });

  // Image upload preview and validation
  image.addEventListener("change", function (e) {
    const file = e.target.files[0];
    const imageError = document.getElementById("imageError");

    // Reset error state
    imageError.classList.add("hidden");
    image.classList.remove("border-red-500");
    imagePreview.classList.add("hidden");

    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        imageError.textContent =
          "Please upload a valid JPG/PNG image under 10MB.";
        imageError.classList.remove("hidden");
        image.classList.add("border-red-500");
        image.value = "";
        return;
      }

      // Validate file size (10MB = 10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        imageError.textContent =
          "Please upload a valid JPG/PNG image under 10MB.";
        imageError.classList.remove("hidden");
        image.classList.add("border-red-500");
        image.value = "";
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = function (event) {
        previewImage.src = event.target.result;
        imagePreview.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    }
  });

  // Validate individual field
  function validateField(field) {
    const errorSpan = document.getElementById(`${field.id}Error`);
    let isValid = true;

    // Reset error state
    errorSpan.classList.add("hidden");
    field.classList.remove("border-red-500");

    // Full Name validation
    if (field.id === "name") {
      if (field.value.trim() === "") {
        errorSpan.classList.remove("hidden");
        field.classList.add("border-red-500");
        isValid = false;
      }
    }

    // Contact Number validation (numeric, min 10 digits)
    if (field.id === "contact") {
      const phoneRegex = /^\d{10,}$/;
      if (!phoneRegex.test(field.value.replace(/\D/g, ""))) {
        errorSpan.classList.remove("hidden");
        field.classList.add("border-red-500");
        isValid = false;
      }
    }

    // Email validation (only if filled)
    if (field.id === "email" && field.value.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        errorSpan.classList.remove("hidden");
        field.classList.add("border-red-500");
        isValid = false;
      }
    }

    // Frame type validation
    if (field.id === "frameType") {
      if (field.value === "") {
        errorSpan.classList.remove("hidden");
        field.classList.add("border-red-500");
        isValid = false;
      }
    }

    return isValid;
  }

  // Add blur validation to fields
  document.getElementById("name").addEventListener("blur", function () {
    validateField(this);
  });

  document.getElementById("contact").addEventListener("blur", function () {
    validateField(this);
  });

  document.getElementById("email").addEventListener("blur", function () {
    validateField(this);
  });

  document.getElementById("frameType").addEventListener("change", function () {
    validateField(this);
  });

  // Form submission handler
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Hide success message
    successMessage.classList.add("hidden");

    // Validate all required fields
    let isFormValid = true;

    // Validate full name
    const name = document.getElementById("name");
    if (!validateField(name)) {
      isFormValid = false;
    }

    // Validate contact number
    const contact = document.getElementById("contact");
    if (!validateField(contact)) {
      isFormValid = false;
    }

    // Validate email (if provided)
    const email = document.getElementById("email");
    if (email.value.trim() !== "" && !validateField(email)) {
      isFormValid = false;
    }

    // Validate image upload
    const imageError = document.getElementById("imageError");
    if (!image.files[0]) {
      imageError.textContent =
        "Please upload a valid JPG/PNG image under 10MB.";
      imageError.classList.remove("hidden");
      image.classList.add("border-red-500");
      isFormValid = false;
    }

    // Validate size selection
    const frameSize = document.querySelector('input[name="frameSize"]:checked');
    const sizeError = document.getElementById("sizeError");
    if (!frameSize) {
      sizeError.classList.remove("hidden");
      isFormValid = false;
    }

    // Validate frame type
    const frameType = document.getElementById("frameType");
    if (!validateField(frameType)) {
      isFormValid = false;
    }

    // If form is invalid, scroll to first error and stop
    if (!isFormValid) {
      const firstError = document.querySelector(".border-red-500");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // If form is valid, create FormData and submit
    const formData = new FormData();
    formData.append("name", name.value.trim());
    formData.append("contact", contact.value.trim());
    formData.append("email", email.value.trim());
    formData.append("image", image.files[0]);
    formData.append("frameSize", frameSize.value);
    formData.append("frameType", frameType.value);
    formData.append("notes", document.getElementById("notes").value.trim());

    // Send data to backend (align port with backend default 3000)
    fetch(BACKEND_URL, {
      method: "POST",
      mode: "cors",
      body: formData
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Order created:", data);
        successMessage.classList.remove("hidden");
        successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
        form.reset();

        imagePreview.classList.add("hidden");
        updatePrice();
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("There was an error submitting your order. Please try again.");
      });
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const hamburgerIcon = document.getElementById("hamburgerIcon");
  const closeIcon = document.getElementById("closeIcon");

  // Toggle mobile menu on button click
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
      hamburgerIcon.classList.toggle("hidden");
      closeIcon.classList.toggle("hidden");
    });
  }

  // Close mobile menu when a link is clicked
  const mobileMenuLinks = mobileMenu.querySelectorAll("a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.add("hidden");
      hamburgerIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
    });
  });

  // Initialize price on page load
  updatePrice();
});
