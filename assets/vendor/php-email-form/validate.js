/**
* PHP Email Form Validation - v3.9 (Fixed)
*/
(function () {
  "use strict";

  const forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const thisForm = this;
      const action = thisForm.getAttribute('action');
      const recaptchaKey = thisForm.getAttribute('data-recaptcha-site-key');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      // Show loading and hide messages
      thisForm.querySelector('.loading')?.classList.add('d-block');
      thisForm.querySelector('.error-message')?.classList.remove('d-block');
      thisForm.querySelector('.sent-message')?.classList.remove('d-block');

      const formData = new FormData(thisForm);

      if (recaptchaKey) {
        if (typeof grecaptcha !== 'undefined') {
          grecaptcha.ready(function () {
            try {
              grecaptcha.execute(recaptchaKey, { action: 'php_email_form_submit' })
                .then(token => {
                  formData.set('recaptcha-response', token);
                  php_email_form_submit(thisForm, action, formData);
                });
            } catch (error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API URL is not loaded!');
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(response => {
        if (response.ok) return response.text();
        throw new Error(`${response.status} ${response.statusText} ${response.url}`);
      })
      .then(data => {
        thisForm.querySelector('.loading')?.classList.remove('d-block');

        if (data.trim() === 'OK') {
          displaySuccess(thisForm, 'Your message has been sent. Thank you!');
          thisForm.reset();
        } else {
          throw new Error(data || `Form submission failed and no error message returned from: ${action}`);
        }
      })
      .catch(error => {
        displayError(thisForm, error);
      });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading')?.classList.remove('d-block');
    const errorMessageEl = thisForm.querySelector('.error-message');
    if (errorMessageEl) {
      errorMessageEl.innerHTML = error;
      errorMessageEl.classList.add('d-block');
    }
  }

  function displaySuccess(thisForm, message) {
    thisForm.querySelector('.loading')?.classList.remove('d-block');
    const successMessageEl = thisForm.querySelector('.sent-message');
    if (successMessageEl) {
      successMessageEl.innerHTML = message;
      successMessageEl.classList.add('d-block');
    }
  }

})();
